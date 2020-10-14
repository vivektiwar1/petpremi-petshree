import {Component, OnDestroy} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {delay, map, takeUntil, tap} from "rxjs/operators";

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ScrollOffset} from 'src/app/app.constant';
import {ToastrService} from 'ngx-toastr';
import {OldCardService} from '../old-card.service';
import {CommonService} from 'src/app/services/common.service';


@Component({
  selector: 'app-old-card',
  templateUrl: './old-card.component.html',
  styleUrls: ['./old-card.component.scss']
})
export class OldCardComponent implements OnDestroy {

  activeLink$: Observable<string>;
  destroy$: Subject<void> = new Subject();
  userDetails: any;
  enquiryForm: FormGroup;
  hiddenNavItems: Array<string> = [];
  titles: Array<any>;
  countries: Array<any>;
  userName: string;

  apiInProgress = {
    userDataLoader: false,
    enquiryLoader: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private oldCardService: OldCardService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private viewportScroller: ViewportScroller
  ) {
    console.log("working")
    this.commonService.hideDashboardNavs();
    this.activeLink$ = this.activatedRoute.fragment.pipe(
      delay(300),
      map(fragment => fragment ? fragment : 'home'),
      tap(() => this.viewportScroller.setOffset([0, ScrollOffset])),
      tap(fragment => this.viewportScroller.scrollToAnchor(fragment)),
      takeUntil(this.destroy$)
    );

    this.activatedRoute.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ userName }) => {
      this.userDetails = null;
      userName ? this.init(userName) : this.navigateToErrorPage();
    })
  }

  async init(userName) {
    this.userName = userName;
    await this.getUserDetails(userName);
  }

  async getUserDetails(userName) {
    console.log("oldcard "+userName)
    try {
      this.apiInProgress.userDataLoader = true;
      const response = await this.oldCardService.getUserDetails(userName).toPromise();
      const userDetails = response?.responseResult?.data?.content?.[0];
      console.log(userDetails);
      if (!userDetails) {
        this.navigateToErrorPage();
        return;
      }

      this.createUserDetails(userDetails);
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }

  async createUserDetails(userDetails) {
    this.createEnquiryForm();
    this.userDetails = {
      ...userDetails,
      avatar: this.oldCardService.getImageLinks(this.userName, 'avatar'),
      coverImage: this.oldCardService.getImageLinks(this.userName, 'cover'),
      images: await this.getImages(),
      videos: await this.getVideos(),
    };
    this.apiInProgress.userDataLoader = false;
    this.createHideNavArray(this.userDetails);
  }

  async getImages() {
    return this.oldCardService.getMediaFiles(this.userName, 'gallery').pipe(
      map((response: any) => (response?.responseResult?.data?.content || []).map(item => {
        return {
          src: this.oldCardService.getImageLinks(this.userName, 'gallery', item.fileName),
          thumb: this.oldCardService.getImageLinks(this.userName, 'gallery', item.fileName),
          caption: item.title
        }
      }))
    ).toPromise();
  }

  async getVideos() {
    return await this.oldCardService.getMediaFiles(this.userName, 'youtube').pipe(
      map((response: any) => (response?.responseResult?.data?.content || []).map(item => {
        return {
          videoId: item['fileName']
        }
      }))
    ).toPromise()
  }

  async createEnquiryForm() {
    const [titles, countries] = await this.getData();
    this.titles = ((titles as any)?.responseResult?.data?.content || []).map(item => {
      return {
        title: item.label && item.label.length ? item.label : item.title,
        id: item.id
      }
    });
    this.countries = ((countries as any)?.responseResult?.data?.content || []).map(item => {
      return {
        code: item.code,
        name: item.name,
        id: item.id,
        minLength: item.fromLength,
        maxLength: item.toLength
      }
    });

    let selectedCountry = this.countries[0];

    this.enquiryForm = this.formBuilder.group({
      titleId: [this.titles[0]['id']],
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)])],
      countryId: [selectedCountry['id'], { updateOn: 'change' }],
      phone: [null, {
        validators: Validators.compose([Validators.minLength(selectedCountry['minLength']), Validators.maxLength(selectedCountry['maxLength'])]),
        updateOn: 'change'
      }],
      message: [null, Validators.required]
    }, { updateOn: 'submit' });

    const phoneControl = this.enquiryForm.get('phone') as FormControl;
    const countryControl = this.enquiryForm.get('countryId');

    countryControl.valueChanges.subscribe(countryCode => {
      selectedCountry = this.countries.find(country => country.id === countryCode);
      phoneControl.setValidators([Validators.minLength(selectedCountry['minLength']), Validators.maxLength(selectedCountry['maxLength'])]);
      phoneControl.updateValueAndValidity();
    });

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value.slice(0, selectedCountry['maxLength'])),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      value !== phoneControl.value && phoneControl.setValue(value);
    })
  }

  getData() {
    return Promise.all([
      this.oldCardService.getTitles().toPromise(),
      this.oldCardService.getCountries().toPromise()
    ]);
  }

  async onSubmit() {

    try {
      this.enquiryForm.markAllAsTouched();
      if (this.enquiryForm.valid) {
        this.apiInProgress.enquiryLoader = true;
        const formData = {
          ...this.enquiryForm.value,
          userName: this.userName,
          mobile: this.enquiryForm.value.phone
        };
        await this.oldCardService.postEnquiry(formData).toPromise();
        this.toastrService.success('Thanks For Reaching Out!');
        this.apiInProgress.enquiryLoader = false;
        this.enquiryForm.reset({
          titleId: this.titles[0]['id'],
          countryId: this.countries[0]['id']
        });
      }
    } catch (error) {
      this.apiInProgress.enquiryLoader = false;
      console.error(error);
      this.toastrService.error(error, 'Api Error.')
    }
  }

  createHideNavArray(response) {
    (!response['images'] || response['images'] && !response['images'].length) && this.hiddenNavItems.push('gallery');
    (!response['videos'] || response['videos'] && !response['videos'].length) && this.hiddenNavItems.push('videos');
  }

  navigateToErrorPage() {
    this.router.navigate(['/404'], {
      skipLocationChange: true
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

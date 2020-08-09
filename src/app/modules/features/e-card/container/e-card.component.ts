import { Component, OnDestroy } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, tap, delay, takeUntil } from "rxjs/operators";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ScrollOffset } from 'src/app/app.constant';
import { ToastrService } from 'ngx-toastr';
import { ECardService } from '../e-card.service';


@Component({
  selector: 'app-e-card',
  templateUrl: './e-card.component.html',
  styleUrls: ['./e-card.component.scss']
})
export class ECardComponent implements OnDestroy {

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
    private eCardService: ECardService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private viewportScroller: ViewportScroller
  ) {
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
      userName ? this.init(userName) : this.navigateToErrorPage();
    })
  }

  async init(userName) {
    this.userName = userName;
    await this.getUserDetails(userName);
    this.createEnquiryForm();
  }

  async getUserDetails(userName) {
    try {
      this.apiInProgress.userDataLoader = true;
      const response = await this.eCardService.getUserDetails(userName).toPromise();
      this.apiInProgress.userDataLoader = false;
      const userDetails = response && response[0];
      if (!userDetails) {
        this.navigateToErrorPage();
        return;
      }
      this.createHideNavArray(userDetails);
      this.userDetails = userDetails;
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }

  async createEnquiryForm() {
    const [titles, countries] = await this.getData();
    this.titles = (titles as Array<any> || []).map(item => {
      return {
        title: item.label && item.label.length ? item.label : item.title,
        id: item.id
      }
    });
    this.countries = (countries as Array<any> || []).map(item => {
      return {
        code: item.code,
        name: item.name,
        id: item.id
      }
    });

    this.enquiryForm = this.formBuilder.group({
      titleId: [this.titles[0]['id']],
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)])],
      countryId: [this.countries[0]['id']],
      phone: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
      message: [null, Validators.required]
    });
    const phoneControl = this.enquiryForm.get('phone');

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      phoneControl.value !== value && value.length <= 10 && phoneControl.setValue(value)
    })
  }

  getData() {
    return Promise.all([
      this.eCardService.getTitles().toPromise(),
      this.eCardService.getCountries().toPromise()
    ]);
  }

  async onSubmit() {
    try {
      if (this.enquiryForm.valid) {
        this.apiInProgress.enquiryLoader = true;
        const formData = {
          ...this.enquiryForm.value,
          userName: this.userName
        };
        await this.eCardService.postEnquiry(formData).toPromise();
        this.toastrService.success('Thanks For Reaching Out!');
        this.apiInProgress.enquiryLoader = false;
        this.enquiryForm.reset();
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

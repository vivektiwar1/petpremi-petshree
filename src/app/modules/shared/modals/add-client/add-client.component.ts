import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ClientsService } from 'src/app/modules/feature/customers/clients/clients.service';
import { ECardService } from 'src/app/modules/feature/e-card/e-card.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { customZoomControl } from 'src/app/breed-identification/shared/map.util';
import $ from 'jquery';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {

  getPicture = false;
  imageToCrop$ = new BehaviorSubject(null);
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('uploadRef') uploadRef: ElementRef<HTMLInputElement>;
  listeners = [];
  selectedIndex = 0;
  image: string;
  // list = [];
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  //   'https://via.placeholder.com/300x300',
  // ];
  // @ViewChild('resultContainer') resultContainer: ElementRef;

  clientForm: FormGroup;
  apiInProgress: boolean;
  countries: Array<any>;
  titles: Array<any>;
  user: any;
  genders: any = [];
  destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private service: ClientsService,
    private matDialog: MatDialog,
    private auth: AuthService,
    private toastrService: ToastrService,
    private eCardService: ECardService,
    private e: ElementRef
  ) {
    this.auth.userData$.subscribe(res => this.user = res);
    this.createForm();
  }

  capturePhoto(photo) {
    this.searchImage(photo);
  }

  upload({files}: any) {
    this.imageToCrop$.next(files[0]);
    this.uploadRef.nativeElement.value = '';
  }

  croppedImage(image = null) {
    if (image) {
      this.searchImage(image);
    }
    this.imageToCrop$.next(null);
  }

  searchImage(item) {
    this.image = item;
  }

  searchPet(pet) {
    console.log(pet);
  }

  showInfo(index) {
    this.selectedIndex = index;
  }

  customZoom(e) {
    const c = document.createElement('div');
    c.style.zIndex = '10';
    this.listeners = customZoomControl(c, e);
    e.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(c);
  }

  async createForm() {
    const [titles, countries, genders] = await this.getData();
    this.titles = ((titles as any)?.responseResult?.data?.content || []).map(item => {
      return {
        title: item.label && item.label.length ? item.label : item.title,
        id: item.id
      };
    });
    this.genders = ((genders as any)?.responseResult?.data?.content || []).map(item => {
      return {
        title: item.name,
        image: item.image,
        id: item.id
      };
    });
    this.countries = ((countries as any)?.responseResult?.data?.content || []).map(item => {
      return {
        code: item.code,
        name: item.name,
        id: item.id,
        minLength: item.fromLength,
        maxLength: item.toLength
      };
    });

    let selectedCountry = this.countries[0];

    this.clientForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: null,
      createdByPartnerId: this.user?.partnerId,
      createdByUserId: this.user?.id,
      activated: false,
      genderId: [this.genders[0].id, Validators.required],
      titleId: [this.titles[0].id],
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)])],
      countryId: [selectedCountry.id, { updateOn: 'change' }],
      phone: [null, {
        validators: Validators.compose([Validators.minLength(selectedCountry.minLength), Validators.maxLength(selectedCountry.maxLength)]),
        updateOn: 'change'
      }],
    });

    const phoneControl = this.clientForm.get('phone') as FormControl;
    const countryControl = this.clientForm.get('countryId');

    countryControl.valueChanges.subscribe(countryCode => {
      selectedCountry = this.countries.find(country => country.id === countryCode);
      phoneControl.setValidators([Validators.minLength(selectedCountry.minLength), Validators.maxLength(selectedCountry.maxLength)]);
      phoneControl.updateValueAndValidity();
    });

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value?.slice(0, selectedCountry.maxLength)),
      takeUntil(this.destroy$)
    ).subscribe(value => value !== phoneControl.value && phoneControl.setValue(value));

  }

  getData() {
    return Promise.all([
      this.eCardService.getTitles().toPromise(),
      this.eCardService.getCountries().toPromise(),
      this.eCardService.getGenders().toPromise()
    ]);
  }

  async onSubmit() {
    try {
      this.clientForm.markAllAsTouched();
      if (this.clientForm.valid) {
        this.apiInProgress = true;
        const formData = {
          ...this.clientForm.value,
          mobile: this.clientForm.value.phone
        };
        delete formData.phone;
        const response: any = await this.service.postCustomer(formData).toPromise();
        const ext = this.image.split(';')[0].split(':')[1].split('/')[1];
        const data = new FormData();
        const file = new File([this.service.imagetoblob(this.image)], `filenName.${ext}`);
        data.append('file', file);
        data.append('randomKey', response?.randomKey);
        await this.service.postCustomerImage(data).toPromise();
        this.toastrService.success('Customer Added successfully!');
        this.apiInProgress = false;
        this.clientForm.reset({
          titleId: this.titles[0].id,
          countryId: this.countries[0].id
        });
        this.image = null;
        this.matDialog.closeAll();
      } else {
        console.log('Contact form invalid.');
      }
    } catch (e) {
      this.apiInProgress = false;
      this.toastrService.error(e.error.responseMessage, 'Api Error.');
    }
  }
}

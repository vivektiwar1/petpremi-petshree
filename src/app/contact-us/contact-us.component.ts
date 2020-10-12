import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ECardService } from '../modules/feature/e-card/e-card.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent{

  disableClose: boolean;
  countries: Array<any>;
  titles: Array<any>;
  contactForm: FormGroup;
  destroy$: Subject<void> = new Subject();
  enquiryLoader: false;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private eCardService: ECardService) {
    this.disableClose = this.router.url === '/contact-us';
    this.createForm();
  }

  async createForm() {
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

    this.contactForm = this.formBuilder.group({
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

    const phoneControl = this.contactForm.get('phone') as FormControl;
    const countryControl = this.contactForm.get('countryId');

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
      this.eCardService.getTitles().toPromise(),
      this.eCardService.getCountries().toPromise()
    ]);
  }

  async onSubmit() {
    try {
      this.contactForm.markAllAsTouched();
      if (this.contactForm.valid) {
        this.enquiryLoader = true;
        const formData = {
          ...this.contactForm.value,
          mobile: this.contactForm.value.phone
        };
        delete formData.phone;
        await this.eCardService.postEnquiry(formData).toPromise();
        this.toastrService.success('Thanks For Reaching Out!');
        this.enquiryLoader = false;
        this.contactForm.reset({
          titleId: this.titles[0]['id'],
          countryId: this.countries[0]['id']
        });
      } else {
        console.log('Contact form invalid.');
      }
    } catch (e) {
      this.enquiryLoader = false;
      console.error(e);
      this.toastrService.error(e.error.responseMessage, 'Api Error.');
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NumberOnlyValidator, WhiteSpaceValidator } from 'src/app/validators/common';
import { ActivatePartnerComponent } from './activate-partner/activate-partner.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  personalForm: FormGroup;
  professionalForm: FormGroup;

  titleList: Array<any>;
  genderList: Array<any>;
  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  pinCodeList: Array<any>;
  professionList: Array<any>;
  userId: number;
  profilePicLink: string;
  coverPicLink: string;
  avatarPicLink: string;

  destroy$: Subject<void> = new Subject<void>();

  apiInProgress = {
    page: false,
    personalForm: false,
    professionalForm: false,
    clinicForm: false,
    certificates: false
  };

  rerender = {
    'Cover': false,
    'Profile': false,
    'Avatar': false
  };

  canCreatePartner: boolean;
  certificatesLink: Array<IAlbum>;


  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private lightbox: Lightbox,
    private auth: AuthService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.loadProfile();
    this.auth.userData$.subscribe(async (res: any) => {
      this.userId = res.id;
      await this.getPersonalFormData();
    });
   }

   async loadProfile(): Promise<void> {
    try {
      this.apiInProgress.page = true;
      [
        // this.userId,
        this.titleList,
        this.genderList,
        this.countryList
      ] = await Promise.all([
        // this.commonService.getUserId(),
        this.commonService.getTitleList(),
        this.commonService.getGenderList(),
        this.commonService.getCountryList()
      ]);
      // let response;
      // this.createPersonalForm(response?.content?.[0] || {});
      // this.createProfessionalForm();
      // this.createClinicForm({});
      this.apiInProgress.page = false;
    } catch (error) {
      this.apiInProgress.page = false;
    }
  }

  async getPersonalFormData() {
    try {
      const response = await this.profileService.getPersonalFormData(this.userId).toPromise();
      this.createPersonalForm(response?.content?.[0] || {});
      this.createProfessionalForm(response?.content?.[0] || {});
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  createPersonalForm(formData) {
    this.avatarPicLink = formData?.avatarURL;
    this.coverPicLink = formData?.coverURL;
    this.profilePicLink = formData?.imageURL;
    this.canCreatePartner = !!formData?.canCreatePartner;
    this.certificatesLink = formData?.certificateURLs.forEach(certificate => {
      return {
        src: certificate,
        thumb: certificate
      }
    });

    let selectedCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    this.personalForm = this.formBuilder.group({
      title: [formData.title ? formData.title?.id : this.titleList?.[0]?.['id'], Validators.required],
      firstName: [formData.firstName ? formData.firstName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      lastName: [formData.lastName ? formData.lastName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      userName: [formData.userName ? formData.userName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      country: [selectedCountry?.id],
      mobile: [formData.mobile ? formData.mobile : null,
        Validators.compose([Validators.required, Validators.minLength(selectedCountry?.minLength || 10),
          Validators.maxLength(selectedCountry?.maxLength || 10)])],
      email: [formData.email ? formData.email : null, Validators.pattern(/^(\w+[\.-])*\w+@(\w+[\.-])*\w+(\.\w{2,7})+$/)],
      dob: [formData.dob ? new Date(formData.dob) : null],
      gender: [formData.gender ? formData.gender?.id : null],
      bio: [formData.bio ? formData.bio : null]
    });

    const phoneControl = this.personalForm.get('mobile') as FormControl;
    const countryControl = this.personalForm.get('country');

    countryControl.valueChanges.subscribe(countryCode => {
      selectedCountry = this.countryList.find(country => country.id === countryCode);
      phoneControl.setValidators([Validators.minLength(selectedCountry?.minLength), Validators.maxLength(selectedCountry?.maxLength)]);
      phoneControl.updateValueAndValidity();
    })

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value && value.slice(0, selectedCountry['maxLength'])),
      takeUntil(this.destroy$)
    ).subscribe(value => phoneControl.setValue(value, { emitEvent: false }));

  }

  async createProfessionalForm(formData) {
    this.professionList = await this.commonService.getProfessionList();
    this.professionalForm = this.formBuilder.group({
      profession: formData.professsion?.id || this.professionList[0].id,
      userExperience: [formData.userExperience ? formData.userExperience / 12 : null, Validators.compose([Validators.required, NumberOnlyValidator])],
      userCharges: [formData.userCharges ? formData.userCharges : null, Validators.compose([Validators.required, NumberOnlyValidator])],
      chargesSlotInMin: [formData.chargesSlotInMin ? formData.chargesSlotInMin : null, Validators.compose([Validators.required, NumberOnlyValidator])],
    });
  }

  async validateUsername() {
    try {
      const userName = this.personalForm.get('userName').value;
      const response = await this.profileService.validateUserName(userName, this.userId).toPromise();
      console.log(response);
      if (!response){
        this.personalForm.controls.userName.setValue('');
        this.toastr.error(`User Name already exists `);
      }
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  getPersonalFormField(key: string) {
    return this.personalForm.get(key) as FormControl;
  }

  getProfessionalFormField(key: string) {
    return this.professionalForm.get(key) as FormControl;
  }

  

  async updateDisplayPicture(files: FileList, type: string) {
    try {
      if (files?.length) {
        const formData: FormData = new FormData();
        formData.append('file', files.item(0), files?.item[0]?.name || `${type.toLowerCase()}-pic.jpg`);
        const response = await this.profileService.updateDisplayPicture(type, formData).toPromise() as any;
        if (response?.image) {
          type === 'Avatar' && (this.avatarPicLink = response.image);
          type === 'Cover' && (this.coverPicLink = response.image);
          type === 'Profile' && (this.profilePicLink = response.image);
          this.refreshImage(type);
          console.log(response.image)
          this.toastr.success(`${type} pic uploaded successfully!`);
        }
      }
    } catch (error) {
      console.error(error)
      this.toastr.error(`${type} pic upload failed!`);
    }
  }

  refreshImage(type) {
    this.rerender[type] = true;
    setTimeout(() => this.rerender[type] = false);
  }

  async onSubmit(formType) {
    console.log(this.personalForm)
    if (this[formType].valid) {
      //   console.log(this[formType].value)
      // return;
      try {
        this.apiInProgress[formType] = true;
        const response = await this.profileService.updateProfileDetails({
          ...this[formType].value,
          ...('userExperience' in this[formType].value ? {
            userExperience: this[formType].value.userExperience ? this[formType].value.userExperience * 12 : null
          } : {}),
          ...this.modifyFormDataForBackend(formType, 'title'),
          ...this.modifyFormDataForBackend(formType, 'country'),
          ...this.modifyFormDataForBackend(formType, 'gender'),
          ...this.modifyFormDataForBackend(formType, 'profession'),
        }, this.userId).toPromise();
        this.apiInProgress[formType] = false;
        this.toastr.success('Saved Successfully!');
      } catch (error) {
        console.error(error);
        this.toastr.error(`Something went wrong!`);
        this.apiInProgress[formType] = false;
      }
    }
  }

  modifyFormDataForBackend(formType, formField) {
    return {
      ...(formField in this[formType].value ?
        {
          [formField]: this[formType].value[formField] ?
            { id: this[formType].value[formField] } : null
        } : {}
      )
    }
  }

  async uploadCertificates(files: FileList, inputRef: HTMLInputElement) {
    try {
      if (files?.length) {
        this.apiInProgress.certificates = true;
        const formData: FormData = new FormData();
        Array.from(files).forEach((file, index) => {
          formData.append('file', file, file?.name || `Certificate-${index}.${file?.type ? file.type.slice(file.type.lastIndexOf('/') + 1) : 'jpg'}`);
        });
        const response = await this.profileService.uploadCertificates(formData).toPromise();
        this.apiInProgress.certificates = false;
        inputRef.value = null;
        console.log(response);
        this.toastr.success(`${files?.length > 1 ? 'Certificates' : 'Certificate'} uploaded successfully!`);
      }
    } catch (error) {
      this.apiInProgress.certificates = false;
      inputRef.value = null;
      this.toastr.error(`Error uploading ${files?.length > 1 ? 'certificates!' : 'certificate!'}`);
      console.error(error)
    }
  }

  viewCertificates() {
    this.lightbox.open(this.certificatesLink, null, {
      alwaysShowNavOnTouchDevices: true,
      fitImageInViewPort: true,
      centerVertically: true,
      showImageNumberLabel: true,
      wrapAround: true,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { NumberOnlyValidator, WhiteSpaceValidator } from 'src/app/validators/common';
import { ActivatePartnerComponent } from './activate-partner/activate-partner.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  personalForm: FormGroup;
  professionalForm: FormGroup;
  clinicForm: FormGroup;
  scheduleControl: FormArray;
  slotsControl: FormArray;

  titleList: Array<any>;
  genderList: Array<any>;
  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  pinCodeList: Array<any>;

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

  weekDays = [
    { name: 'S', value: 'sunday' },
    { name: 'M', value: 'monday' },
    { name: 'T', value: 'tuesday' },
    { name: 'W', value: 'wednesday' },
    { name: 'T', value: 'thursday' },
    { name: 'F', value: 'friday' },
    { name: 'S', value: 'saturday' },
  ];

  canCreatePartner: boolean;
  certificatesLink: Array<IAlbum>;


  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private lightbox: Lightbox,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.apiInProgress.page = true;
      [
        this.userId,
        this.titleList,
        this.genderList,
        this.countryList,
        this.stateList,
        this.cityList,
        this.pinCodeList,
      ] = await Promise.all([
        this.commonService.getUserId(),
        this.commonService.getTitleList(),
        this.commonService.getGenderList(),
        this.commonService.getCountryList(),
        this.commonService.getStateList(),
        this.commonService.getCityList(),
        this.commonService.getPinCodeList(),
      ]);
      await this.getPersonalFormData();
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
      this.createClinicForm({});
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
      userName: [formData.userName ? formData.userName : null, Validators.compose([Validators.required, WhiteSpaceValidator]), this.validateUsername.bind(this)],
      country: [selectedCountry?.id],
      mobile: [formData.mobile ? formData.mobile : null, Validators.compose([Validators.required, Validators.minLength(selectedCountry?.minLength || 10), Validators.maxLength(selectedCountry?.maxLength || 10)])],
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

  createProfessionalForm(formData) {
    this.professionalForm = this.formBuilder.group({
      userExperience: [formData.userExperience ? formData.userExperience / 12 : null, Validators.compose([Validators.required, NumberOnlyValidator])],
      userCharges: [formData.userCharges ? formData.userCharges : null, Validators.compose([Validators.required, NumberOnlyValidator])],
      chargesSlotInMin: [formData.chargesSlotInMin ? formData.chargesSlotInMin : null, Validators.compose([Validators.required, NumberOnlyValidator])],
    });
  }

  createClinicForm(formData) {

    // formData = JSON.stringify(`{"clinicName":"lalalal","clinicCountryId":1,"clinicMobile":"5454542242","clinicAddress":"jhadhagjashdsajh","schedule":[{"scheduleDays":["sunday","monday","tuesday","wednesday"],"slots":[{"from":"12:00 AM","to":"12:00 AM"}]}]}`)
    let selectedClinicCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    const selectedCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    this.clinicForm = this.formBuilder.group({
      clinicName: [formData.clinicName ? formData.clinicName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      clinicCountryId: [selectedClinicCountry?.id],
      clinicMobile: [null, Validators.compose([Validators.required, Validators.minLength(selectedCountry?.minLength || 10), Validators.maxLength(selectedCountry?.maxLength || 10)])],
      clinicAddress: [null, Validators.compose([WhiteSpaceValidator])],
      country: [selectedCountry?.id],
      state: [],
      city: [],
      pinCode: [],
      schedule: this.formBuilder.array([this.createSchedule()])
    });

    const countryControl = this.clinicForm.get('clinicCountryId');
    const phoneControl = this.clinicForm.get('clinicMobile') as FormControl;

    countryControl.valueChanges.subscribe(countryCode => {
      selectedClinicCountry = this.countryList.find(country => country.id === countryCode);
      phoneControl.setValidators([Validators.minLength(selectedCountry?.minLength), Validators.maxLength(selectedCountry?.maxLength)]);
      phoneControl.updateValueAndValidity();
    })

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value && value.slice(0, selectedCountry['maxLength'])),
      takeUntil(this.destroy$)
    ).subscribe(value => phoneControl.setValue(value, { emitEvent: false }));

    this.scheduleControl = this.clinicForm.get('schedule') as FormArray;

    // this.clinicForm.valueChanges.subscribe(value => console.log(value))
  }

  validateUsername(control: AbstractControl): Observable<any> {
    if (control.valueChanges && control.dirty) {
      return control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => this.profileService.validateUserName(value, this.userId).pipe(
          map((response: boolean) => response ? null : { alreadyTaken: true })
        ))
      );
    } else {
      return of(null);
    }
  }

  getPersonalFormField(key: string) {
    return this.personalForm.get(key) as FormControl;
  }

  getProfessionalFormField(key: string) {
    return this.professionalForm.get(key) as FormControl;
  }


  getClinicFormField(key: string) {
    return this.clinicForm.get(key) as FormControl;
  }

  createSchedule() {
    return this.formBuilder.group({
      scheduleDays: [[], Validators.required],
      slots: this.formBuilder.array([
        this.createSlots()
      ])
    })
  }

  createSlots() {
    return this.formBuilder.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
    });
  }

  addSchedule() {
    const control = this.clinicForm.get('schedule') as FormArray;
    control.push(this.createSchedule());
  }

  removeSchedule(scheduleIndex) {
    const control = this.clinicForm.get('schedule') as FormArray;
    control.removeAt(scheduleIndex);
  }

  addSlots(index) {
    ((this.scheduleList[index] as FormGroup).get('slots') as FormArray).push(this.createSlots());
  }

  removeSlots(scheduleIndex, slotIndex) {
    const control = this.clinicForm.get(`schedule.${scheduleIndex}.slots`) as FormArray;
    control.removeAt(slotIndex);
  }

  get scheduleList() {
    return (this.clinicForm.get('schedule') as FormArray).controls;
  }

  getSlotsList(index = 0) {
    // return (this.profileForm.get('schedule') as FormArray).controls;
  }

  selectWeekDays(day, selectionIndex) {
    const control = this.getScheduleDayControl(selectionIndex);
    control.markAsTouched();
    const days = control?.value as Array<string>;
    days.includes(day) ?
      control.setValue(days.filter(item => item !== day)) :
      days.push(day) && control.setValue(days);
    control.updateValueAndValidity();
    console.log(this.clinicForm);
  }

  getScheduleDayControl(index) {
    return this.scheduleList[index].get('scheduleDays') as FormControl
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

  createPartnerAccount() {
    this.matDialog.open(ActivatePartnerComponent, {
      disableClose: true,
      width: "40vw",
      data: {
        userId: this.userId
      }
    })
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

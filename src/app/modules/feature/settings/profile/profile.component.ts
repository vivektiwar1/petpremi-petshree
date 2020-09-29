import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { WhiteSpaceValidator } from 'src/app/validators/common';
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

  countries: Array<any>;
  titleList: Array<any>;

  userId: number;
  profilePicLink: string;
  coverPicLink: string;
  avatarPicLink: string;

  destroy$: Subject<void> = new Subject<void>();

  apiInProgress = {
    page: false,
    personalForm: false,
    professionalForm: false,
    clinicForm: false
  };

  rerender = {
    'Cover': false,
    'Profile': false,
    'Avatar': false
  };


  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.apiInProgress.page = true;
      [this.countries, this.titleList, this.userId] = await Promise.all([
        this.commonService.getCountryList(),
        this.commonService.getTitleList(),
        this.commonService.getUserId(),
      ]);
      await this.getPersonalFormData();
      this.apiInProgress.page = false;
    } catch (error) {
      this.apiInProgress.page = false;
    }
  }

  async getPersonalFormData() {
    try {
      const response = await this.profileService.getPersonalFormData(this.userId).toPromise();
      this.createPersonalForm(response?.content?.[0] || {});
      this.createProfessionalForm();
      this.createClinicForm({});
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  createPersonalForm(formData) {
    this.avatarPicLink = formData?.avatarURL;
    this.coverPicLink = formData?.coverURL;
    this.profilePicLink = formData?.profileUrl;

    let selectedCountry = (this.countries.find(item => item.id === formData.country?.id) || this.countries?.[0]) as any;
    this.personalForm = this.formBuilder.group({
      title: [formData.title ? formData.title?.id : this.titleList?.[0]?.['id'], Validators.required],
      firstName: [formData.firstName ? formData.firstName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      lastName: [formData.lastName ? formData.lastName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      userName: [formData.userName ? formData.userName : null, Validators.compose([Validators.required, WhiteSpaceValidator]), this.validateUsername.bind(this)],
      country: [selectedCountry?.id],
      mobile: [formData.mobile ? formData.mobile : null, Validators.compose([Validators.required, Validators.minLength(selectedCountry?.minLength || 10), Validators.maxLength(selectedCountry?.maxLength || 10)])],
      email: [formData.email ? formData.email : null, Validators.pattern(/^(\w+[\.-])*\w+@(\w+[\.-])*\w+(\.\w{2,7})+$/)],
      dob: [formData.dob ? formData.dob : null],
      gender: [formData.gender ? formData.gender : null],
      bio: [formData.bio ? formData.bio : null]
    });

    const phoneControl = this.personalForm.get('mobile') as FormControl;
    const countryControl = this.personalForm.get('country');

    countryControl.valueChanges.subscribe(countryCode => {
      selectedCountry = this.countries.find(country => country.id === countryCode);
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

  createProfessionalForm() {
    this.professionalForm = this.formBuilder.group({
      userExperience: [null],
      userCharges: [null],
      chargesSlotInMin: [null],
    });
  }

  createClinicForm(formData) {
    let selectedCountry = (this.countries.find(item => item.id === formData.country?.id) || this.countries?.[0]) as any;

    this.clinicForm = this.formBuilder.group({
      clinicName: [null],
      clinicCountryId: [null],
      clinicMobile: [null],
      clinicAddress: [null],
      schedule: this.formBuilder.array([this.createSchedule()])
    });

    this.scheduleControl = this.clinicForm.get('schedule') as FormArray;
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

  createSchedule() {
    return this.formBuilder.group({
      scheduleName: [null, Validators.required],
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

  async updateDisplayPicture(files: FileList, type: string) {
    try {
      if (files?.length) {
        const formData: FormData = new FormData();
        formData.append('file', files.item(0), files?.item[0]?.name || `${type.toLowerCase()}-pic.jpg`);
        const response = await this.profileService.updateDisplayPicture(type, formData).toPromise() as any;
        if (response?.image) {
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
      } catch (error) {
        console.error(error);
        this.toastr.error(`Something went wrong!`);
        this.apiInProgress[formType] = false;
      }
    }
  }

  modifyFormDataForBackend(formType, formField) {
    return {
      ...(formField in this[formType].value ? {
        [formField]: this[formType].value[formField] ? { id: this[formType].value[formField] } : null
      } : {})
    }
  }

  // async onProfessionalFormSubmit() {
  //   console.log(this.personalForm);
  //   if (this.professionalForm.valid) {
  //     try {
  //       this.apiInProgress.professionalForm = true;
  //       const response = await this.profileService.updatePersonalDetails(this.professionalForm.value, this.userId).toPromise();
  //       this.apiInProgress.professionalForm = false;
  //     } catch (error) {
  //       console.error(error);
  //       this.toastr.error(`Something went wrong!`);
  //       this.apiInProgress.professionalForm = false;
  //     }
  //   }
  // }
}

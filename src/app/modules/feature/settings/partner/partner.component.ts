import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WhiteSpaceValidator } from 'src/app/validators/common';
import { ActivatePartnerComponent } from '../profile/activate-partner/activate-partner.component';
import { ProfileService } from '../profile/profile.service';


@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],

})
export class PartnerComponent implements OnInit {
  @Input() clinicIndex: any;
  // clinicForm: FormGroup;
  clinicData: FormGroup;
  partnerForm: FormGroup;
  scheduleControl: FormArray;
  slotsControl: FormArray;
  userId: string;
  partnerDetails: any;
  userDetails: any;

  apiInProgress = {
    page: false,
    clinicForm: false,
    clinicData: false,
    partnerForm: false
  };

  destroy$: Subject<void> = new Subject<void>();

  // weekDays = 
  // [
  //   { name: 'S', value: 'sunday' },
  //   { name: 'M', value: 'monday' },
  //   { name: 'T', value: 'tuesday' },
  //   { name: 'W', value: 'wednesday' },
  //   { name: 'T', value: 'thursday' },
  //   { name: 'F', value: 'friday' },
  //   { name: 'S', value: 'saturday' },
  // ];

  titleList: Array<any>;
  genderList: Array<any>;
  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  clinic: FormArray;
  pinCodeList: Array<any>;
  canCreatePartner: boolean;
  weekDays: Array<any>;
  schedule: Array<any> = [];
  userName: any;
  data: any;
  index: any;
  IndexNumber: any;

  constructor(
    private service: AuthService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.canCreatePartner = !!JSON.parse(localStorage.getItem('userData') || '{}').canCreatePartner;
    this.loadData();
    this.getUserDetails();
  }

  async loadData(): Promise<void> {
    try {
      this.apiInProgress.page = true;
      [
        this.userId,
        this.titleList,
        this.genderList,
        this.countryList,
        this.weekDays,
        this.stateList,
        this.cityList,
        this.pinCodeList,
      ] = await Promise.all([
        this.commonService.getUserId(),
        this.commonService.getTitleList(),
        this.commonService.getGenderList(),
        this.commonService.getCountryList(),
        this.commonService.getDaysList(),
        this.commonService.getStateList(1),
        this.commonService.getCityList(1),
        this.commonService.getPinCodeList(1)

      ]);
      this.createPartnerForm({});
      await this.getPartnerDetails();
      this.createClinicForm({});
      // this.createClinicFormData({});

      this.apiInProgress.page = false;
    } catch (error) {
      this.apiInProgress.page = false;
    }

  }
  async ngOnInit(): Promise<void> {

  }

  async getPartnerDetails() {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const partnerId = userData.partnerId;
      const response: any = await this.profileService.getPartnerDetails(partnerId).toPromise();
      this.partnerDetails = response.responseResult.data.content[0];
      this.partnerForm.controls.businessName.setValue(this.partnerDetails.name);
      this.partnerForm.controls.mobile.setValue(this.partnerDetails.mobile);
      this.partnerForm.controls.email.setValue(this.partnerDetails.email);
      this.partnerForm.controls.fbLink.setValue(this.partnerDetails.fbLink);
      this.partnerForm.controls.instagramLink.setValue(this.partnerDetails.instagramLink);
      this.partnerForm.controls.youtubeLink.setValue(this.partnerDetails.youtubeLink);
      this.partnerForm.controls.twitterLink.setValue(this.partnerDetails.twitterLink);
      this.partnerForm.controls.address.setValue(this.partnerDetails.address);
      this.partnerForm.controls.country.setValue(this.partnerDetails.country?.id);
      this.partnerForm.controls.countryName.setValue(this.partnerDetails.country?.id);
      this.partnerForm.controls.userName.setValue(this.partnerDetails.userName);
      this.partnerForm.controls.address.setValue(this.partnerDetails.address);
      const dataClinic: any = [];
      for (var i = 0; i <= this.partnerDetails.partnerAddresses.length - 1; i++) {
        dataClinic.push(this.createClinicForm(this.partnerDetails.partnerAddresses[i]));
      }
      this.clinic = dataClinic;
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  createPartnerForm(formData) {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    let selectedCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[1]) as any;
    this.partnerForm = this.formBuilder.group({
      userName: [formData.partnerName ? formData.partnerName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      businessName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      // partnerCountryId: [selectedPartnerCountry?.id],
      mobile: [, Validators.compose([Validators.required,
      Validators.minLength(selectedCountry?.minLength || 10),
      Validators.maxLength(selectedCountry?.maxLength || 10)])],
      address: [, Validators.compose([WhiteSpaceValidator])],
      fbLink: [null, Validators.compose([Validators.required, Validators.pattern(reg)])],
      youtubeLink: [null, Validators.compose([Validators.required, Validators.pattern(reg)])],
      instagramLink: [null, Validators.compose([Validators.required, Validators.pattern(reg)])],
      twitterLink: [null, Validators.compose([Validators.required, Validators.pattern(reg)])],
      country: selectedCountry?.id,
      countryName: selectedCountry?.id
    });

    const countryControl = this.partnerForm.get('country');
    const countryNameControl = this.partnerForm.get('countryName');
    const phoneControl = this.partnerForm.get('mobile') as FormControl;

    countryNameControl.valueChanges.subscribe(countryCode => {
      countryControl.setValue(countryCode, { emitEvent: false });
    });
    countryControl.valueChanges.subscribe(countryCode => {
      selectedCountry = this.countryList.find(country => country.id === countryCode);
      countryNameControl.setValue(countryCode, { emitEvent: false });
      phoneControl.setValidators([Validators.minLength(selectedCountry?.minLength), Validators.maxLength(selectedCountry?.maxLength)]);
      phoneControl.updateValueAndValidity();
    });

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value && value.slice(0, selectedCountry.maxLength)),
      takeUntil(this.destroy$)
    ).subscribe(value => phoneControl.setValue(value, { emitEvent: false }));

  }

  getPartnerFormField(key: string) {
    return this.partnerForm.get(key) as FormControl;
  }

  createClinicForm(formData) {
    let selectedClinicCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    let selectedClinicState = (this.stateList?.find(item => item.id === formData.state?.id) || this.stateList?.[formData.state?.id - 1]) as any;
    let selectedClinicCity = (this.cityList?.find(item => item.id === formData.city?.id) || this.cityList?.[0]) as any;
    let selectedClinicPinCode = (this.pinCodeList?.find(item => item.id === formData.pinCode?.id) || this.pinCodeList[0]) as any;
    let selectedCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    // this.clinicForm = this.partnerDetails?.partnerAddresses.map(res => {
    let clinicForm = this.formBuilder.group({
      // this.clinicForm = this.formBuilder.group({
      partnerId: this.partnerDetails.id,
      id: formData.id,
      isPartner: true,
      displayOrder: 1,
      name: [formData.name ? formData.name : '', Validators.compose([Validators.required, WhiteSpaceValidator])],
      latitude: [formData.latitude ? formData.latitude : '', Validators.compose([WhiteSpaceValidator])],
      longitude: [formData.longitude ? formData.longitude : '', Validators.compose([WhiteSpaceValidator])],
      mobile: [formData.mobile ? formData.mobile : '', Validators.compose([Validators.required,
      Validators.minLength(selectedCountry?.minLength || 10),
      Validators.maxLength(selectedCountry?.maxLength || 10)])],
      address: [formData.address ? formData.address : '', Validators.compose([WhiteSpaceValidator])],
      countryName: selectedClinicCountry?.id,
      country: [selectedClinicCountry?.id],
      state: selectedClinicState?.value,
      city: selectedClinicCity?.value,
      pinCode: selectedClinicPinCode?.value,
      businessTimings: this.formBuilder.array([this.createSchedule()]),
      partnerContactNumbers: this.formBuilder.array([this.createPartnerDetails(formData.partnerContactNumbers)])
    });


    const countryControl = clinicForm.get('country');
    const stateControl = clinicForm.get('state');
    const cityControl = clinicForm.get('city');
    const countryNameControl = clinicForm.get('countryName');
    const phoneControl = clinicForm.get('mobile') as FormControl;

    countryNameControl.valueChanges.subscribe(async countryCode => {
      selectedCountry = this.countryList.find(country => country.id === countryCode);
      countryControl.setValue(countryCode, { emitEvent: false });
      this.stateList = await this.commonService.getStateList(countryCode);
    });

    stateControl.valueChanges.subscribe(async stateCode => {
      this.cityList = await this.commonService.getCityList(stateCode);
    });

    cityControl.valueChanges.subscribe(async cityCode => {
      this.pinCodeList = await this.commonService.getPinCodeList(cityCode);
    });

    countryControl.valueChanges.subscribe(async countryCode => {
      selectedClinicCountry = this.countryList.find(country => country.id === countryCode);
      selectedCountry = this.countryList.find(country => country.id === countryCode);
      countryNameControl.setValue(countryCode, { emitEvent: false });
      countryControl.setValue(countryCode, { emitEvent: false });
      this.stateList = await this.commonService.getStateList(countryCode);
      phoneControl.setValidators([Validators.minLength(selectedCountry?.minLength), Validators.maxLength(selectedCountry?.maxLength)]);
      phoneControl.updateValueAndValidity();
    });

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value && value.slice(0, selectedCountry.maxLength)),
      takeUntil(this.destroy$)
    ).subscribe(value => phoneControl.setValue(value, { emitEvent: false }));
    // });
    this.scheduleControl = clinicForm.get('businessTimings') as FormArray;

    return clinicForm;
  }


  createPartnerDetails(formData) {
    var Partner
    if (formData && formData[0]) {
      for (var i = 0; i < formData.length; i++) {
        Partner = this.formBuilder.group({
          country: [formData[i]?.country?.id ? formData[i]?.country?.id : this.countryList[0]?.id],
          title: [formData[i]?.title?.id ? formData[i]?.title?.id : this.titleList[0]?.id],
          mobile: [formData[i].mobile ? formData[i].mobile : '', Validators.compose([Validators.required])],
          firstName: [formData[i].firstName ? formData[i].firstName : '', Validators.required],
          lastName: [formData[i].lastName ? formData[i].lastName : '', Validators.required]
        });
      }
    } else {
      Partner = this.formBuilder.group({
        country: [this.countryList[0].id],
        title: [this.titleList[0].id],
        mobile: ['', Validators.compose([Validators.required])],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]
      });
    }
    return Partner


  }

  async validatePartnerNumber(event, index) {
    try {
      const selectedCountry = this.countryList.find(country => country.id === this.partnerContactsList[index].get('country').value);
      const phone = event.target.value.replace(/\D/g, '').replace(/^0/g, '').slice(0, selectedCountry.maxLength);
      if (phone) {
        this.partnerContactsList[index].get('mobile').setValue(phone);
      }
      let partnerContactDetails: any;
      const response: any = await this.profileService.searchPartnerByNumber(phone).toPromise();
      partnerContactDetails = response.responseResult.data.content[0];
      if (partnerContactDetails) {
        this.partnerContactsList[index].get('firstName').setValue(partnerContactDetails.firstName);
        this.partnerContactsList[index].get('lastName').setValue(partnerContactDetails.lastName);
      }
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  createTitle() {
    return this.formBuilder.group({ id: [null] });
  }

  createCountry() {
    return this.formBuilder.group({ id: [null] });

  }

  addSchedule(index) {
    const control = this.clinic[index].get('businessTimings') as FormArray;
    control.push(this.createSchedule());
  }
  addClinic() {
    const control = this.clinic as FormArray;
    control.push(this.createClinicForm(this.clinic));
  }
  addPartner(index) {
    const control = this.clinic[index].get('partnerContactNumbers') as FormArray;
    control.push(this.createPartnerDetails({}));
  }

  getClinicFormField(key: string) {
    return this.clinicData.get(key) as FormControl;
  }

  createSchedule() {
    return this.formBuilder.group({
      days: [[]],
      timeRange: this.formBuilder.array([
        this.createSlots()
      ])
    });
  }

  createSlots() {
    return this.formBuilder.group({
      fromHours: [null, Validators.required],
      toHours: [null, Validators.required]
    });
  }

  removeSchedule(scheduleIndex) {
    const control = this.clinicData.get('businessTimings') as FormArray;
    control.removeAt(scheduleIndex);
  }

  addSlots(index) {
    ((this.scheduleList[index] as FormGroup).get('timeRange') as FormArray).push(this.createSlots());
  }

  removeSlots(scheduleIndex, slotIndex) {
    const control = this.clinicData.get(`businessTimings.${scheduleIndex}.timeRange`) as FormArray;
    control.removeAt(slotIndex);
  }
  getPartner() {
    this.scheduleList
  }

  getscheduleList(index) {
    this.IndexNumber = index;
    return this.scheduleList
  }
  getpartnerContactsList(index) {
    this.IndexNumber = index;
    return this.partnerContactsList
  }

  get clinicList() {
    return (this.clinic as FormArray).controls;
  }
  get scheduleList() {
    return (this.clinic[this.IndexNumber].get('businessTimings') as FormArray).controls;
  }
  get partnerContactsList() {
    return (this.clinic[this.IndexNumber].get('partnerContactNumbers') as FormArray).controls;
  }

  getSlotsList(index = 0) {
    // return (this.profileForm.get('schedule') as FormArray).controls;
  }

  selectWeekDays(day, selectionIndex) {
    const control = this.getScheduleDayControl(selectionIndex);
    control.markAsTouched();
    const days = control?.value as Array<any>;
    days.includes(day) ?
      control.setValue(days.filter(item => item !== day)) :
      days.push(day) && control.setValue(days);
    control.updateValueAndValidity();
    console.log(days);
  }

  getScheduleDayControl(index) {
    return this.scheduleList[index].get('days') as FormControl;
  }

  createPartnerAccount() {
    this.matDialog.open(ActivatePartnerComponent, {
      disableClose: true,
      width: '40vw',
      data: {
        userId: this.userId
      }
    }).afterClosed().subscribe(partnerId => {
      if (partnerId) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if ('canCreatePartner' in userData) {
          userData.canCreatePartner = false;
          this.canCreatePartner = false;
          userData.partnerId = partnerId;
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      }
    });
  }

  timeRangeModify(Timings) {
    const newTimings = Timings;
    Timings.map((data, slot) => {
      const days = [];
      data.days.map((day) => {
        days.push({ id: day });
      });
      const timeRanges = data.timeRange;
      const newRanges = [];
      timeRanges.map(time => {
        const slotData = {
          fromHours: 0,
          toHours: 0,
          fromMinutes: 0,
          toMinutes: 0,
          displayOrder: 0
        };
        // console.log(time.fromHours)
        const fromHoursBreak = time.fromHours.split(':');
        const fromMinutesBreak = fromHoursBreak[1].split(' ');
        slotData.fromHours = (fromMinutesBreak[1] === 'PM' ? (fromHoursBreak[0] / 1) + 12 : fromHoursBreak[0]) / 1;
        slotData.fromMinutes = fromMinutesBreak[0] / 1;
        const toHoursBreak = time.toHours.split(':');
        const toMinutesBreak = toHoursBreak[1].split(' ');
        slotData.toHours = (toMinutesBreak[1] === 'PM' ? (toHoursBreak[0] / 1) + 12 : toHoursBreak[0]) / 1;
        slotData.toMinutes = (toMinutesBreak[0]) / 1;
        slotData.displayOrder = (newRanges.length + 1) * 10;
        newRanges.push(slotData);
      });
      newTimings[slot].days = days;
      newTimings[slot].timeRange = newRanges;
    });

    return { businessTimings: newTimings };
  }

  modifyPartnerFormData(partners) {
    const partnerContactNumbers = [];
    partners.map((data, index) => {
      const mData = data;
      mData.country = { id: data.country };
      mData.title = { id: data.title };
      partnerContactNumbers.push(mData);
    });
    return { partnerContactNumbers };
  }
  async onSubmit(formType, index) {
    console.log("index value is " + index)
    formType = this.clinic[index].value
    const apiData = {
      ...formType,
      // ...('userExperience' in this[formType] ? {
      //   userExperience: this[formType].userExperience ? this[formType].value.userExperience : null
      // } : {}),

      ...this.modifyFormDataForBackend(formType, 'state'),
      ...this.modifyFormDataForBackend(formType, 'country'),
      ...this.modifyFormDataForBackend(formType, 'city'),
      ...this.modifyFormDataForBackend(formType, 'pinCode'),
      ...this.timeRangeModify(formType.businessTimings),
      ...this.modifyPartnerFormData(formType.partnerContactNumbers)
    };

    delete apiData.countryName;
    delete apiData.id;
    delete apiData.mobile;
    if (formType) {
      try {
        this.apiInProgress[formType] = true;
        console.log(apiData)
        await this.profileService.updateClinicDetails(apiData).toPromise();
        this.apiInProgress[formType] = false;
        this.toastr.success('Saved Successfully!');
      } catch (error) {
        console.error(error);
        this.toastr.error(`Something went wrong!`);
        this.apiInProgress[formType] = false;
      }
    }
  }

  async onSubmitPartner(formType) {
    if (this[formType].valid) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const partnerId = userData.partnerId;

      const formData = {
        ...this[formType].value,
        // ...this.modifyFormDataForBackend(formType, 'country'),
      };
      delete formData.countryName;
      try {
        this.apiInProgress[formType] = true;
        const response: any = await this.profileService.updatePartnerDetails(formData, partnerId).toPromise();
        this.partnerDetails = response.responseResult.data;
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
      ...(formField in formType ?
        {
          [formField]: formType[formField] ?
            { id: formType[formField] } : null
        } : {}
      )

    }
  }

  async getUserDetails() {
    try {
      const data = JSON.parse(localStorage.getItem('userData'));
      const partnerId = data.partnerId;

      const response: any = await this.profileService.getPartnerDetails(partnerId).toPromise();
      this.userDetails = response?.responseResult?.data.content[0].partnerAddresses;
      if (!this.userDetails) {
        this.navigateToErrorPage();
        return;
      }
    } catch (error) {
      this.apiInProgress.page = false;
      console.error(error);
    }
  }

  navigateToErrorPage() {
    this.router.navigate(['/404'], {
      skipLocationChange: true
    })
  }



  async searchUserName() {
    try {
      let partnerDetails: any;
      this.userName = this.partnerForm.get('userName').value;
      const email = this.partnerForm.get('email').value;
      const response: any = await this.profileService.searchUserName(this.userName).toPromise();
      partnerDetails = response.responseResult.data.content[0];

      if (partnerDetails && this.userName !== this.partnerDetails.userName) {
        this.partnerForm.controls.userName.setValue('');
        this.toastr.error(`User Name already exists `);
      }

    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }


  show() {
    console.log(this.clinicData.value);
  }


}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  clinicForm: FormGroup;
  partnerForm:FormGroup;
  scheduleControl: FormArray;
  slotsControl: FormArray;
  userId: string;
  partnerDetails:any


  apiInProgress = {
    page: false,
    clinicForm: false,
    partnerForm:false
  };

  destroy$: Subject<void> = new Subject<void>();

  weekDays = [
    { name: 'S', value: 'sunday' },
    { name: 'M', value: 'monday' },
    { name: 'T', value: 'tuesday' },
    { name: 'W', value: 'wednesday' },
    { name: 'T', value: 'thursday' },
    { name: 'F', value: 'friday' },
    { name: 'S', value: 'saturday' },
  ];

  titleList: Array<any>;
  genderList: Array<any>;
  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  pinCodeList: Array<any>;

  canCreatePartner: boolean;

  constructor(
    private service: AuthService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.canCreatePartner = !!JSON.parse(localStorage.getItem('userData') || '{}').canCreatePartner;
  }

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
      await this.getPartnerDetails();
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
      this.createClinicForm({});
      this.createPartnerForm({});
      console.log(response)
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }
  }

  async getPartnerDetails(){
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const partnerId=userData.partnerId
      const response = await this.profileService.getPartnerDetails(partnerId).toPromise();
      this.partnerDetails=response;
      this.partnerForm.controls['businessName'].setValue(this.partnerDetails.responseResult.data.content[0].name);

      
     
    } catch (error) {
      this.toastr.error(`Something went wrong!`);
      console.log(error);
    }  
  }

  
  
  createPartnerForm(formData) {
console.log(this.countryList)
    // formData = JSON.stringify(`{"clinicName":"lalalal","clinicCountryId":1,"clinicMobile":"5454542242","clinicAddress":"jhadhagjashdsajh","schedule":[{"scheduleDays":["sunday","monday","tuesday","wednesday"],"slots":[{"from":"12:00 AM","to":"12:00 AM"}]}]}`)
    let selectedPartnerCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const selectedCountry = (this.countryList?.find(item => item.id === formData.country?.id) || this.countryList?.[0]) as any;
    this.partnerForm = this.formBuilder.group({
      userName: [formData.partnerName ? formData.partnerName : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      businessName:[null,Validators.compose([Validators.required])],
      email:[null,Validators.compose([Validators.required, Validators.email])],
      // partnerCountryId: [selectedPartnerCountry?.id],
      mobile: [, Validators.compose([Validators.required, Validators.minLength(selectedCountry?.minLength || 10), Validators.maxLength(selectedCountry?.maxLength || 10)])],
      address: [, Validators.compose([WhiteSpaceValidator])],
      fbLink:[null,Validators.compose([Validators.required,Validators.pattern(reg)])],
      youtubeLink:[null,Validators.compose([Validators.required,Validators.pattern(reg)])],
      instagramLink:[null,Validators.compose([Validators.required,Validators.pattern(reg)])],
      twitterLink:[null,Validators.compose([Validators.required,Validators.pattern(reg)])],
      country: [{id:selectedCountry?.id}],

      
    });



    // const countryControl =this.partnerForm.get('partnerCountryId') ;
    // console.log(countryControl)
    const phoneControl = this.partnerForm.get('mobile') as FormControl;

    // countryControl.valueChanges.subscribe(countryCode => {
    //   selectedPartnerCountry = this.countryList.find(country => country.id === countryCode);
    //   phoneControl.setValidators([Validators.minLength(selectedCountry?.minLength), Validators.maxLength(selectedCountry?.maxLength)]);
    //   phoneControl.updateValueAndValidity();
    // })

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      map(value => value && value.replace(/^0/g, '')),
      map(value => value && value.slice(0, selectedCountry['maxLength'])),
      takeUntil(this.destroy$)
    ).subscribe(value => phoneControl.setValue(value, { emitEvent: false }));


  }

  

  getPartnerFormField(key: string) {
    return this.partnerForm.get(key) as FormControl;
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
      state: [{id:""}],
      city: [{id:""}],
      pinCode: [{id:""}],
      businessTimings: this.formBuilder.array([this.createSchedule()]),
      partnerContactNumbers:this.formBuilder.array([this.formBuilder.group({
        id:[null],
        country:this.createCountry(),
        title:this.createTitle(),
        mobile:[null],
        firstName:[null],
        lastName:[null]

      })])
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

    this.scheduleControl = this.clinicForm.get('businessTimings') as FormArray;

    // this.clinicForm.valueChanges.subscribe(value => console.log(value))
  }

 createTitle(){
   return this.formBuilder.group({id:[null]})
 }
 createCountry(){
  return this.formBuilder.group({id:[null]})

 }

  addSchedule() {
    const control = this.clinicForm.get('businessTimings') as FormArray;
    control.push(this.createSchedule());
  }

  getClinicFormField(key: string) {
    return this.clinicForm.get(key) as FormControl;
  }

  createSchedule() {
    return this.formBuilder.group({
      days: [[]],
      timeRange: this.formBuilder.array([
        this.createSlots()
      ])
    })
  }

  createSlots() {
    return this.formBuilder.group({
      fromHours: [null, Validators.required],
      toHours: [null, Validators.required],
    });
  }

  removeSchedule(scheduleIndex) {
    const control = this.clinicForm.get('businessTimings') as FormArray;
    control.removeAt(scheduleIndex);
  }

  addSlots(index) {
    ((this.scheduleList[index] as FormGroup).get('timeRange') as FormArray).push(this.createSlots());
  }

  removeSlots(scheduleIndex, slotIndex) {
    const control = this.clinicForm.get(`businessTimings.${scheduleIndex}.timeRange`) as FormArray;
    control.removeAt(slotIndex);
  }

  get scheduleList() {
    return (this.clinicForm.get('businessTimings') as FormArray).controls;
  }

  getSlotsList(index = 0) {
    // return (this.profileForm.get('schedule') as FormArray).controls;
  }

  selectWeekDays(day, selectionIndex) {
    const control = this.getScheduleDayControl(selectionIndex);
    control.markAsTouched();
    const days = control?.value as Array<any>;
    days.includes(day) ?
      control.setValue(days.filter(item => item!== day)) :
      days.push(day) && control.setValue(days);
    control.updateValueAndValidity();
    console.log(this.clinicForm);
    console.log(this.scheduleList)
    console.log(days)
  }

  getScheduleDayControl(index) {
    return this.scheduleList[index].get('days') as FormControl
  }

  createPartnerAccount() {
    this.matDialog.open(ActivatePartnerComponent, {
      disableClose: true,
      width: "40vw",
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
    })
  }

  async onSubmit(formType) {
    if (this[formType].valid) {
       console.log(this[formType].value)
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



  async onSubmitPartner(formType) {
    if (this[formType].valid) {
        console.log(this[formType].value)
        const userData = JSON.parse(localStorage.getItem('userData'));
        const partnerId=userData.partnerId
        console.log(partnerId)

      
      try {
        this.apiInProgress[formType] = true;
        const response = await this.profileService.updatePartnerDetails(this[formType].value,partnerId).toPromise();
        console.log(response);


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

  


async searchUserName(){
  try {
    let partnerDetails:any
    let userName=this.partnerForm.get('userName').value;
    let email=this.partnerForm.get('email').value;


    const response = await this.profileService.searchUserName(userName).toPromise();
    partnerDetails=response;
    console.log(partnerDetails)

    if(partnerDetails.responseResult.data.content.length>0){
      this.partnerForm.controls['userName'].setValue('');
      this.toastr.error(`User Name already exists `)
    }
 

    

    
   
  } catch (error) {
    this.toastr.error(`Something went wrong!`);
    console.log(error);
  }  
}


show(){
  console.log(this.clinicForm.value)
;}
  

}

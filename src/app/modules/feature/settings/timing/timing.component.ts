import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { WhiteSpaceValidator } from 'src/app/validators/common';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-partner-timing',
  templateUrl: './timing.component.html',
  styleUrls: ['./timing.component.scss']
})
export class TimingComponent implements OnInit {

  // readonly tabLinks = ClientDetailsTabLinks;
  userTiming: FormGroup;
  activeTab: string;
  IndexNumber: any;
  UserPartnerName:any;
  partnerAddressList:Array<any>;
  apiInProgress = {
    page: false,
    formType: false,

  };
  weekDays: Array<any>;
  constructor(
    public commonService: CommonService,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {

  }
  async loadData(): Promise<void> {
    try {
      this.apiInProgress.page = true;
      [
        this.weekDays,
      ] = await Promise.all([
        this.commonService.getDaysList(),
      ]);
      this.apiInProgress.page = false;
    } catch (error) {
      this.apiInProgress.page = false;
    }
  }
  ngOnInit(): void {
    this.CreateUserTiming({})
    this.loadData()
    this.getPartnerDetails()

  }
  async getPartnerDetails(){
    const userData = JSON.parse(localStorage.getItem('userData'));
      const partnerId = userData.partnerId;
    const response: any=await this.profileService.getPartnerDetails(partnerId).toPromise();
    this.UserPartnerName=response?.responseResult?.data?.content[0].name;
    var dataResponse=response?.responseResult?.data?.content[0].partnerAddresses;
    const clinicAddress: any = [];
    for(var i=0;i<=dataResponse.length;i++){
      if(dataResponse[i]?.address){
        clinicAddress.push(dataResponse[i])
      }
    }
    this.partnerAddressList=clinicAddress;
  }

  CreateUserTiming(formData) {
    this.userTiming = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, WhiteSpaceValidator])],
      address: [formData.clinicAddress ? formData.clinicAddress : '', Validators.compose([WhiteSpaceValidator])],
      businessTimings: this.formBuilder.array([this.createSchedule()])
    });
  }
  async onSubmit(formType) {
    const apiData = {
      isPartner: false,
      id:this[formType].value.address,
      ...this.timeRangeModify(this[formType].value.businessTimings),
    };
    if (formType) {
      try {
        this.apiInProgress[formType] = true;
        await this.profileService.updateUserTiming(apiData);
        this.apiInProgress[formType] = false;
        this.toastr.success('Saved Successfully!');
      } catch (error) {
        console.error(error);
        this.toastr.error(`Something went wrong!`);
        this.apiInProgress[formType] = false;
      }
    }
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
  getscheduleList() {
    // this.IndexNumber = index;
    return this.scheduleList
  }
  get scheduleList() {
    return (this.userTiming.get('businessTimings') as FormArray).controls;
  }
  addSchedule() {
    const control = this.userTiming.get('businessTimings') as FormArray;
    control.push(this.createSchedule());
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
  removeSlots(scheduleIndex, slotIndex) {
    const control = this.userTiming.get(`businessTimings.${scheduleIndex}.timeRange`) as FormArray;
    control.removeAt(slotIndex);
  }

  addSlots(index) {
    ((this.scheduleList[index] as FormGroup).get('timeRange') as FormArray).push(this.createSlots());
  }
  removeSchedule(scheduleIndex) {
    const control = this.userTiming.get('businessTimings') as FormArray;
    control.removeAt(scheduleIndex);
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
      newTimings[slot].timeRange = newRanges;
      newTimings[slot].days = days;

    });

    return { businessTimings: newTimings };
  }

}

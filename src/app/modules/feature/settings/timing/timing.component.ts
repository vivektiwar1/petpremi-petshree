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
  addTiming: FormGroup;
  userLeaves: FormGroup;
  activeTab: string;
  IndexNumber: any;
  UserPartnerName: any;
  timings: FormArray;
  Days: Array<any>;
  partnerAddressList: Array<any>;
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
    // this.CreateUserTiming({});
    this.loadData();
    this.getPartnerDetails();
    this.getUserTiming();
    this.CreateUserLeave({});

  }
  async getPartnerDetails() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const partnerId = userData.partnerId;
    const response: any = await this.profileService.getPartnerDetails(partnerId).toPromise();
    this.UserPartnerName = response?.responseResult?.data?.content[0].name;
    var dataResponse = response?.responseResult?.data?.content[0].partnerAddresses;
    const clinicAddress: any = [];
    for (var i = 0; i <= dataResponse.length; i++) {
      if (dataResponse[i]?.address) {
        clinicAddress.push(dataResponse[i])
      }
    }
    this.partnerAddressList = clinicAddress;
  }
  async getUserTiming() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData.id;
    var response: any = await this.profileService.getUserTiming(userId).toPromise();
    response = response?.responseResult?.data?.content[0].partnerAddresses;
    const dataClinic: any = [];
    for (var i = 0; i <= response.length - 1; i++) {
      dataClinic.push(this.CreateUserTiming(response[i]));
    }
    this.timings = dataClinic;
  }


  CreateUserTiming(formData) {
    let userTiming = this.formBuilder.group({
      name: [this.UserPartnerName ? this.UserPartnerName : '', Validators.compose([Validators.required, WhiteSpaceValidator])],
      address:[formData.id? formData.id:'',Validators.compose([WhiteSpaceValidator])],
      businessTimings: this.formBuilder.array([this.createSchedule(formData.businessTimings)])
    });
    return userTiming;
  }
  CreateUserLeave(formData) {
    this.userLeaves = this.formBuilder.group({
      name:[this.UserPartnerName? this.UserPartnerName:'', Validators.compose([Validators.required,WhiteSpaceValidator])],
      address:[formData.id?formData.id:'',Validators.compose([WhiteSpaceValidator])],
      businessLeaves: this.formBuilder.array([this.createLeave()])
    });
    // return userTiming;
  }
  async onSubmit(formType, index) {
    formType = this.timings[index].value
    const apiData = {
      isPartner: false,

      id: formType.address,
      ...this.timeRangeModify(formType.businessTimings),
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
  async onSubmitLeaves(formType) {
    const apiData = {
      ...this.timeRangeModify(this[formType].value.businessLeaves),

    };
    if (formType) {
      try {
        this.apiInProgress[formType] = true;
        // const response:any= await this.profileService.UpdateUserLeaves();
        this.apiInProgress[formType] = false;
        this.toastr.success('Leaves Saved Successfully')

      } catch (error) {
        console.error(error);
        this.toastr.error("Something Went Wrong")
        this.apiInProgress[formType] = false;

      }
    }
  }

  addUserTiming() {
    const control = this.timings as FormArray;
    control.push(this.CreateUserTiming({}));
  }
  addUserLeaves() {
    const control = this.userLeaves.get('businessLeaves') as FormArray;
    control.push(this.CreateUserTiming({}));
  }

  createSchedule(formData) {
    var timing;
    var daystime: any = [];
    if (formData && formData[0]) {
      for (var i = 0; i < formData.length; i++) {
        for (var j = 0; j < formData[i].days.length; j++) {
          daystime.push(formData[i].days[j].id)
        }
        this.Days = daystime;

        timing = this.formBuilder.group({
          days: [this.Days ? this.Days : []],
          timeRange: this.formBuilder.array([
            this.createSlots(formData[i].timeRange)
          ])
        });
      }
    } else {
      timing = this.formBuilder.group({
        days: [[]],
        timeRange: this.formBuilder.array([
          this.createSlots({})
        ])
      });
    }
    return timing;
  }
  createLeave() {
    var timing;
    timing = this.formBuilder.group({
      timeRange: this.formBuilder.array([
        this.createLeaveSlots()
      ])
    });
    return timing;
  }


  createLeaveSlots() {
    var timeRange;
    timeRange = this.formBuilder.group({
      fromHours: [null, Validators.required],
      toHours: [null, Validators.required],
    });
    return timeRange;
  }

  createSlots(formData) {
    var timeRange;
    if (formData && formData[0]) {
      for (var i = 0; i < formData.length; i++) {
        var fromHours = formData[i]?.fromHours + ":" + formData[i]?.fromMinutes;
        var toHours = formData[i]?.toHours + ":" + formData[i]?.toMinutes;
        timeRange = this.formBuilder.group({
          fromHours: [fromHours ? fromHours : '', Validators.required],
          toHours: [toHours ? toHours : '', Validators.required],
        });
      }

    } else {
      timeRange = this.formBuilder.group({
        fromHours: [null, Validators.required],
        toHours: [null, Validators.required],
      });
    }

    return timeRange;
  }
  getscheduleList(index) {
    this.IndexNumber = index;
    return this.scheduleList
  }
  getLeaveList() {
    // this.IndexNumber = index;
    return this.leaveList
  }
  get scheduleList() {
    return (this.timings[this.IndexNumber].get('businessTimings') as FormArray).controls;
  }
  get leaveList() {
    return (this.userLeaves.get('businessLeaves') as FormArray).controls;
  }
  addSchedule() {
    const control = this.timings[this.IndexNumber].get('businessTimings') as FormArray;
    control.push(this.createSchedule({}));
  }
  addLeave() {
    const control = this.userLeaves.get('businessLeaves') as FormArray;
    control.push(this.createLeave());
  }
  selectWeekDays(day, selectionIndex) {
    const control = this.getScheduleDayControl(selectionIndex);
    control.markAsTouched();
    const days = control?.value as Array<any>;
    days.includes(day)
    control.setValue(days.filter(item => item !== day))
    days.push(day) && control.setValue(days);
    control.updateValueAndValidity();
  }

  getScheduleDayControl(index) {
    return this.scheduleList[index].get('days') as FormControl;
  }
  removeSlots(scheduleIndex, slotIndex) {
    const control = this.userTiming.get(`businessTimings.${scheduleIndex}.timeRange`) as FormArray;
    control.removeAt(slotIndex);
  }

  addSlots(index) {
    ((this.scheduleList[index] as FormGroup).get('timeRange') as FormArray).push(this.createSlots({}));
  }
  removeSchedule(scheduleIndex) {
    const control = this.userTiming.get('businessTimings') as FormArray;
    control.removeAt(scheduleIndex);
  }
  removeLeavesSchedule(leaveIndex) {
    const control = this.userLeaves.get('businessLeaves') as FormArray;
    control.removeAt(leaveIndex);
  }

  timeRangeModify(Timings) {
    const newTimings = Timings;
    Timings.map((data, slot) => {
      const days = [];
      if (data.days) {
        data.days.map((day) => {
          days.push({ id: day });
        });
      }

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

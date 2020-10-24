import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-appointmenttime',
  templateUrl: './appointmenttime.component.html',
  styleUrls: ['./appointmenttime.component.scss']
})
export class AppointmenttimeComponent implements OnInit {
  @Input() weekDay: any;
  date: any;
  month: string[] = [];
  monthName: any;
  dayName: any;
  Date: any;
  Time: any;
  currentDate: any;
  @Input() userDetails: any;
  AddDateTime: FormGroup;

  startDate:any;
  aryDates:any;
  private time: FormControl
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.date = new Date();

    this.month = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dayName = this.date.getDay();

    this.currentDate = this.date.getUTCDate();
    this.monthName = this.month[this.date.getMonth()]

    this.AddDateTime = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],

    })
    this.AddDateTime.get('date').valueChanges.subscribe(data => {
      this.Date = data
    })
    this.AddDateTime.get('time').valueChanges.subscribe(data => {
      this.Time = data
    })

    this.startDate = new Date();
 this.aryDates = this.GetDates(this.startDate, 4);
console.log(this.aryDates);


  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
  }
  showDiv() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointmentdetails').style.display = "block";
    // setTimeout(function () {
    //   window.scroll(0, 0);
    // }, 100);
  }
  back() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointment').style.display = "block";
    document.getElementById('home').style.display = "block";
    if (document.getElementById('gallery') && document.getElementById('videos')) {
      document.getElementById('gallery').style.display = "block";
      document.getElementById('videos').style.display = "block";
    }
    document.getElementById('enquiry').style.display = "block";
  }

  GetDates(startDate, daysToAdd) {
    var aryDates = [];

    for (var i = 0; i <= daysToAdd; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      aryDates.push({"Day":this.DayAsString(currentDate.getDay()) , "Date" : currentDate.getDate() });
    }

    return aryDates;
  }

  MonthAsString(monthIndex) {
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    return month[monthIndex];
  }

  DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    return weekdays[dayIndex];
  }

}

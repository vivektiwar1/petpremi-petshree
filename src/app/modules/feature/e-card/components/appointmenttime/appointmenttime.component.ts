import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ECardService} from "../../e-card.service";


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

  startDate: any;
  aryDates: any;
  constructor(
    private formBuilder: FormBuilder,
    private eCardService: ECardService
  ) {
    this.date = new Date();

    this.month = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dayName = this.date.getDay();

    this.currentDate = this.date.getUTCDate();
    this.monthName = this.month[this.date.getMonth()];

    this.AddDateTime = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],

    });
    this.AddDateTime.get('date').valueChanges.subscribe(data => {
      this.Date = data
    });
    this.AddDateTime.get('time').valueChanges.subscribe(data => {
      this.Time = data
    });

    this.startDate = new Date();
    this.aryDates = this.GetDates(this.startDate, 4);
  }

  ngOnInit(): void {
    this.eCardService.scrollTop();
  }
  showDiv() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointmentdetails').style.display = "block";
    setTimeout(function () {
      window.scroll(0, 0);
    }, 100);
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
      aryDates.push({ "Day": this.Days(currentDate.getDay()), "Date": currentDate.getDate() });
    }

    return aryDates;
  }


  Days(dayIndex) {
    var weekdays = new Array(7);
    weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];

    return weekdays[dayIndex];
  }

}

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
  Date:any;
  Time:any;
  currentDate: any;
  @Input() userDetails: any;
  AddDateTime: FormGroup;
  private time:FormControl
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

    this.AddDateTime= this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],

    })
    this.AddDateTime.get('date').valueChanges.subscribe(data => {
      this.Date=data
    })
    this.AddDateTime.get('time').valueChanges.subscribe(data => {
      this.Time=data
    })
   
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

}

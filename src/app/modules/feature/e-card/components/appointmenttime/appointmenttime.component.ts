import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointmenttime',
  templateUrl: './appointmenttime.component.html',
  styleUrls: ['./appointmenttime.component.scss']
})
export class AppointmenttimeComponent implements OnInit {
  @Input() weekDay: any;
  date: any;
  weekday: string[] = [];
  month: string[] = [];
  monthName: any;
  dayName: any;
  currentDate: any;
  @Input() userDetails: any;
  constructor() {
    this.date = new Date();
    this.month = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.dayName = this.date.getDay();
    var month = this.date.getUTCMonth()
    this.currentDate = this.date.getUTCDate();
    this.monthName = this.month[this.date.getMonth()]
  }

  ngOnInit(): void {
  }
  showDiv() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointmentdetails').style.display = "block";
    setTimeout(function(){
      window.scroll(0, 0);
    }, 100);
  }
  back() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointment').style.display = "block";
    document.getElementById('home').style.display = "block";
    if( document.getElementById('gallery') && document.getElementById('videos')){
      document.getElementById('gallery').style.display = "block";
      document.getElementById('videos').style.display = "block";
    }
    document.getElementById('enquiry').style.display = "block";
  }


}

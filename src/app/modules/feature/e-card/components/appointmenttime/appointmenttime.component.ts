import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointmenttime',
  templateUrl: './appointmenttime.component.html',
  styleUrls: ['./appointmenttime.component.scss']
})
export class AppointmenttimeComponent implements OnInit {

  @Input() userDetails: any;

  constructor() { }

  ngOnInit(): void {
  }
  showDiv() {
    document.getElementById('appointmenttime').style.display = "none";

    document.getElementById('appointmentdetails').style.display = "block";
  }
  back() {
    document.getElementById('appointmenttime').style.display = "none";
    document.getElementById('appointment').style.display = "block";
    document.getElementById('home').style.display = "block";
    document.getElementById('gallery').style.display = "block";
    document.getElementById('videos').style.display = "block";
    document.getElementById('enquiry').style.display = "block";
  }
}

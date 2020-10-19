import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() userDetails: any;

  constructor() {}

  ngOnInit(): void {
  }
  showDiv() {
    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointment').style.display = "none";
    document.getElementById('home').style.display = "none";
    document.getElementById('gallery').style.display = "none";
    document.getElementById('videos').style.display = "none";
    document.getElementById('enquiry').style.display = "none";
 }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointmentdetails',
  templateUrl: './appointmentdetails.component.html',
  styleUrls: ['./appointmentdetails.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  @Input() appointmentReason: any;
  @Input() appointmentType: any;
  @Input() appointmentRepeat: any;
  @Input() userDetails: any;
  

  constructor() { }

  ngOnInit(): void {
  }
  showDiv() {
    console.log(this.appointmentType)
    document.getElementById('appointmentdetails').style.display = "none";

    document.getElementById('petdetails').style.display = "block";
  }
  back() {
    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointmentdetails').style.display = "none";
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointmentdetails',
  templateUrl: './appointmentdetails.component.html',
  styleUrls: ['./appointmentdetails.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  @Input() userDetails: any;

  constructor() { }

  ngOnInit(): void {
  }
  showDiv() {
    document.getElementById('petdetails').style.display = "block";
 }
}

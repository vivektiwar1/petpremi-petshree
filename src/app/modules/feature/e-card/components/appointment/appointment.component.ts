import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  @Input() userDetails: any;

  constructor() { }

  ngOnInit(): void {
  }

}

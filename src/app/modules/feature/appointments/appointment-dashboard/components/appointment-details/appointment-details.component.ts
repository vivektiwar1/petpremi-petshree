import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  appointmentId: string;
  @Input('appointmentId') setAppointmentId(appointmentId) {
    console.log(appointmentId)
    this.appointmentId = appointmentId;
  }
  @Output() navigateToAppointments: EventEmitter<void> = new EventEmitter<void>()

  constructor() { }

  ngOnInit(): void {
  }

  goToAppointments() {
    this.navigateToAppointments.emit();
  }

}

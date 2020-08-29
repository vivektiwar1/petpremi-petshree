import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentComponent } from './modals/create-appointment/create-appointment.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-dashboard',
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.scss']
})
export class AppointmentDashboardComponent implements OnInit {

  appointmentId: string;

  constructor(
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.appointmentId = params.appointmentId;
    })
  }

  ngOnInit(): void {
  }

  createAppointment() {
    const dialog = this.matDialog.open(CreateAppointmentComponent, {
      disableClose: true,
      position: {
        top: '0px',
        right: '0px'
      },
      minHeight: '100vh',
      hasBackdrop: true
    });
  }

}

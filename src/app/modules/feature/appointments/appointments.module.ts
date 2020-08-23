import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AppointmentsRoutingModule } from './appointments-routing.module';

import { AppointmentsComponent } from './container/appointments.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RemindersComponent } from './components/reminders/reminders.component';
import { CreateAppointmentComponent } from './modals/create-appointment/create-appointment.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { AppointmentCardComponent } from './components/appointment-card/appointment-card.component';

const matDialogConfig: MatDialogConfig = {
  disableClose: true,
  position: {
    top: '0px',
    right: '0px'
  },
  minHeight: '100vh',
  hasBackdrop: true
}

@NgModule({
  declarations: [
    AppointmentsComponent,
    AppointmentComponent,
    CalendarComponent,
    RemindersComponent,
    CreateAppointmentComponent,
    AppointmentCardComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: matDialogConfig
    }
  ]
})
export class AppointmentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedChartsModule } from '../../shared-charts/shared-charts.module';

import { AppointmentsComponent } from './appointments.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RemindersComponent } from './reminders/reminders.component';

import { AppointmentDashboardComponent } from './appointment-dashboard/appointment-dashboard.component';

import { AppointmentCardComponent } from './appointment-dashboard/components/appointment-card/appointment-card.component';
import { AppointmentDetailsComponent } from './appointment-dashboard/components/appointment-details/appointment-details.component';
import { AppointmentHistoryComponent } from './appointment-dashboard/components/appointment-history/appointment-history.component';
import { PetInfoComponent } from './appointment-dashboard/components/pet-info/pet-info.component';
import { PetVitalsComponent } from './appointment-dashboard/components/pet-vitals/pet-vitals.component';

import { CreateAppointmentComponent } from './appointment-dashboard/modals/create-appointment/create-appointment.component';

import {MatExpansionModule} from '@angular/material/expansion';
import { PetClientSummaryComponent } from './appointment-dashboard/components/pet-client-summary/pet-client-summary.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ResponseInterceptor} from "../../../interceptors/response.interceptor";

@NgModule({
  declarations: [
    AppointmentsComponent,
    AppointmentDashboardComponent,
    CalendarComponent,
    RemindersComponent,
    CreateAppointmentComponent,
    AppointmentCardComponent,
    AppointmentDetailsComponent,
    PetInfoComponent,
    PetVitalsComponent,
    AppointmentHistoryComponent,
    PetClientSummaryComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    MatExpansionModule,
    ReactiveFormsModule,
    SharedModule,
    SharedChartsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
  ]
})
export class AppointmentsModule { }

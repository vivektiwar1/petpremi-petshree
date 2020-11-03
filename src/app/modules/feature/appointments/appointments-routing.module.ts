import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentDashboardComponent } from './appointment-dashboard/appointment-dashboard.component';

import { AppointmentsComponent } from './appointments.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RemindersComponent } from './reminders/reminders.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsComponent,
    children: [
      { path: '',  component: AppointmentDashboardComponent },
      { path: 'dashboard', component: AppointmentDashboardComponent },
      { path: 'reminders', component: RemindersComponent },
      { path: 'calender', component: CalendarComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }

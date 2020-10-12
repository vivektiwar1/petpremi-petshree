import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ResponseInterceptor} from "../../../interceptors/response.interceptor";
import { SharedChartsModule } from '../../shared-charts/shared-charts.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedChartsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
  ]
})
export class DashboardModule { }

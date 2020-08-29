import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplineComponent } from './spline/spline.component';
import { ChartModule } from "angular-highcharts";



@NgModule({
  declarations: [SplineComponent],
  imports: [
    CommonModule,
    ChartModule
  ],
  exports: [
    SplineComponent
  ]
})
export class SharedChartsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplineComponent } from './spline/spline.component';
import { ChartModule } from "angular-highcharts";
import { DonutComponent } from './donut/donut.component';



@NgModule({
  declarations: [SplineComponent,DonutComponent],
  imports: [
    CommonModule,
    ChartModule
  ],
  exports: [
    SplineComponent,
    DonutComponent
  ]
})
export class SharedChartsModule { }

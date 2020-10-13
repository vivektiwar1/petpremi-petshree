import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplineComponent } from './spline/spline.component';
import { ChartModule } from "angular-highcharts";
import { DonutComponent } from './donut/donut.component';
import { BarComponent } from './bar/bar.component';
import { GaugeComponent } from './gauge/gauge.component';



@NgModule({
  declarations: [SplineComponent,DonutComponent,BarComponent,GaugeComponent],
  imports: [
    CommonModule,
    ChartModule
  ],
  exports: [
    SplineComponent,
    DonutComponent,
    BarComponent,
    GaugeComponent
  ]
})
export class SharedChartsModule { }

import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'spline-chart',
  templateUrl: './spline.component.html',
  styleUrls: ['./spline.component.scss']
})
export class SplineComponent implements OnInit {

  splineChart: Chart;

  @Input('chartData') chartData: {
    title: any;
    xAxis: Array<any>;
    yAxis: any;
    tooltip?: any;
    series: Array<any>;
  }

  constructor() { }

  ngOnInit(): void {
    this.splineChart = new Chart({
      chart: {
        type: "spline",
        height: 300

      },
      title: this.chartData.title || null,
      xAxis: this.chartData.xAxis,
      yAxis: this.chartData.yAxis || { title: { text: null } },
      tooltip: this.chartData.tooltip || null,
      series: this.chartData.series,
    })
  }



}

import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit {

  donutChart: Chart;

  @Input('chartData1') chartData1: {
    title: any;
    xAxis: any;
    yAxis: Array<any>;
    tooltip?: any;
    series: Array<any>;
    plotOptions?: any;
    credits?: any;
  }

  constructor() { }

  ngOnInit(): void {
    this.donutChart = new Chart({
      chart: {
        type: "pie",
        height: 300

      },
      title: this.chartData1.title || null,
      xAxis: this.chartData1.xAxis,
      yAxis: this.chartData1.yAxis || { title: { text: null } },
      tooltip: this.chartData1.tooltip || null,
      series: this.chartData1.series,
      plotOptions: this.chartData1.plotOptions,
      credits: this.chartData1.credits,
    })
  }



}

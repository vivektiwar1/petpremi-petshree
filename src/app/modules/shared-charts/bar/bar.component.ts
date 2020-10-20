import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  barChart: Chart;

  @Input('chartData2') chartData2: {
    title: any;
    xAxis: any;
    yAxis: Array<any>;
    tooltip?: any;
    series: Array<any>;
    plotOptions?: any;
    credits?: any;
    legend?: any;
    data?: any;

  }

  constructor() { }

  ngOnInit(): void {
    this.barChart = new Chart({
      chart: {
        type: "column",
        height: 300,
        inverted: false
      },
      title: this.chartData2.title || null,
      xAxis: this.chartData2.xAxis,
      yAxis: this.chartData2.yAxis || { title: { text: null } },
      tooltip: this.chartData2.tooltip || null,
      series: this.chartData2.series,
      plotOptions: this.chartData2.plotOptions,
      credits: this.chartData2.credits,
      legend: this.chartData2.legend,
      data: this.chartData2.data,
    })
  }



}

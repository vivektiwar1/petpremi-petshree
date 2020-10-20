import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'gauge-chart',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {

  gaugeChart: Chart;

  @Input('chartData3') chartData3: {
    title: any;
    xAxis: any;
    yAxis: Array<any>;
    tooltip?: any;
    series: Array<any>;
    plotOptions?: any;
    credits?: any;
    legend?: any;
    pane?: any;
  }

  constructor() { }

  ngOnInit(): void {
    this.gaugeChart = new Chart({
      chart: {
        type: "solidgauge",
        height: 300,
      },
      title: this.chartData3.title || null,
      xAxis: this.chartData3.xAxis,
      yAxis: this.chartData3.yAxis || { title: { text: null } },
      tooltip: this.chartData3.tooltip || null,
      series: this.chartData3.series,
      plotOptions: this.chartData3.plotOptions,
      credits: this.chartData3.credits,
      legend: this.chartData3.legend,
      pane: this.chartData3.pane,
    })
  }



}

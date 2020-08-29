import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-pet-vitals',
  templateUrl: './pet-vitals.component.html',
  styleUrls: ['./pet-vitals.component.scss']
})
export class PetVitalsComponent implements OnInit {

  chartData: Highcharts.Options;
  constructor() { }

  ngOnInit(): void {
    this.chartData = {
      xAxis: {
        categories: ["Apr", "May", "Jun", "Jul", "Aug",]
      },
      // yAxis: {
      //   title: {
      //     text: "Temperature °C"
      //   }
      // },
      tooltip: {
        valueSuffix: " °C"
      },
      series: [
        {
          name: 'Tokyo',
          // @ts-ignore
          data: [7.0, 6.9, 9.5, 14.5, 18.2],
          color: '#4F8FDB'
        },
        {
          name: 'New York',
          // @ts-ignore
          data: [-0.2, 0.8, 5.7, 11.3, 17.0],
          color: '#1BC167'
        }
      ]
    }
  }

}

import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { timer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  chartData: Highcharts.Options;
  chartData1: Highcharts.Options;

  @Output() tabHandler: EventEmitter<string> = new EventEmitter<string>();
  date$ = timer(0, 1000).pipe(
    switchMap(() => of(new Date()))
  );

  constructor(
    private commonService: CommonService,
  ) {
    this.commonService.showDashboardNavs();
  }

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

    this.chartData1 ={
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        symbolRadius: 0,
        symbolPadding: 10,
        itemMarginTop: 40,
        itemStyle: {
          "color": "#fff"
        }
      },
      title: {
        text: 'Donut',
        align: 'center',
        verticalAlign: 'middle',
        y: 0
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: -180,
          center: ['50%', '50%'],
          size: '100%',
          showInLegend: true
        }
      },
      series: [
        {
          name: 'Browsers',
          data: [
            {
              name: '35%',
              y: 35,
              color: "#af5d9c"
            },
            {
              name: '30%',
              y: 30,
              color: "#f19e9c"
            }, {
              name: '35%',
              y: 35,
              color: "#9b2f50"
            }],
          type: 'pie',
          innerSize: '40%',
        }
      ]
    }
  }

  ngOnDestroy() {
    this.commonService.hideDashboardNavs();
  }

}

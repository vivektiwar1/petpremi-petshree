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
  chartData2: Highcharts.Options;
  chartData3: Highcharts.Options;

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
      credits: {
        enabled: false
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
              name: '33%',
              y: 33,
              color: "#af5d9c"
            },
            {
              name: '42%',
              y: 42,
              color: "#f19e9c"
            }, {
              name: '25%',
              y: 25,
              color: "#9b2f50"
            }],
          type: 'pie',
          innerSize: '40%',
        }
      ]
    }

    this.chartData2 ={
      chart: {
        renderTo: 'container',
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: 'Source: Wikipedia.org'
      },
      xAxis: {
        categories: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'st'],
        title: {
            text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
      },
      tooltip: {
        formatter: function() {
            return ''+
                this.series.name +': '+ this.y;
        }
      },
      plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -100,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor: '#FFFFFF',
          shadow: true
      },
      credits: {
          enabled: false
      },
      series: [
        {
          name: 'MALE',
          // @ts-ignore
          data: [26, 31 ,12, 14, 18, 8, 50],
          color: '#efac39'
        },
        {
          name: 'FEMALE',
          // @ts-ignore
          data: [10, 8, 12, 5, 55, 36, 14],
          color: '#608bc5'
        }
      ]
    }

    // this.chartData3 ={
    //   chart: {
    //     'type': 'solidgauge'
    //   },
    //   title: {
    //     text: "Monthly Average Temperature"
    //   },
    //   pane: {
    //      'center': ['50%', '50%'],
    //      'size': '300px',
    //      'startAngle': 0,
    //      'endAngle': 360,
    //      'background': {
    //        'backgroundColor': '#43810b',
    //        'innerRadius': '91%',
    //        'outerRadius': '99%',
    //        'borderWidth': 0
    //      }
    //   },
    //   yAxis: {
    //      'min': 0,
    //      'max': 100,
    //      'labels': {
    //        'enabled': false
    //      },
   
    //      'lineWidth': 0,
    //      'minorTickInterval': null,
    //      'tickPixelInterval': 400,
    //      'tickWidth': 0
    //   },
    //   plotOptions: {
    //        'solidgauge': {
    //            'innerRadius': '90%',
    //            'linecap': 'round',
    //        'stickyTracking': false,
    //        'rounded': true
    //        },
    //   },
    //   series: [
    //     {
    //       name: 'MALE',
    //       // @ts-ignore
    //       data: [85],
    //       color: '#c6ed63',dataLabels: {
    //         'enabled': false
    //       }
    //     }
    //   ]
    // }

  }

  ngOnDestroy() {
    this.commonService.hideDashboardNavs();
  }

}

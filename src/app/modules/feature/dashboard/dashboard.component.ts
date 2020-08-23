import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  constructor(
    private commonService: CommonService,
  ) {
    this.commonService.showDashboardNavs();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.commonService.hideDashboardNavs();
  }

}

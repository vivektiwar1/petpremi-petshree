import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

import { CustomersTabLinks } from "src/app/app.constant";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  tabLinks = CustomersTabLinks;
  activeTab: string;
  appointmentId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.commonService.showDashboardNavs();
    this.activeTab = (this.tabLinks.find(item => item.active) || {})['value'] || '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.appointmentId = params.appointmentId;
    })
  }

  ngOnInit(): void {
  }

  onTabItemClick(tab) {
    console.log(tab)
    this.activeTab = tab;
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

import { SettingsTabLinks } from "src/app/app.constant";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tabLinks: Array<any>;
  activeTab: string;
  appointmentId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.commonService.showDashboardNavs();
    this.tabLinks = SettingsTabLinks.map(item => ({ ...item, active: router.url.includes(item.value) }));
    this.activeTab = (this.tabLinks.find(item => item.active) || {})['value'] || '';
  }

  ngOnInit(): void {
  }

  onTabItemClick(tab) {
    this.router.navigate([`./${tab}`], {
      relativeTo: this.activatedRoute
    });
  }

}

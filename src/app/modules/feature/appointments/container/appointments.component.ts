import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AppointmentsTabLinks } from 'src/app/app.constant';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {

  tabLinks = AppointmentsTabLinks;
  activeTab: string;

  constructor(
    private commonService: CommonService
  ) {
    this.commonService.showDashboardNavs();
    this.activeTab = (this.tabLinks.find(item => item.active) || {})['name'] || '';
  }

  ngOnInit(): void {
  }

  onTabItemClick(tab) {
    console.log(tab)
    this.activeTab = tab;
  }

}

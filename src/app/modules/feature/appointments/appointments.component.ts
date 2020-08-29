import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AppointmentsTabLinks } from 'src/app/app.constant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {

  tabLinks = AppointmentsTabLinks;
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

  openAppointmentDetails(appointmentId: string) {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        appointmentId
      }
    });
  }

  closeAppointmentDetails() {
    this.router.navigate(['/appointments']);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {
    this.commonService.hideDashboardNavs();
  }

  ngOnInit(): void {
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

}

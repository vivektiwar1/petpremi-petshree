import { Component, Input, OnInit } from '@angular/core';
import { NavMenu } from "src/app/app.constant";
import { Observable, merge } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit{
  readonly navMenuItems = NavMenu;
  @Input() activeLink$: Observable<string>;
  @Input() hiddenNavItems: Array<string>;

  mergedActiveLink$: Observable<string>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.mergedActiveLink$ = merge(
      this.activeLink$,
      this.dashboardService.getActiveNav()
    ).pipe(
      distinctUntilChanged()
    );
  }
}

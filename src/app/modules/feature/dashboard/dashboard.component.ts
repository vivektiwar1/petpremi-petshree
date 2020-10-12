import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { timer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

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
  }

  ngOnDestroy() {
    this.commonService.hideDashboardNavs();
  }

}

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navStatus$: Observable<boolean>;
  isDrawerStatePersistent: boolean = true;

  constructor(
    private commonService: CommonService
  ) {
    this.navStatus$ = this.commonService.navStatus$;
  }

  setDrawerState(state: boolean) {
    this.isDrawerStatePersistent = state;
  }

}

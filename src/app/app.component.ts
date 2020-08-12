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
  isNavOpen: boolean;

  constructor(
    private commonService: CommonService
  ) {
    this.navStatus$ = this.commonService.navStatus$;
  }

  onStateChange(state: string) {
    console.log(state)
    this.isNavOpen = state === 'open' ? true : false
  }

}

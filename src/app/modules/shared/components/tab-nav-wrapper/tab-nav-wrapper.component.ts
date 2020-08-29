import { Component, Input, Output, EventEmitter } from '@angular/core';
import { of, timer, } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tab-nav-wrapper',
  templateUrl: './tab-nav-wrapper.component.html',
  styleUrls: ['./tab-nav-wrapper.component.scss']
})
export class TabNavWrapperComponent {

  @Input() tabLinks: Array<any>;
  @Output() tabHandler: EventEmitter<string> = new EventEmitter<string>();
  date$ = timer(0, 1000).pipe(
    switchMap(() => of(new Date()))
  );

  onTabItemClick(name) {
    this.tabHandler.emit(name);
  }

}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab-nav-wrapper',
  templateUrl: './tab-nav-wrapper.component.html',
  styleUrls: ['./tab-nav-wrapper.component.scss']
})
export class TabNavWrapperComponent {

  @Input() tabLinks: Array<any>;
  @Output() tabHandler: EventEmitter<string> = new EventEmitter<string>();
  date: Date = new Date();

  onTabItemClick(name) {
    this.tabHandler.emit(name);
  }

}

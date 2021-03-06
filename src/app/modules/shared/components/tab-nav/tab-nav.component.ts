import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent {

  @Input() tabLinks: Array<any>
  @Output() tabHandler: EventEmitter<string> = new EventEmitter<string>();

  onTabItemClick(tab) {
    this.toggleActiveTab(tab.value)
    this.tabHandler.emit(tab.value);
  }

  toggleActiveTab(tabName) {
    (this.tabLinks || []).forEach(tab => tab.active = tab.value === tabName);
  }

}

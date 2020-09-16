import { Component, OnInit } from '@angular/core';
import { ClientDetailsTabLinks } from 'src/app/app.constant';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  readonly tabLinks = ClientDetailsTabLinks;
  activeTab: string;
  constructor() { }

  ngOnInit(): void {
    this.activeTab = (this.tabLinks.find(link => link.active) || {})['value'];
  }

  onTabItemClick(activeTab) {
    this.activeTab = activeTab;
  }
}

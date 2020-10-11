import { Component, OnInit } from '@angular/core';
import { ClientDetailsTabLinks } from 'src/app/app.constant';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  readonly tabLinks = ClientDetailsTabLinks;
  activeTab: string;
  constructor() { }

  ngOnInit(): void {
    this.activeTab = (this.tabLinks.find(link => link.active) || {})['value'];
  }

  onTabItemClick(activeTab) {
    this.activeTab
  }
}

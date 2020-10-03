import { Component, OnInit } from '@angular/core';
import { ClientDetailsTabLinks } from 'src/app/app.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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

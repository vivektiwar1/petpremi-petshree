import { Component, OnInit } from '@angular/core';
import { ClientDetailsTabLinks } from 'src/app/app.constant';

@Component({
  selector: 'app-partner-timing',
  templateUrl: './timing.component.html',
  styleUrls: ['./timing.component.scss']
})
export class TimingComponent implements OnInit {

  readonly tabLinks = ClientDetailsTabLinks;
  activeTab: string;
  constructor() { }

  ngOnInit(): void {
    this.activeTab = (this.tabLinks.find(link => link.active) || {}).value;
  }

}

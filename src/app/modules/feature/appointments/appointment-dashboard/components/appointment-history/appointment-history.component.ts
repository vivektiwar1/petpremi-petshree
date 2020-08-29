import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {

  activeTab: string;

  tabLinks = [
    { name: 'Today’s Consultation', value: 'today', active: true },
    { name: 'Vaccination', value: 'vaccination', active: false },
    { name: 'Surgeries', value: 'surgeries', active: false },
    { name: 'Clinical Notes', value: 'notes', active: false },
    { name: 'Previous Visits', value: 'visits', active: false },
    { name: 'Deworming', value: 'deworming', active: false }
  ]

  constructor() { }

  ngOnInit(): void {
    this.activeTab = (this.tabLinks.find(link => link.active) || {})['value'];
  }


  onTabItemClick(activeTab) {
    this.activeTab = activeTab;
  }

}

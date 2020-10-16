import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appointmenttime',
  templateUrl: './appointmenttime.component.html',
  styleUrls: ['./appointmenttime.component.scss']
})
export class AppointmenttimeComponent implements OnInit {

  @Input() userDetails: any;

  constructor() { }

  ngOnInit(): void {
  }

}

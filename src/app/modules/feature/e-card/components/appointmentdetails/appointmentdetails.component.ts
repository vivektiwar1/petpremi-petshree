import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-appointmentdetails',
  templateUrl: './appointmentdetails.component.html',
  styleUrls: ['./appointmentdetails.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  @Input() appointmentReason: any;
  @Input() petDetails: any;
  @Input() appointmentType: any;
  @Input() appointmentRepeat: any;
  @Input() userDetails: any;
  
  constructor(
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  showDiv() {
    document.getElementById('appointmentdetails').style.display = "none";
    document.getElementById('petdetails').style.display = "block";
  }
  back() {
    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointmentdetails').style.display = "none";
  }

  scrollBack(element: HTMLDivElement) {
    element.scrollTo({
      top: 0,
      left: element.scrollLeft - (element.firstElementChild as HTMLDivElement).offsetWidth,
      behavior: 'smooth'
    });
  }
  
  scrollForward(element: HTMLElement) {
    element.scrollTo({
      top: 0,
      left: element.scrollLeft + (element.firstElementChild as HTMLDivElement).offsetWidth,
      behavior: 'smooth'
    });
  }
}

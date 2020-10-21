import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() userDetails: any;
  @Input() customer:any;
  @Input() vets:any;

  constructor( private auth:AuthService) {}

  ngOnInit(): void {
  }
  showDiv() {
    this.auth.checkAndLogin().then(() => true);
    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointment').style.display = "none";
    document.getElementById('home').style.display = "none";
    document.getElementById('gallery').style.display = "none";
    document.getElementById('videos').style.display = "none";
    document.getElementById('enquiry').style.display = "none";
 }

}

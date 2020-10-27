import { Input, Output, EventEmitter } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  @Input() userDetails: any;
  @Input() customer: any;
  @Input() vets: any;
  addDetails: FormGroup;
  private pet: FormControl;
  clinic: any;
  clinicId: any;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  constructor(private auth: AuthService,
    private formBuilder: FormBuilder,
    private e: ElementRef
  ) {
    this.addDetails = this.formBuilder.group({
      clinic: ['', Validators.required]
    })
    this.addDetails.get('clinic').valueChanges.subscribe(data => {
      this.clinicId = data
    })
  }

  ngOnInit(): void {

  }
  showDiv() {
    this.auth.checkAndLogin().then(() => this.auth.getUserProfile());

    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointment').style.display = "none";
    document.getElementById('home').style.display = "none";
    if (document.getElementById('gallery') && document.getElementById('videos')) {
      document.getElementById('gallery').style.display = "none";
      document.getElementById('videos').style.display = "none";
    }
    document.getElementById('enquiry').style.display = "none";
    // var x_top: any = document.getElementsByClassName("cdk-global-scrollblock");
    // x_top[0].style.top = "auto";

  }


}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-petdetails',
  templateUrl: './petdetails.component.html',
  styleUrls: ['./petdetails.component.scss']
})
export class PetDetailsComponent {

  constructor() { }

  ngOnInit(): void {
  }
  showDiv() {
    document.getElementById('petdetails').style.display = "block";
  }
  back() {
    document.getElementById('appointmentdetails').style.display = "block";
    document.getElementById('petdetails').style.display = "none";
  }
}

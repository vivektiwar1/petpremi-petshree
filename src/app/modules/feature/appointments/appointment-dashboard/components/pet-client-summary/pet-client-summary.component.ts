import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-client-summary',
  templateUrl: './pet-client-summary.component.html',
  styleUrls: ['./pet-client-summary.component.scss']
})
export class PetClientSummaryComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  closeAppointmentDetails() {
    this.router.navigate(['/appointments'])
  }

}

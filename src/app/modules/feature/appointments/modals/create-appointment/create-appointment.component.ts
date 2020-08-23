import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm: FormGroup;
  searchItems$: Observable<Array<string>>;
  apiInProgress: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.appointmentForm = this.formBuilder.group({
      client: ['', Validators.required],
      pet: ['', Validators.required],
      type: ['', Validators.required],
      vet: ['', Validators.required],
      reason: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      repeat: ['', Validators.required],
      occurances: ['', Validators.required]
    })

    this.searchItems$ = this.appointmentForm.get('client').valueChanges.pipe(
      filter(term => term !== null),
      map(event => [
        "lisa",
        'Sung Lee',
        'Kim seo',
        'Misty'
      ]),
      delay(2000)
    );

  }
  
  onSubmit() {
    if (this.appointmentForm.valid) {
      this.apiInProgress = true;
      setTimeout(() => {
        this.apiInProgress = false;
      }, 2000);
      console.log(this.appointmentForm.value);
    }
  }

}

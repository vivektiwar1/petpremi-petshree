import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddClientComponent } from 'src/app/modules/shared/modals/add-client/add-client.component';
import { AddPetComponent } from 'src/app/modules/shared/modals/add-pet/add-pet.component';

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
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
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

  addClient() {
    const dialog = this.matDialog.open(AddClientComponent, {
      disableClose: true,
      width: "40vw"
    });
  }

  addPet() {
    const dialog = this.matDialog.open(AddPetComponent, {
      disableClose: true,
      width: "40vw"
    });
  }

}

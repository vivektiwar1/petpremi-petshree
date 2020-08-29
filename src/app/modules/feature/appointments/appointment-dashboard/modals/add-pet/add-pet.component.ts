import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss']
})
export class AddPetComponent implements OnInit {

  addPetForm: FormGroup;
  apiInProgress: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addPetForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.addPetForm.valid) {

    }
  }

}

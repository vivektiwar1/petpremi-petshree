import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  addClientForm: FormGroup;
  apiInProgress: boolean;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addClientForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      clientphone: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.addClientForm.valid) {

    }
  }
}

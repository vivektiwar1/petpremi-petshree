import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-petdetails',
  templateUrl: './petdetails.component.html',
  styleUrls: ['./petdetails.component.scss']
})
export class PetDetailsComponent {
  @Input() petTypes: any;
  @Input() breedTypes: any;
  addPetForm: FormGroup;
  private pet:FormControl;

  constructor(
    private formBuilder:FormBuilder,
    private router:Router
  ) {
    this.pet=new FormControl('',[Validators.required])

    this.addPetForm=formBuilder.group({
    pettypes:new FormControl('',[Validators.required]),
    petage:new FormControl('',[Validators.required]),
    petbreed:new FormControl('',[Validators.required]),
    petname:new FormControl('',[Validators.required]),

    })
   }

  ngOnInit(): void {
  }

  showDiv() {
    document.getElementById('petdetails').style.display = "block";
    setTimeout(function(){
      window.scroll(0, 0);
    }, 100);
  }

  back() {
    document.getElementById('appointmentdetails').style.display = "block";
    document.getElementById('petdetails').style.display = "none";
  }

  save(){

    document.getElementById('appointmentdetails').style.display = "block";
    document.getElementById('petdetails').style.display = "none";
  }
  onFormSubmit(){
    console.log(this.addPetForm)
  }
}

import {Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ECardService } from '../../e-card.service';


@Component({
  selector: 'app-petdetails',
  templateUrl: './petdetails.component.html',
  styleUrls: ['./petdetails.component.scss']
})
export class PetDetailsComponent {
  @Input() petTypes: any;
  @Input() breedTypes: any;

  getPicture = false;
  imageToCrop$ = new BehaviorSubject(null);
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('uploadRef') uploadRef: ElementRef<HTMLInputElement>;
  
  addPetForm: FormGroup;
  apiInProgress: boolean;
  user: any;
  units: Array<any>;
  genders: any;

  constructor( 
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private eCardService: ECardService,
    ) {
   }

  ngOnInit(): void {
  }

  showDiv() {
    document.getElementById('petdetails').style.display = "block";
  }

  back() {
    document.getElementById('appointmentdetails').style.display = "block";
    document.getElementById('petdetails').style.display = "none";
  }

  save(){

    document.getElementById('appointmentdetails').style.display = "block";
    document.getElementById('petdetails').style.display = "none";
  }

  


  async createForm() {
    const [genders, units] = await this.getData();

    this.genders = ((genders as any)?.responseResult?.data?.content || []).map(item => {
      return {
        name: item.name,
        image: item.image,
        id: item.id
      };
    });
    this.units = ((units as any)?.responseResult?.data?.content || []).map(item => {
      return {
        name: item.name,
        desc: item.description,
        id: item.id
      };
    });
    this.addPetForm = this.formBuilder.group({
      name: ['', Validators.required],
      petTypeId: ['', Validators.required],
      petBreedId: ['', Validators.required],
      genderId: this.genders[0].id,
      weightValue: null,
      weightUnitId: this.units[0].id,
      birthDay: [null, Validators.required],
      yearOld: [null, Validators.required],
      userName: this.user?.firstName,
      customerId: this.user?.id,
      partnerId: this.user?.partnerId,
    });

    const petTypeControl = this.addPetForm.get('petTypeId') as FormControl;

    petTypeControl.valueChanges.subscribe(typeId => {
      this.getBreedType(typeId);
    });
  }
  async getBreedType(petTypeId?) {
    try {
      this.apiInProgress = true;
      const response = await this.eCardService.getBreedType(petTypeId).toPromise() as any;
      this.apiInProgress = false;
      if (!response.isError) {
        this.breedTypes = response?.responseResult?.data.content;
      } else {
        console.error(new Error(response?.responseError?.message));
      }
    } catch (error) {
      console.log(error);
      this.apiInProgress = false;
    }
  }
  getData() {
    return Promise.all([
      this.eCardService.getGenders().toPromise(),
      this.eCardService.getWeightUnits().toPromise()
    ]);
  }

}

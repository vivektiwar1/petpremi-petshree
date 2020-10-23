import {  Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClientsService } from 'src/app/modules/feature/customers/clients/clients.service';
import { ECardService } from 'src/app/modules/feature/e-card/e-card.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { customZoomControl } from '../../../../shared/modals/shared/map.util';
import $ from 'jquery';

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


  getPicture = false;
  imageToCrop$ = new BehaviorSubject(null);
  listeners = [];
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('uploadRef') uploadRef: ElementRef<HTMLInputElement>;
  selectedIndex = 0;
  list = [
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
  ];
  @ViewChild('resultContainer') resultContainer: ElementRef;

  apiInProgress: boolean;

  user: any;
  image: string;
  units: Array<any>;
  genders: any;
  destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private service: ClientsService,
    private matDialog: MatDialog,
    private auth: AuthService,
    private toastrService: ToastrService,
    private eCardService: ECardService,
    private e: ElementRef
  ) {
    // this.pet=new FormControl('',[Validators.required])
    // this.addPetForm=formBuilder.group({
    // pettypes:new FormControl('',[Validators.required]),
    // petage:new FormControl('',[Validators.required]),
    // petbreed:new FormControl('',[Validators.required]),
    // petname:new FormControl('',[Validators.required]),
    // })
    this.auth.userData$.subscribe(res => this.user = res);
    this.getPetType();
  }

  ngOnInit(): void {
    this.createForm();
  }

  capturePhoto(photo) {
    this.searchImage(photo);
  }

  upload({files}: any) {
    this.imageToCrop$.next(files[0]);
    this.uploadRef.nativeElement.value = '';
  }

  croppedImage(image = null) {
    if (image) {
      this.searchImage(image);
    }
    this.imageToCrop$.next(null);
  }

  searchImage(item) {
    this.image = item;
  }

  searchPet(pet) {
    console.log(pet);
  }

  showInfo(index) {
    this.selectedIndex = index;
  }

  customZoom(e) {
    const c = document.createElement('div');
    c.style.zIndex = '10';
    this.listeners = customZoomControl(c, e);
    e.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(c);
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

  async onSubmit() {
    try {
      this.addPetForm.markAllAsTouched();
      if (this.addPetForm.valid) {
        this.apiInProgress = true;
        const formData = {
          ...this.addPetForm.value,
          userName:this.addPetForm.value.name,
          mobile: this.addPetForm.value.phone
        };
        delete formData.phone;
        const response: any = await this.service.postPet(formData).toPromise();
        const ext = this.image.split(';')[0].split(':')[1].split('/')[1];
        const data = new FormData();
        const file = new File([this.service.imagetoblob(this.image)], `filenName.${ext}`);
        data.append('file', file);
        data.append('randomKey', response?.randomKey);
        console.log(response?.randomKey)
        await this.service.postPetImage(data).toPromise();
        this.toastrService.success('Pet Added successfully!');
        this.apiInProgress = false;
        this.addPetForm.reset({
          genderId: this.genders[0].id,
          weightUnitId: this.units[0].id
        });
        this.matDialog.closeAll();
      } else {
        console.log('Pet form invalid.');
      }
    } catch (e) {
      this.apiInProgress = false;
      this.toastrService.error(e.error.responseMessage, 'Api Error.');
    }
  }


  async getBreedType(petTypeId?) {
    try {
      this.apiInProgress = true;
      const response = await this.service.getBreedType(petTypeId).toPromise() as any;
      this.apiInProgress = false;
      if (!response.isError) {
        this.breedTypes = response?.responseResult?.data.content;
      } else {
        console.error(new Error(response?.responseError?.message));
      }
    } catch (error) {
      this.apiInProgress = false;
    }
  }

  async getPetType() {
    try {
      this.apiInProgress = true;
      const response = await this.service.getPetType().toPromise() as any;
      this.apiInProgress = false;
      if (!response.isError) {
        this.petTypes = response?.responseResult?.data.content;
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
    setTimeout(function(){
      window.scroll(0, 0);
    }, 100);
  }
  onFormSubmit(){
    console.log(this.addPetForm)
  }

}

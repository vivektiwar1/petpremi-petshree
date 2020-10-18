import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClientsService } from 'src/app/modules/feature/customers/clients/clients.service';
import { ECardService } from 'src/app/modules/feature/e-card/e-card.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { customZoomControl } from '../shared/map.util';
import $ from 'jquery';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss']
})
export class AddPetComponent implements OnInit {

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

  addPetForm: FormGroup;
  apiInProgress: boolean;
  breedTypes: any;
  petTypes: any;
  user: any;
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
    this.list = [
      item,
      ...this.list
    ];
    this.scrollToResult();
  }

  searchPet(pet) {
    console.log(pet);
    this.scrollToResult();
  }

  showInfo(index) {
    this.selectedIndex = index;
  }

  scrollToResult() {
    const parent = $(window.innerWidth > 991 ? this.e.nativeElement : 'html, body');
    parent.animate({
      scrollTop: $(this.resultContainer.nativeElement).offset().top - parent.offset().top
    }, 800);
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
          mobile: this.addPetForm.value.phone
        };
        delete formData.phone;
        await this.service.postPet(formData).toPromise();
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
      console.log(error);
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

}

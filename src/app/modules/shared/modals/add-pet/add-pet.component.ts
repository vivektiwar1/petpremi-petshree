import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ClientsService } from 'src/app/modules/feature/customers/clients/clients.service';
import { ECardService } from 'src/app/modules/feature/e-card/e-card.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss']
})
export class AddPetComponent implements OnInit {

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
    private eCardService: ECardService
  ) {
    this.auth.userData$.subscribe(res => this.user = res);
    this.getPetType();
  }

  ngOnInit(): void {
    this.createForm();
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

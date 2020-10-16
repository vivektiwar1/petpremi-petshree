import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ClientsComponent } from './clients/clients.component';
import { PetsComponent } from './pets/pets.component';
import { TabNavWrapperComponent } from '../../shared/components/tab-nav-wrapper/tab-nav-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { PetDetailsComponent } from './pet-details/pet-details.component';
import { ECardService } from '../e-card/e-card.service';


@NgModule({
  declarations: [
    CustomersComponent,
    ClientsComponent,
    PetsComponent,
    ClientDetailsComponent,
    PetDetailsComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [ECardService]
})
export class CustomersModule { }

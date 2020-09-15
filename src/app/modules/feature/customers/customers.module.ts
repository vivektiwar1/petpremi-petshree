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
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [CustomersComponent, ClientsComponent, PetsComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ]
})
export class CustomersModule { }

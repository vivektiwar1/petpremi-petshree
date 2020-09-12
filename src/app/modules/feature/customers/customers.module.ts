import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ClientsComponent } from './clients/clients.component';
import { PetsComponent } from './pets/pets.component';
import { TabNavWrapperComponent } from '../../shared/components/tab-nav-wrapper/tab-nav-wrapper.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [CustomersComponent, ClientsComponent, PetsComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
  ]
})
export class CustomersModule { }

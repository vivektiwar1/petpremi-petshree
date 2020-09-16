import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientsComponent } from './clients/clients.component';

import { CustomersComponent } from './customers.component';
import { PetDetailsComponent } from './pet-details/pet-details.component';
import { PetsComponent } from './pets/pets.component';

const routes: Routes = [
  {
    path: '', component: CustomersComponent, children: [
      { path: "", redirectTo: 'clients', pathMatch: 'full' },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/:id', component: ClientDetailsComponent },
      { path: 'pets', component: PetsComponent },
      { path: 'pets/:id', component: PetDetailsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }

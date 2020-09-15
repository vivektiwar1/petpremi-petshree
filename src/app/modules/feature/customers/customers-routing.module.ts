import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';

import { CustomersComponent } from './customers.component';
import { PetsComponent } from './pets/pets.component';

const routes: Routes = [
  {
    path: '', component: CustomersComponent, children: [
      { path: "", redirectTo: 'clients' },
      { path: 'clients', component: ClientsComponent },
      { path: 'pets', component: PetsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }

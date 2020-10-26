import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientDetailsComponent } from '../e-card/components/client-details/client-details.component';

import { ECardComponent } from './container/e-card.component';


const routes: Routes = [
  { path: 'clients/:id', component: ClientDetailsComponent },
  { path: ':userName',
  children: [
    { path: ':partnerUserName', component: ECardComponent}
  ]},
  
  { path: '', component: ECardComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECardRoutingModule { }

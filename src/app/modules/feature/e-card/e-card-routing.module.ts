import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ECardComponent } from './container/e-card.component';

const routes: Routes = [
  { path: ':userName',
  children: [
    { path: ':partnerUserName', component: ECardComponent}
  ]},
  { path: '', component: ECardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECardRoutingModule { }

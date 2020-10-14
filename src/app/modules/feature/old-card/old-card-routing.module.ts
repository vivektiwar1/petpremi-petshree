import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OldCardComponent } from './container/old-card.component';

const routes: Routes = [
  { path: ':userName', component: OldCardComponent },
  { path: '', component: OldCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OldCardRoutingModule { }

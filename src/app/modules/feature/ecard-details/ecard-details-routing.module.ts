import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcardDetailsComponent } from './ecard-details.component';

const routes: Routes = [{ path: '', component: EcardDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcardDetailsRoutingModule { }

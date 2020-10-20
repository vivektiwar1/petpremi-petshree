import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcardDetailsRoutingModule } from './ecard-details-routing.module';
import { EcardDetailsComponent } from './ecard-details.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [EcardDetailsComponent],
  imports: [
    CommonModule,
    EcardDetailsRoutingModule,
    SharedModule
  ]
})
export class EcardDetailsModule { }

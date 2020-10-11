import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { MatChipsModule } from "@angular/material/chips";
import { ActivatePartnerComponent } from './profile/activate-partner/activate-partner.component';
import { LightboxModule } from 'ngx-lightbox';
import { ProfileComponent } from './profile/profile.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { PartnerComponent } from './partner/partner.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    CustomerProfileComponent,
    ActivatePartnerComponent,
    PartnerComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MatChipsModule,
    NgxMaterialTimepickerModule,
    LightboxModule,
    PipesModule
  ]
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { MatChipsModule } from "@angular/material/chips";
import { ActivatePartnerComponent } from './configuration/activate-partner/activate-partner.component';
import { LightboxModule } from 'ngx-lightbox';
import { ProfileComponent } from './profile/profile.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EcardDetailsComponent } from './ecard-details/ecard-details.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    ConfigurationComponent,
    EcardDetailsComponent,
    ActivatePartnerComponent
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [SettingsComponent, ProfileComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    PipesModule
  ]
})
export class SettingsModule { }

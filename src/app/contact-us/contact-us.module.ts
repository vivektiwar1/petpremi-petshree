import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    MatDialogModule,
    TranslateModule.forChild(),
  ]
})
export class ContactUsModule { }

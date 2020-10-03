import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    TermsRoutingModule,
    HeaderModule,
    TranslateModule.forChild(),
  ]
})
export class TermsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    HeaderModule,
    TranslateModule.forChild(),
  ]
})
export class PrivacyPolicyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AboutUsComponent],
  imports: [
    CommonModule,
    AboutUsRoutingModule,
    HeaderModule,
    TranslateModule.forChild(),
  ]
})
export class AboutUsModule { }

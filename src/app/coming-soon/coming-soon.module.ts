import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ComingSoonComponent} from './coming-soon.component';
import {HeaderModule} from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ComingSoonComponent,
    }]),
    TranslateModule.forChild(),
    HeaderModule,
  ],
  declarations: [
    ComingSoonComponent
  ]
})
export class ComingSoonModule {
}

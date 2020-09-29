import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NotFoundComponent} from './404.component';
import {HeaderModule} from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '**',
      component: NotFoundComponent,
    }]),
    TranslateModule.forChild(),
    HeaderModule,
  ],
  declarations: [
    NotFoundComponent
  ]
})
export class NotFoundModule {
}

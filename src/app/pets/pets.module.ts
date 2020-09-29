import {NgModule} from '@angular/core';
import {PetsComponent} from './pets.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedModule,
  ],
  exports: [
    PetsComponent
  ],
  declarations: [
    PetsComponent
  ]
})
export class PetsModule {
}

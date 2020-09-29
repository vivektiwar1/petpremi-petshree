import {NgModule} from '@angular/core';
import {FooterComponent} from './footer.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule.forChild(),
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule {
}

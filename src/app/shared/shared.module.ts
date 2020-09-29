import {NgModule} from '@angular/core';
import {AuthImagePipe} from './pipes/auth-image.pipe';

@NgModule({
  declarations: [
    AuthImagePipe
  ],
  exports: [
    AuthImagePipe
  ]
})
export class SharedModule {
}

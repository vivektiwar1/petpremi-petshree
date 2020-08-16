import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizePipe } from './sanitize.pipe';
import { AuthImagePipe } from './auth-image.pipe';

@NgModule({
  declarations: [
    SanitizePipe,
    AuthImagePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SanitizePipe,
    AuthImagePipe
  ]
})
export class PipesModule { }

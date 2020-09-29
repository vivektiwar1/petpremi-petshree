import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {AuthFormModule} from '../auth-form/auth-form.module';
import {AuthModalComponent} from './auth-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AuthFormModule,
    MatDialogModule,
  ],
  declarations: [
    AuthModalComponent,
  ],
})
export class AuthModalModule {
}

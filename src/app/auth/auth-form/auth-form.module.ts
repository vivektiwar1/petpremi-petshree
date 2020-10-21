import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AuthFormComponent} from './auth-form.component';
import {MatRadioModule} from '@angular/material/radio';
import {AlertModalModule} from '../../shared/modals/alert-modal/alert-modal.module';
import {ConfirmModalModule} from '../../shared/modals/confirm-modal/confirm-modal.module';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forChild(),
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    AlertModalModule,
    ConfirmModalModule,
    MatDialogModule,
  ],
  declarations: [
    AuthFormComponent,
  ],
  exports: [
    AuthFormComponent,
  ],
})
export class AuthFormModule {
}

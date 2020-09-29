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

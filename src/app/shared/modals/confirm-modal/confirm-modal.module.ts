import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {ConfirmModalComponent} from './confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  declarations: [
    ConfirmModalComponent,
  ]
})
export class ConfirmModalModule {
}

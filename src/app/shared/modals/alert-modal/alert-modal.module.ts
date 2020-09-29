import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {AlertModalComponent} from './alert-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  declarations: [
    AlertModalComponent,
  ]
})
export class AlertModalModule {
}

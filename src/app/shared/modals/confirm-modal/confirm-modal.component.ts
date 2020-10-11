import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface ConfirmModalData {
  message: string;
  yes: string;
  no: string;
}

@Component({
  selector: 'app-confirm-modal',
  styleUrls: ['./confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-dialog-content>
      <h2>{{data.message}}</h2>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-button
        class="cancel"
        (click)="ref.close(false)">
        {{data.no}}
      </button>
      <button
        mat-button
        (click)="ref.close(true)">
        {{data.yes}}
      </button>
    </mat-dialog-actions>`,
})
export class ConfirmModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmModalData,
              public ref: MatDialogRef<ConfirmModalComponent>) {
  }
}

import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-modal',
  template: `
    <mat-dialog-content>
      <h2>{{data.message}}</h2>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{data.action}}</button>
    </mat-dialog-actions>`,
  styles: [`
    button {
      background: #EFAC36;
      border: none;
      padding: 16px 45px;
      font-size: 16px;
      line-height: 19px;
      font-weight: 600;
      color: #FEFEFE;
      border-radius: 10px;
      margin: 24px 0 10px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h2 {
      font-size: 24px;
      font-weight: 400;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, action: string }) {
  }
}

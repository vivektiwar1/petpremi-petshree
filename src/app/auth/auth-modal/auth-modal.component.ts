import {ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthModalConfig} from '../auth-form/auth.constants';
import $ from 'jquery';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  @ViewChild('contentBlock') contentBlock: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AuthModalConfig,
              public ref: MatDialogRef<AuthModalComponent>) {
  }

  scrollToForm() {
    $(this.contentBlock.nativeElement).animate({
      scrollTop: 0
    });
  }
}

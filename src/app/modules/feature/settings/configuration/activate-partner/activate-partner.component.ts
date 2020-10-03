import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WhiteSpaceValidator } from 'src/app/validators/common';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-activate-partner',
  templateUrl: './activate-partner.component.html',
  styleUrls: ['./activate-partner.component.scss']
})
export class ActivatePartnerComponent implements OnInit {

  apiInProgress: boolean;
  partnerNameControl: FormControl = new FormControl(null, Validators.compose([Validators.required, WhiteSpaceValidator]));

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private configurationService: ConfigurationService,
    private toasts: ToastrService,
    private dialogRef: MatDialogRef<ActivatePartnerComponent>
  ) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    if (this.partnerNameControl.valid) {
      try {
        this.apiInProgress = true;
        await this.configurationService.activatePartner(this.partnerNameControl.value, this.data.userId).toPromise();
        this.apiInProgress = false;
        this.dialogRef.close();
        this.toasts.success('Partner Added Successfully');
      } catch (error) {
        this.toasts.error('Something went wrong');
        this.apiInProgress = false;
      }
    }
  }

}

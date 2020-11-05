import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { WhiteSpaceValidator } from 'src/app/validators/common';
import { ProfileService } from '../profile/profile.service';


@Component({
  selector: 'app-partner-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
  }

}

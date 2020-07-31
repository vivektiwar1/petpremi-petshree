import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, delay } from "rxjs/operators";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  activeLink$: Observable<string>;
  userDetails: any;
  enquiryForm: FormGroup;
  apiInProgress = {
    userDataLoader: false,
    enquiryLoader: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private viewportScroller: ViewportScroller
  ) {
    this.activeLink$ = this.activatedRoute.fragment.pipe(
      delay(1),
      map(fragment => fragment ? fragment : 'home'),
      tap(() => this.viewportScroller.setOffset([0, 48])),
      tap(fragment => this.viewportScroller.scrollToAnchor(fragment))
    );
  }

  async ngOnInit() {
    await this.getUserDetails();
    this.createEnquiryForm()
  }

  async getUserDetails() {
    try {
      this.apiInProgress.userDataLoader = true;
      const response = await this.dashboardService.getUserDetails().toPromise();
      this.apiInProgress.userDataLoader = false;
      this.userDetails = response.data;
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }

  createEnquiryForm() {
    this.enquiryForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null],
      message: [null, Validators.required]
    });
  }

  onSubmit() {
    try {
      alert('check console');
      console.log(this.enquiryForm.value)
      if (this.enquiryForm.valid) {
        this.apiInProgress.enquiryLoader = true;
        // await this.dashboardService.postEnquiry(this.enquiryForm.value).toPromise();
        this.apiInProgress.enquiryLoader = false;
        this.enquiryForm.reset();
      }
    } catch (error) {
      this.apiInProgress.enquiryLoader = false;
    }
  }
}

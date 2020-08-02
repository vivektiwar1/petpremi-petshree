import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, tap, delay, takeUntil } from "rxjs/operators";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DashboardService } from '../dashboard.service';
import { ScrollOffset } from 'src/app/app.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  activeLink$: Observable<string>;
  destroy$: Subject<void> = new Subject();
  userDetails: any;
  enquiryForm: FormGroup;
  hiddenNavItems: Array<string> = [];
  apiInProgress = {
    userDataLoader: false,
    enquiryLoader: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private viewportScroller: ViewportScroller
  ) {
    this.activeLink$ = this.activatedRoute.fragment.pipe(
      delay(1),
      map(fragment => fragment ? fragment : 'home'),
      tap(() => this.viewportScroller.setOffset([0, ScrollOffset])),
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
      this.createHideNavArray(response.data);
      this.userDetails = response.data;
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }

  createEnquiryForm() {
    this.enquiryForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)])],
      phone: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
      message: [null, Validators.required]
    });
    const phoneControl = this.enquiryForm.get('phone');

    phoneControl.valueChanges.pipe(
      map(value => value && value.replace(/\D/g, '')),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      phoneControl.value !== value && value.length <= 10 && phoneControl.setValue(value)
    })
  }

  onSubmit() {
    try {
      console.log(this.enquiryForm.value)
      if (this.enquiryForm.valid) {
        this.apiInProgress.enquiryLoader = true;
        // await this.dashboardService.postEnquiry(this.enquiryForm.value).toPromise();
        this.toastrService.success('Thanks For Reaching Out!');
        this.apiInProgress.enquiryLoader = false;
        this.enquiryForm.reset();
      }
    } catch (error) {
      this.apiInProgress.enquiryLoader = false;
    }
  }

  createHideNavArray(response) {
    response['images'] && !response['images'].length && this.hiddenNavItems.push('gallery')
    response['videos'] && !response['videos'].length && this.hiddenNavItems.push('videos');
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

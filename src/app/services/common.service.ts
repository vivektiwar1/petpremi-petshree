import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _navStatus$: Subject<boolean>;

  constructor(
    private router: Router,
  ) { 
    this._navStatus$ = new Subject();
  }

  hideDashboardNavs(): void {
    this._navStatus$.next(false);
  }

  showDashboardNavs(): void {
    this._navStatus$.next(true);
  }

  get navStatus$(): Observable<boolean> {
    return this._navStatus$.asObservable();
  }

}

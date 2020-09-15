import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _navStatus$: Subject<boolean>;

  constructor(
    private router: Router,
    private httpClient: HttpClient
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

  async getCountryList() {
    const apiData = {
      commonParamHash: {
        entityName: "Country",
        operation: "SEARCH"
      },
      objectHash: {
        status: true
      }
    };

    const response = await this.httpClient.post(`${environment.apiBase}/crud`, apiData).toPromise();
    console.log(response);
    const countries = [];
    return (countries as Array<any> || []).map(item => {
      return {
        code: item.code,
        name: item.name,
        id: item.id,
        minLength: item.fromLength,
        maxLength: item.toLength
      }
    })
  }

}

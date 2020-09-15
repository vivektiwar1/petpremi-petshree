import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _navStatus$: Subject<boolean>;
  private httpSpy: HttpClient;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private httpBackend: HttpBackend
  ) {
    this._navStatus$ = new Subject();
    this.httpSpy = new HttpClient(httpBackend);
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

    const response = await this.httpSpy.post(`${environment.apiBase}/crud`, apiData, {
      headers: {
        Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
      }
    }).toPromise() as any;
    if (!response.isError) {
      return (response.responseResult?.data?.content as Array<any> || []).map(item => {
        return {
          code: item.code,
          name: item.name,
          id: item.id,
          minLength: item.fromLength,
          maxLength: item.toLength
        }
      })
    } else {
      return [];
    }
  }

}

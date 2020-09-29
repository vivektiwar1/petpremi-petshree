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
  private countryCode: any;
  private titleList: any;
  private userId: any;

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

    if (!this.countryCode?.length) {
      const apiData = {
        commonParamHash: {
          entityName: "Country",
          operation: "SEARCH"
        },
        objectHash: {
          status: true
        }
      };

      const response = await this.httpSpy.post(`${environment.apiBase}/service/api/crud`, apiData, {
        headers: {
          Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
        }
      }).toPromise() as any;
      if (!response.isError) {
        this.countryCode = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            code: item.code,
            name: item.name,
            id: item.id,
            minLength: item.fromLength,
            maxLength: item.toLength
          }
        });
        return this.countryCode;
      } else {
        return [];
      }
    } else {
      return this.countryCode;
    }

  }

  async getTitleList() {
    if (!this.titleList?.length) {
      const apiData = {
        commonParamHash: {
          entityName: "Title",
          operation: "SEARCH"
        },
        objectHash: {
          status: true
        }
      };
      const response = await this.httpSpy.post(`${environment.apiBase}/service/api/crud`, apiData, {
        headers: {
          Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
        }
      }).toPromise() as any;
      if (!response.isError) {
        this.titleList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            title: item.title,
            id: item.id,
          }
        });
        return this.titleList;
      } else {
        return [];
      }
    } else {
      return this.titleList;
    }
  }

  async getUserId() {
    if (!this.userId) {
      const response = await this.httpClient.get(`${environment.apiBase}/service/oauth2/api/get-user-id`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise() as any;
      if (response?.id) {
        this.userId = response?.id
        return this.userId;
      }
    } else {
      return this.userId;
    }
  }

  releaseCaching() {
    this.countryCode = this.titleList = this.userId = null;
  }

}

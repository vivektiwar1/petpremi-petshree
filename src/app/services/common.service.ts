import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _navStatus$: Subject<boolean>;
  private httpSpy: HttpClient;
  private countryList: Array<any>;
  private stateList: Array<any>;
  private cityList: Array<any>;
  private pinCodeList: Array<any>;
  private titleList: Array<any>;
  private genderList: Array<any>;
  private professionList: Array<any>;
  private documentType: Array<any>;
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

  releaseCaching() {
    (this.countryList = this.titleList = this.userId =
      this.stateList = this.cityList = this.pinCodeList = null
    );
  }

  private getSearchObject(searchKey: string, objecthash?) {
    return {
      commonParamHash: {
        entityName: searchKey,
        uiBean: 'BNE' + searchKey,
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            'id'
          ]
        }
      },
      objectHash: {
        status: true,
        ...objecthash
      }
    };
  }

  private dataRequest(apiData) {
    return this.httpSpy.post(`${environment.apiBase}/service/api/crud`, apiData, {
      headers: {
        Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
      }
    }).pipe(
      catchError(error => {
        const errorMessage = error?.error?.responseError?.message || error?.error?.responseMessage || 'Something went wrong';
        throw new Error(`${errorMessage} Api => ${apiData?.commonParamHash?.entityName}`);
      }),
      catchError(error => {
        console.error(error);
        console.warn('using fallback value ==> []');
        return of([]);
      })
    ).toPromise() as any;
  }

  async getUserId() {
    if (!this.userId) {
      const response = await this.httpClient.get(`${environment.apiBase}/service/oauth2/api/get-user-id`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise() as any;
      if (response?.id) {
        this.userId = response?.id;
        return this.userId;
      }
    } else {
      return this.userId;
    }
  }

  async getCountryList() {
    if (!this.countryList?.length) {
      const apiData = this.getSearchObject('Country');
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.countryList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            code: item.code,
            name: item.name,
            id: item.id,
            minLength: item.fromLength,
            maxLength: item.toLength,
            value: item.id
          };
        });
        return this.countryList;
      } else {
        return [];
      }
    } else {
      return this.countryList;
    }

  }

  async getProfessionList() {
    if (!this.professionList?.length) {
      const apiData = {
        commonParamHash: {
          entityName: 'Profession',
          uiBean: 'BNEProfession' ,
          operation: 'SEARCH',
          pagination: {
            pageNumber: 0,
            pageSize: 10
          },
          sort: {
            ASC: [
              'id'
            ]
          }
        },
        objectHash: {}
      };
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.professionList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            name: item.name,
            id: item.id,
          };
        });
        return this.professionList;
      } else {
        return [];
      }
    } else {
      return this.professionList;
    }
  }

  async getTitleList() {
    if (!this.titleList?.length) {
      const apiData = this.getSearchObject('Title');
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.titleList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            title: item.name,
            id: item.id,
          };
        });
        return this.titleList;
      } else {
        return [];
      }
    } else {
      return this.titleList;
    }
  }

  async getStateList(countryCode) {
    if (!this.stateList?.length) {
      const apiData = this.getSearchObject('State', {
        country_FK: {
            id: countryCode
        }
      });
      const response = await this.httpSpy.post(`${environment.apiBase}/service/api/crud`, apiData, {
        headers: {
          Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
        }
      }).toPromise() as any;
      if (!response.isError) {
        this.stateList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            name: item.name,
            value: item.id
          };
        });
        return this.stateList;
      } else {
        return [];
      }
    } else {
      return this.stateList;
    }

  }

  async getCityList(stateCode) {
    if (!this.cityList?.length) {
      const apiData = this.getSearchObject('City', {
        state_FK: {
            id: stateCode
        }
      });
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.cityList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            name: item.name,
            value: item.id
          };
        });
        return this.cityList;
      } else {
        return [];
      }
    } else {
      return this.cityList;
    }

  }

  async getPinCodeList(cityCode) {
    if (!this.pinCodeList?.length) {
      const apiData = this.getSearchObject('PINCode', {
        city_FK: {
            id: cityCode
        }
      });
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.pinCodeList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            name: item.code,
            desc: item.description,
            value: item.id
          };
        });
        return this.pinCodeList;
      } else {
        return [];
      }
    } else {
      return this.pinCodeList;
    }

  }

  async getGenderList() {
    if (!this.genderList?.length) {
      const apiData = this.getSearchObject('Gender');
      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.genderList = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            name: item.name,
            value: item.id
          };
        });
        return this.genderList;
      } else {
        return [];
      }
    } else {
      return this.genderList;
    }
  }

  async getDocumentType() {
    if (!this.documentType?.length) {
      const apiData = {
        commonParamHash: {
          entityName: 'DocumentType',
          operation: 'READ'
        },
        objectHash: {
          status: true
        }
      };

      const response = await this.dataRequest(apiData);
      if (!response.isError) {
        this.documentType = (response.responseResult?.data?.content as Array<any> || []).map(item => {
          return {
            ...item,
            value: item.id,
            name: item.documentType
          };
        });
        return this.documentType;
      } else {
        return [];
      }
    } else {
      return this.documentType;
    }
  }



}

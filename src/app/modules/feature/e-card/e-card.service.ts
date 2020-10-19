import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class ECardService {

  private _navActive$: Subject<string> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  getActiveNav(): Observable<string> {
    return this._navActive$.asObservable();
  }

  setNavActive(anchorId: string) {
    this._navActive$.next(anchorId);
  }

  private getApiUrl(url: string): string {
    return url.includes('oauth2')
      ? `${environment.apiBase}${url}`
      : `${environment.apiBase}/service/api${url}`;
  }

  getUserDetails(userName, partnerUserName): Observable<any> {

    return this.http.get(this.getApiUrl(`/e/card/details?userName=${userName}&partnerUserName=${partnerUserName}`), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getDay(): Observable<any> {
    const apiData = {
      commonParamHash: {
        entityName: "Day",
        uiBean: "BNEDay",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            "id"
          ]
        }
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);
  }
  getAppointmentReason() {
    const apiData = {
      commonParamHash: {
        entityName: "AppointmentReason",
        uiBean: "BNEAppointmentReason",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true,
        appointmentReason_LIKE: "tos"
      }
    }
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }

  getAppointmentRepeat() {
    const apiData = {
      commonParamHash: {
        entityName: "AppointmentRepeat",
        uiBean: "BNEAppointmentRepeat",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true,
        appointmentRepeat_LIKE: "tos"
      }
    }
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }

  getAppointmentType() {
    const apiData = {
      commonParamHash: {
        entityName: "AppointmentType",
        uiBean: "BNEAppointmentType",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true,
        appointmentType_LIKE: "de"
      }
    }
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }


  postEnquiry(apiData) {
    if (!apiData.phone) {
      delete apiData.phone;
      delete apiData.countryId;
    }
    return this.http.put(this.getApiUrl('/enquiry/partner'), apiData);
  }

  getCountries() {
    const apiData = {
      commonParamHash: {
        entityName: 'Country',
        operation: 'SEARCH'
      },
      objectHash: {
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getGenders() {
    const apiData = {
      commonParamHash: {
        entityName: 'Gender',
        uiBean: 'BNEGender',
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
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/crud'), apiData);
  }


  getWeightUnits() {
    const apiData = {
      commonParamHash: {
        entityName: 'WeightUnit',
        uiBean: 'BNEWeightUnit',
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
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/service/oauth2/api/crud'), apiData);
  }


  getTitles() {
    const apiData = {
      commonParamHash: {
        entityName: 'Title',
        operation: 'SEARCH'
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getMediaFiles(userName, type) {
    const apiData = {
      commonParamHash: {
        entityName: "UserDocument",
        uiBean: "BNEUserDocument",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 6
        },
        sort: {
          ASC: [
            "displayOrder"
          ]
        }
      },
      objectHash: {
        user_FK: {
          userName: userName
        },
        documentType_FK: {
          documentType: type
        }
      }
    };
    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getImageLinks(userName, type, fileName = '') {
    return this.getApiUrl(`/assets/partner/e/card?userName=${userName}&asset=${type}&fileName=${fileName}`);
  }
}

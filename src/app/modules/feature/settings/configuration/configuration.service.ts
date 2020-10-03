import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  validateUserName(userName, userId) {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomerProfile",
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
        "userName": userName
      }
    }

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response.isError || (response.responseResult?.data?.content?.length && response.responseResult.data.content[0].id !== userId)) {
          throwError('');
        } else {
          return true;
        }
      }),
      catchError(() => of(false))
    );
  }

  getPersonalFormData(userId) {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomerProfile",
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
        id: userId
      }
    }
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (!response?.isError) {
          return response?.responseResult?.data
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error)
      })
    );
  }

  updateDisplayPicture(type: string, formData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/user/${type !== 'Profile' ? type.toLowerCase() : 'uploadProfilePic'}`, formData);
  }

  uploadCertificates(formData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/user/certificate`, formData);
  }

  updateProfileDetails(formData, userId) {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomerProfile",
        headerId: (userId || "").toString(),
        operation: "UPDATE"
      },
      objectHash: {
        ...formData
      }
    };

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response?.isError !== true) {
          return response?.responseResult?.data
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error)
      })
    );
  }

  activatePartner(name: string, userId: number) {
    const apiData = {
      commonParamHash: {
        entityName: "Partner",
        uiBean: "BNEPartnerCard",
        operation: "CREATE"
      },
      objectHash: {
        name,
        subscribed: false,
        users: [{
          id: userId
        }]
      }
    }

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response?.isError !== true) {
          return response?.responseResult?.data
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error)
      })
    );

  }

}

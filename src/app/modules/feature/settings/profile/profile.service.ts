import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private httpClient: HttpClient
  ) { }

  validateUserName(userName, userId) {
    const apiData = {
      commonParamHash: {
        entityName: 'User',
        uiBean: 'BNECustomerProfile',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            'id'
          ]
        }
      },
      objectHash: {
        userName
      }
    };

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response.isError || (response.responseResult?.data?.content?.length && response.responseResult.data.content[0].id !== userId)) {
          return false;
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
        entityName: 'User',
        uiBean: 'BNECustomerProfile',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            'id'
          ]
        }
      },
      objectHash: {
        id: userId
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (!response?.isError) {
          return response?.responseResult?.data;
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getPartnerFormData(partnerId) {
    const apiData = {
      commonParamHash: {
        entityName: 'Partner',
        uiBean: 'BNEPartnerCard',
        operation: 'SEARCH'
      },
      objectHash: {
        id: partnerId
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (!response?.isError) {
          return response?.responseResult?.data;
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updateDisplayPicture(type: string, formData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/user/${type !== 'Profile' ? type.toLowerCase() : 'uploadProfilePic'}`, formData);
  }

  uploadCertificates(formData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/user/certificate`, formData);
  }

  updateClinicDetails(formData) {
    console.log(formData)
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/partner/address/update/create`, formData).pipe(
      map((response: any) => {
        console.log(response);
        if (response?.isError !== true) {
          return response?.responseResult?.data;
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  updateUserTiming(apiData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/partner/address/update/create`, apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise()
  }
  submitBankDetails(formData, partnerId) {
    console.log(partnerId)
    const apiData = {
      commonParamHash: {
        entityName: "Partner",
        uiBean: "BNEPartnerCard",
        headerId: (partnerId || '').toString(),
        operation: "UPDATE"
      },
      objectHash: formData
    }
    console.log(apiData)
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData)
  }
  UpdateUserLeaves() {
    const apiData = {

    }
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData)

  }
  updateProfileDetails(formData, userId) {
    const apiData = {
      commonParamHash: {
        entityName: 'User',
        uiBean: 'BNECustomerProfile',
        headerId: (userId || '').toString(),
        operation: 'UPDATE'
      },
      objectHash: {
        ...formData
      }
    };

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response?.isError !== true) {
          return response?.responseResult?.data;
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updatePartnerDetails(formData, partnerId) {

    const apiData = {
      commonParamHash: {
        entityName: 'Partner',
        uiBean: 'BNEPartnerCard',
        headerId: (partnerId || '').toString(),
        operation: 'UPDATE'
      },
      objectHash: {
        ...formData
      }
    };

    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData);

  }

  activatePartner(name: string, userId: number) {
    const apiData = {
      commonParamHash: {
        entityName: 'Partner',
        uiBean: 'BNEPartnerCard',
        operation: 'CREATE'
      },
      objectHash: {
        name,
        subscribed: false,
        users: [{
          id: userId
        }]
      }
    };

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if (response?.isError !== true) {
          return response?.responseResult?.data;
        } else {
          throw new Error(response?.responseError?.message || 'Something went wrong');
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );

  }

  getPartnerDetails(partnerId) {
    const apiData = {
      commonParamHash: {
        entityName: 'Partner',
        uiBean: 'BNEPartnerDetails',
        operation: 'SEARCH'
      },
      objectHash: {
        id: partnerId
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData);
  }
  getUserTiming(userId) {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNEUserTimings",
        operation: "SEARCH"
      },
      objectHash: {
        id: userId
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData);
  }


  searchUserName(userName) {
    const apiData = {
      commonParamHash: {
        entityName: 'Partner',
        uiBean: 'BNEPartnerCard',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 2
        },
        sort: {
          DESC: [
            'id'
          ]
        }
      },
      objectHash: {
        userName
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData);

  }

  searchPartnerByNumber(mobile) {
    const apiData = {
      commonParamHash: {
        entityName: 'PartnerContactNumber',
        uiBean: 'BNEPartnerContactNumber',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 5
        },
        sort: {
          DESC: [
            'id'
          ]
        }
      },
      objectHash: {
        mobile_LIKE: mobile
      }
    };
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, apiData);

  }

}

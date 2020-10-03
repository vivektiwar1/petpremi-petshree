import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EcardDetailsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  uploadImage(formData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/upload/doc`, formData);
  }

  addDocument(apiData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/save/doc`, apiData);
  }

  updateDocument(apiData) {
    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/update/doc`, apiData);
  }

  getDocuments(userId) {
    const apiData = {
      commonParamHash: {
        entityName: "UserDocument",
        uiBean: "BNEUserDocument",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            "displayOrder"
          ]
        }
      },
      objectHash: {
        user_FK: {
          id: userId
        }
      }
    }

    return this.httpClient.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData).pipe(
      map((response: any) => {
        if(!response.isError) {
          return response.responseResult?.data?.content
        } else {
          throw new Error(response?.responseError?.message)
        }
      }),
      catchError(error => {
        const errorMessage = error?.error?.responseMessage || error || 'Something went wrong';
        throw new Error(`${errorMessage} Api => ${apiData?.commonParamHash?.entityName}`)
      }),
      catchError(error => {
        console.error(error);
        console.warn('using fallback value ==> []');
        return of([]);
      })
    )
  }

  deleteDocument(documentId) {
    return this.httpClient.delete(`${environment.apiBase}/service/oauth2/api/assets/delete/user/e/card?key=${documentId}`);
  }

}

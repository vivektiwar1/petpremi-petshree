import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getProfileDetails(userId = 73) {
    return this.httpClient.post(`${environment.apiBase}/service/api/crud`, {
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
    })
  }
}

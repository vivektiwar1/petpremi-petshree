import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    private http: HttpClient
  ) { }

  getClients(pageSize, pageNumber = 0, sort?, searchHash?) {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomer",
        operation: "SEARCH",
        pagination: {
          pageNumber,
          pageSize
        },
        sort: {
          ...(sort ? {...sort} : { DESC: ["lastVisit"] })
        }
      },
      objectHash: searchHash ? searchHash : {}
    }
    return this.http.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData);
  }
}

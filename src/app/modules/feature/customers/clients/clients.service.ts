import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    private http: HttpClient
  ) { }

  getClients(pageSize, pageNumber = 0, sort?) {
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
          ...(sort ? {...sort} : { DESC: ["lastLogin"] })
        }
      },
      objectHash: {

      }
    }
    return this.http.post('http://petshree.com:8083/service/oauth2/api/crud', apiData);
  }
}

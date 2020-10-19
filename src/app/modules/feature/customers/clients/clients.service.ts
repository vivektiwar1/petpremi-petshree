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
        entityName: 'User',
        uiBean: 'BNECustomer',
        operation: 'SEARCH',
        pagination: {
          pageNumber,
          pageSize
        },
        sort: {
          ...(sort ? {...sort} : { DESC: ['lastVisit'] })
        }
      },
      objectHash: searchHash ? searchHash : {}
    };
    return this.http.post(`${environment.apiBase}/service/oauth2/api/crud`, apiData);
  }

  getBreedType(typeId?, pageSize = 10, pageNumber = 0, sort?) {
    const apiData = {
      commonParamHash: {
        entityName: 'PetBreed',
        uiBean: 'BNEPetBreed',
        operation: 'SEARCH',
        pagination: {
          pageNumber,
          pageSize
        },
        sort: {
          ASC: [
              'id'
          ]
      }
      },
      objectHash: {
            petType_FK: {
            id: typeId
        }
  }
    };
    return this.http.post(`${environment.apiBase}/service/api/crud`, apiData);
  }

  getPetType(pageSize = 10, pageNumber = 0, sort?, searchHash?) {
    const apiData = {
      commonParamHash: {
        entityName: 'PetType',
        uiBean: 'BNEPetType',
        operation: 'SEARCH',
        pagination: {
          pageNumber,
          pageSize
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
    return this.http.post(`${environment.apiBase}/service/api/crud`, apiData);
  }

  postPet(apiData) {
    return this.http.post(`${environment.apiBase}/service/oauth2/api/pet/admin`, apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  postCustomer(apiData) {
    return this.http.post(`${environment.apiBase}/service/api/admin/add/client`, apiData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  postCustomerImage(apiData) {
    return this.http.post(`${environment.apiBase}/service/oauth2/api/user/uploadProfilePic`, apiData);
  }
}

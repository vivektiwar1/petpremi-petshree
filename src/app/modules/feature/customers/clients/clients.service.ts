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

  postPetImage(apiData) {
    return this.http.post(`${environment.apiBase}/service/oauth2/api/pet/uploadProfilePic`, apiData);
  }

  b64toBlob(b64Data, contentType, sliceSize = 0) {
    console.log(b64Data, contentType);
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    console.log(byteArrays);

    return new Blob(byteArrays, {type: contentType});
}


  imagetoblob(base64){
    const block = base64.split(';');
    // Get the content type of the image
    const contentType = block[0].split(':')[1];
    // get the real base64 content of the file
    const realData = block[1].split(',')[1];
    // Convert it to a blob to upload
    return this.b64toBlob(realData, contentType);
  }
}

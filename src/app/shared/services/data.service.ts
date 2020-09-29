import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {AppStore} from '../../app.store';

@Injectable()
export class DataService {
  constructor(public http: HttpClient,
              private app: AppStore) {
  }

  static getObject(
    operation,
    entityName,
    objectHash,
    pagination = {pageNumber: 0, pageSize: 10},
    sort = {ASC: ['id']}
  ) {
    return {
      commonParamHash: {
        ...(typeof entityName === 'string' ? {entityName} : entityName),
        operation,
        ...(pagination ? {pagination} : {}),
        ...(sort ? {sort} : {}),
      },
      objectHash,
    };
  }

  search(entityName: string | object,
         objectHash: any = {status: true},
         sort = {ASC: ['id']},
         pagination = {pageNumber: 0, pageSize: 10}) {
    return this.http.post(`${environment.api}${this.app.state.basePath}crud`,
      DataService.getObject('SEARCH', entityName, objectHash, pagination, sort)).pipe(
      map((data: any) => data.responseResult.data.content),
    );
  }

  update(entityName: string | object, headerId, objectHash: any = null) {
    return this.http.post(`${environment.api}${this.app.state.basePath}crud`, {
      commonParamHash: {
        ...(typeof entityName === 'string' ? {entityName} : entityName),
        operation: 'UPDATE',
        headerId,
      },
      objectHash,
    }).pipe(
      map((data: any) => data.responseResult.data),
    );
  }
}

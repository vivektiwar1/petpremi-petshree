import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppStore } from '../app.store';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private httpClient: HttpClient,
    private store: AppStore,
    private toastrService: ToastrService,
  ) { }

  subscribeUs(email) {
    const endPoint = this.store.state.isAuthenticated
            ? `${environment.apiBase}/service/oauth2/`
            : `${environment.apiBase}/service/`;
    return this.httpClient.get(`${endPoint}api/newsletter/subscribe`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {email}
      })
      .pipe(take(1), map((res: any) => this.toastrService.success(res.responseMessage))).toPromise();
  }
}

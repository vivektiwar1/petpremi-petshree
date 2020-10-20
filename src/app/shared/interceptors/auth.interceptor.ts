import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AppStore} from '../../app.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: AppStore) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      headers: req.headers.set('Authorization', this.store.state.isAuthenticated && req.url.includes('oauth2')
        ? `Bearer ${this.store.state.token}`
        : `Basic ${environment.auth}`
      )
    });
    return next.handle(request);
  }
}

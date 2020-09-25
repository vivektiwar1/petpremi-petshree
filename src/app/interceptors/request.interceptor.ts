import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let clone;
    if (this.router.url.startsWith('/ecard')) {
      clone = request.clone({
        setHeaders: {
          Authorization: `Basic ${window.btoa(environment.username + ':' + environment.password)}`
        }
      });
    } else {
      clone = request.clone({
        setHeaders: {
          Authorization: `Bearer 8d425b9d-3a18-4f5a-87e1-2dfe2bca463e`
        }
      });
    }

    return next.handle(clone);
  }
}

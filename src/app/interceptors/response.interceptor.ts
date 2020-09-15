import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { filter, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    if (this.router.url.startsWith('/ecard')) {
      if (request.method === 'POST') {
        return next.handle(request).pipe(
          filter(event => event instanceof HttpResponse),
          switchMap(response => {
            return !response['body']['isError'] ?
              of(new HttpResponse({
                body: response['body']['responseResult']['data']['content']
              })) : throwError(response['body']['responseError']);
          }),
          catchError(error => {
            console.error(error);
            return throwError(!error.status ? error.message : error.error.responseMessage);
          })
        );
      } else {
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { filter, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse),
      switchMap(response => {
        if (request.method === 'POST') {
          return !response['body']['isError'] ?
            of(new HttpResponse({
              body: response['body']['responseResult']['data']['content']
            })) : throwError(response['body']['responseError']);
        } else {
          return of(new HttpResponse({
            body: response
          }));
        }
      }),
      catchError(error => {
        console.error(error);
        return throwError(!error.status ? error.message : error.error.responseMessage);
      })
    );
  }
}

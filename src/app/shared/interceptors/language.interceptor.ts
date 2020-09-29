import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppService} from '../../app.service';
import {DEFAULT_LANGUAGE_CODE} from '../constants/app.constants';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      headers: req.headers.set('Accept-Language', AppService.languageCode || DEFAULT_LANGUAGE_CODE),
    });
    return next.handle(request);
  }
}

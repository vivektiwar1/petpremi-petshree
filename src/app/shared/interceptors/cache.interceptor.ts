import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CACHE_HEADER} from '../constants/app.constants';
import {CacheService} from '../services/cache.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: CacheService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!((req.method === 'GET') && req.headers.has(CACHE_HEADER))) {
      return next.handle(req);
    }
    const cachedResponse = this.cache.get(req);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }

    const request = req.clone({
      headers: req.headers.delete(CACHE_HEADER),
    });

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.put(request, event);
        }
      })
    );
  }
}

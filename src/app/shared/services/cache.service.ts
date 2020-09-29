import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';

@Injectable()
export class CacheService {
  cacheMap = new Map<string, CacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    const isExpired = (Date.now() - entry.entryTime) > MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const entry: CacheEntry = {url: req.urlWithParams, response: res, entryTime: Date.now()};
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

  private deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if ((Date.now() - entry.entryTime) > MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }
}

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}

// in milliseconds
export const MAX_CACHE_AGE = 5 * 60 * 1000;

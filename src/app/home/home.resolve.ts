import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {CACHE_HEADER} from '../shared/constants/app.constants';

@Injectable()
export class HomeResolve implements Resolve<any> {
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const promises = [];
    const jsons = ['/assets/json/breed/pet1.json',
      '/assets/json/breed/pet2.json',
      '/assets/json/breed/human.json',
      '/assets/json/symptom/pet1.json',
      '/assets/json/symptom/pet2.json',
      '/assets/json/symptom/human.json'];
    jsons.forEach(json => {
      const p = new Promise(resolve => {
        const headers = new HttpHeaders().set(CACHE_HEADER, '1');
        this.http
          .get(json, {headers})
          .toPromise()
          .catch(e => e)
          .then(x => resolve({[json]: x}));
      });
      promises.push(p);
    });
    return new Promise(resolve => {
      Promise.all(promises).then(data => resolve(data.reduce((sum, d) => {
        Object.keys(d).forEach(key => sum[key] = d[key]);
        return sum;
      }, {})))
    });
  }
}

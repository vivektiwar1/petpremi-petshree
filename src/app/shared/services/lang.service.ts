import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  constructor(private httpClient:HttpClient) { }

  langDetail(){
    // return this.httpClient.get('http://boltonte.com:8083/service/api/crud');
  }
}

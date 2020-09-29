import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {dataURItoBlob} from './shared/breed.util';

@Injectable()
export class BreedService {
  backPressed$ = new Subject();

  upload(dataURI) {
    const data = new FormData();
    const imageData = dataURItoBlob(dataURI);
    data.append('image', imageData, 'myimage');
    return data;
  }
}

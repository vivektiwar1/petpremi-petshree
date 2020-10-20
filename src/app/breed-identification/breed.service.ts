import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {dataURItoBlob} from './shared/breed.util';

@Injectable()
export class BreedService {
  backPressed$ = new Subject();
  breedList$ = new BehaviorSubject([
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
  ]);

  upload(dataURI) {
    const data = new FormData();
    const imageData = dataURItoBlob(dataURI);
    data.append('image', imageData, 'myimage');
    return data;
  }
}

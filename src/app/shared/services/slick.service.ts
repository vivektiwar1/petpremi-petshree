import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SlickService {
  resetSlide$ = new EventEmitter<void>();
}

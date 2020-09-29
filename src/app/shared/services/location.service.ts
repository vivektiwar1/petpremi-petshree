import {Injectable} from '@angular/core';
import {LocationErrors} from '../constants/location.error';

@Injectable()
export class LocationService {
  private promise;
  private coordinates = null;

  getUserCoordinates(): Promise<{ latitude, longitude }> {
    if (this.coordinates) {
      return Promise.resolve(this.coordinates);
    }
    if (navigator.geolocation) {

      if (this.promise) {
        return this.promise;
      }

      this.promise = new Promise<{ latitude, longitude } | number>((resolve, reject) => navigator.geolocation
        .getCurrentPosition(({coords}) => {
            this.coordinates = coords;
            resolve(this.coordinates);
          },
          err => reject(err.code === err.PERMISSION_DENIED ?
            LocationErrors.USER_DENIED : LocationErrors.UNAVAILABLE)));
      return this.promise;
    } else {
      return Promise.reject(LocationErrors.NO_SUPPORT);
    }
  }
}

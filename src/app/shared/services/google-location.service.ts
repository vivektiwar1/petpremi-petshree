import {Injectable} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import map from 'lodash/map';
import intersection from 'lodash/intersection';
import union from 'lodash/union';
import each from 'lodash/each';
import {LocationErrors} from '../constants/location.error';

@Injectable()
export class GoogleLocationService {

  private geoCoder: google.maps.Geocoder;
  private readonly streetCase = [
    'street_address',
    'route',
    'premise',
    'subpremise',
    'natural_feature',
    'airport',
    'park',
    'establishment'
  ];

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  private static getAddressFromGeoCodeResult(place) {
    const componentForm: ComponentForm = {
      political: 'long_name',
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name',
      state: 'short_name',
    };
    if (place && place.address_components && place.address_components.length) {
      for (const addressComponent of place.address_components) {
        const addressType = addressComponent.types[0];
        if (componentForm[addressType]) {
          componentForm[addressType] = addressComponent[componentForm[addressType]];
          if (addressType === 'administrative_area_level_1') {
            componentForm.state = addressComponent[componentForm.state];
          }
        }
      }
      Object.keys(componentForm).forEach(field => {
        componentForm[field] = ((componentForm[field] !== 'long_name') &&
          (componentForm[field] !== 'short_name')) ? componentForm[field] : '';
      });
      return componentForm;
    }
    return null;
  }

  private getAddressType(response) {
    const types = map(response.address_components, 'types');
    let extractedTypes = [];
    each(types, (type) => {
      extractedTypes = extractedTypes.concat(type);
    });
    extractedTypes = union(extractedTypes);
    return (intersection(extractedTypes, this.streetCase).length) ? 'street' : 'others';
  }

  getLocationDetails(request: GoogleLocationRequest): Promise<{ latitude, longitude, formatted_address, address }> {
    return new Promise((resolve, reject) => {
      this.mapsAPILoader.load().then(() => {
        if (!this.geoCoder) {
          this.geoCoder = new google.maps.Geocoder();
        }
        this.geoCoder.geocode({
          address: request.input,
        }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const addressType = this.getAddressType(results[0]);
            if ((request.addressType === 'any') || (addressType === request.addressType)) {
              const data: any = {};
              results.forEach((result) => {
                data.latitude = result.geometry.location.lat().toFixed(8);
                data.longitude = result.geometry.location.lng().toFixed(8);
                data.formatted_address = result.formatted_address;
                data.address = GoogleLocationService.getAddressFromGeoCodeResult(result);
              });
              resolve(data);
            } else {
              reject(LocationErrors.INCOMPLETE);
            }
          } else {
            reject(LocationErrors.NOT_FOUND);
          }
        });
      }, () => reject(LocationErrors.UNAVAILABLE));
    });
  }

  getCurrentLocationDetails({latitude, longitude}): Promise<{ formatted_address: string, address: ComponentForm }> {
    return new Promise((resolve, reject) => {
      this.mapsAPILoader.load().then(() => {
        if (!this.geoCoder) {
          this.geoCoder = new google.maps.Geocoder();
        }
        this.geoCoder.geocode({location: new google.maps.LatLng(latitude, longitude)},
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                resolve({
                  formatted_address: results[0].formatted_address,
                  address: GoogleLocationService.getAddressFromGeoCodeResult(results[0])
                });
              } else {
                reject(LocationErrors.INCOMPLETE);
              }
            } else {
              reject(LocationErrors.NOT_FOUND);
            }
          });
      }, () => reject(LocationErrors.UNAVAILABLE));
    });
  }
}

export interface GoogleLocationRequest {
  input: any;
  addressType: 'street' | 'other' | 'any';
  countryComponentRestrictions?: string;
}

export interface ComponentForm {
  political: string;
  street_number: string;
  route: string;
  locality: string;
  administrative_area_level_1: string;
  country: string;
  postal_code: string;
  state: string;
}

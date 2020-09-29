import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {LocationService} from '../../shared/services/location.service';
import {MapTypeStyle} from '@agm/core';
import {GoogleLocationService} from '../../shared/services/google-location.service';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {LocationErrors} from '../../shared/constants/location.error';
import {BehaviorSubject} from 'rxjs';
import {AppStore} from '../../app.store';
import {customZoomControl} from '../shared/map.util';

@Component({
  selector: 'app-breed-identify',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.scss', '../breed-identification.component.scss'],
})
export class IdentifyBreedComponent implements OnDestroy, OnInit {
  getPicture = false;
  imageToCrop$ = new BehaviorSubject(null);
  locationErrors = LocationErrors;
  mapInfo$ = new BehaviorSubject({latitude: null, longitude: null, mapZoom: 1, error: null});
  locationSearches$ = new BehaviorSubject<{ name: string, img: string, index?: number }[]>([{
    name: 'Husky 1',
    img: '/assets/img/husky.png',
  }, {
    name: 'Husky 2',
    img: '/assets/img/husky.png',
  }, {
    name: 'Husky 3',
    img: '/assets/img/husky.png',
  }, {
    name: 'Husky 4',
    img: '/assets/img/husky.png',
  }, {
    name: 'Husky 5',
    img: '/assets/img/husky.png',
  }]);
  styles: MapTypeStyle[] = [
    /*{
      featureType: 'all',
      elementType: 'labels',
      stylers: [{
        visibility: 'off'
      }]
    }*/
  ];
  addressAutoCompleteList$ = new BehaviorSubject<string[]>([]);
  private formattedAddress: string;
  private address: any;
  private listeners = [];
  @Output() searchImage = new EventEmitter<string>();
  @Output() searchPet = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('uploadRef') uploadRef: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autoComplete: MatAutocompleteTrigger;

  constructor(public store: AppStore,
              private location: LocationService,
              private gLocationService: GoogleLocationService) {
    const searches = this.locationSearches$.value;
    let random = [];
    while (searches.length) {
      const index = Math.floor(Math.random() * searches.length);
      const current = searches.splice(index, 1);
      random = [
        {...current[0]},
        ...random
      ];
    }
    this.locationSearches$.next(random);
    searches.map(search => {
      search.index = 1;
      return search;
    });
  }

  ngOnInit(): void {
    this.getLocation().catch(() => {
    });
  }

  ngOnDestroy(): void {
    this.listeners.forEach((l: google.maps.MapsEventListener) => l.remove());
  }

  capturePhoto(photo) {
    this.searchImage.next(photo);
  }

  upload({files}: any) {
    this.imageToCrop$.next(files[0]);
    this.uploadRef.nativeElement.value = '';
  }

  setCurrentLocation() {
    this.getLocation().then(coordinates => this.gLocationService.getCurrentLocationDetails(coordinates)
      .then(({formatted_address, address}) => {
        this.input.nativeElement.value = formatted_address;
        this.formattedAddress = formatted_address;
        this.address = address;
      }))
      .catch(error => this.mapInfo$.next({...this.mapInfo$.value, error}));
  }

  clearError() {
    if (this.mapInfo$.value.error !== null) {
      this.mapInfo$.next({...this.mapInfo$.value, error: null});
    }
  }

  submitAddress(value) {
    this.clearError();
    this.gLocationService.getLocationDetails({
      input: value,
      addressType: 'street',
    }).then(({latitude, longitude, formatted_address, address}) => {
      this.input.nativeElement.value = formatted_address;
      this.address = address;
      this.formattedAddress = formatted_address;
      this.mapInfo$.next({latitude: +latitude, longitude: +longitude, mapZoom: 17, error: null});
      if (this.autoComplete) {
        this.autoComplete.closePanel();
      }
    }).catch(error => this.mapInfo$.next({...this.mapInfo$.value, error}));
  }

  private getLocation() {
    return this.location.getUserCoordinates()
      .then(({latitude, longitude}) => {
        this.mapInfo$.next({latitude, longitude, mapZoom: 17, error: null});
        return {latitude, longitude};
      });
  }

  croppedImage(image = null) {
    if (image) {
      this.searchImage.next(image);
    }
    this.imageToCrop$.next(null);
  }

  customZoom(e) {
    const c = document.createElement('div');
    c.style.zIndex = '10';
    this.listeners = customZoomControl(c, e);
    e.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(c);
  }
}

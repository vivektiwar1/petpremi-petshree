import {Directive, ElementRef, Output, OnInit, OnDestroy, NgZone} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {NgModel} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import lodMap from 'lodash/map';

@Directive({
  selector: '[appGoogleAutoComplete]',
  providers: [NgModel],
})
export class GoogleAutoCompleteDirective implements OnInit, OnDestroy {

  @Output() addressAutoCompleteList = new Subject<any>();
  private autoComplete: any;
  private subscription: Subscription;

  constructor(private el: ElementRef,
              private mapsAPILoader: MapsAPILoader,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.subscription = fromEvent(this.el.nativeElement, 'input').pipe(
      map((x: any) => x.target.value),
      debounceTime(400),
      distinctUntilChanged()).subscribe(value => {
      this.showMatchingAddresses(value);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /* The address list is created by google library and user can select address from that list*/
  private showMatchingAddresses(value): void {
    if (value === '') {
      this.addressAutoCompleteList.next([]);
      return;
    }
    this.mapsAPILoader.load().then(() => {

      if (!this.autoComplete) {
        this.autoComplete = new google.maps.places.AutocompleteService();
      }

      this.autoComplete.getPlacePredictions({
        input: value,
        types: ['geocode'],
      }, (result, status) => {
        this.zone.run(() => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.addressAutoCompleteList.next((result === null) ? [] : lodMap(result, 'description'));
          } else {
            this.addressAutoCompleteList.next([]);
          }
        });
      });
    }, () => this.addressAutoCompleteList.next([]));
  }
}

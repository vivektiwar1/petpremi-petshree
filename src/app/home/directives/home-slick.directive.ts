import {AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output} from '@angular/core';
import {SlickService} from '../../shared/services/slick.service';
import {Subscription} from 'rxjs';
import * as $ from 'jquery';
import 'slick-carousel';

const TIMEOUT = 10000;

@Directive({
  selector: '[appHomeSlick]'
})
export class HomeSlickDirective implements AfterViewInit, OnDestroy {
  private subscription: Subscription;
  private timeout = null;
  @Output() slideActivated = new EventEmitter();

  constructor(private e: ElementRef,
              private service: SlickService) {
  }

  ngAfterViewInit(): void {
    $(this.e.nativeElement).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      dots: true,
      dotsClass: 'slick-dots home-dots',
      infinite: true,
      autoplay: true,
      autoplaySpeed: TIMEOUT,
      arrows: false,
      cssEase: 'linear',
      pauseOnDotsHover: true,
    });

    this.subscription = this.service.resetSlide$.subscribe(() => {
      $(this.e.nativeElement).slick('slickPause');
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => $(this.e.nativeElement).slick('slickPlay'), TIMEOUT);
    });

    $(this.e.nativeElement).bind('afterChange', (event, slick, currentSlide) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.slideActivated.emit(currentSlide);
    });
  }

  ngOnDestroy(): void {
    $(this.e.nativeElement).unbind('afterChange');
    if (typeof $.fn.Slick !== 'undefined') {
      $(this.e.nativeElement).slick('unslick');
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

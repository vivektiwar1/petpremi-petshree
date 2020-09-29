import {Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import * as  $ from 'jquery';
import 'slick-carousel';

@Directive({
  selector: '[appBreedSlick]'
})
export class BreedSlickDirective implements OnDestroy {
  isFirst = true;
  items = [];

  @Input() set list(items) {
    this.items = items;
    if (!this.isFirst) {
      this.ngOnDestroy();
    }
    this.createSlick();
  }

  private subscriptions: Subscription[];
  @Output() slideActivated = new EventEmitter();

  constructor(private e: ElementRef) {
  }

  createSlick(): void {
    this.isFirst = false;
    let html = ``;
    this.items.forEach((item, index) => html += `<div class="slide ${(index === 0) ? 'active' : ''}"><img data-id="${index}" src="${item}" alt=""/></div>`);
    this.e.nativeElement.innerHTML = html;
    $(this.e.nativeElement).slick({
      slidesToShow: 4,
      dots: false,
      infinite: false,
      autoplay: false,
      arrows: true,
      cssEase: 'linear',
      lazyLoad: 'ondemand',
      prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"><img src="/assets/icon/arrow.png" alt=""/></button>',
      nextArrow: '<button class="slick-next" aria-label="Next" type="button"><img src="/assets/icon/arrow.png" alt=""/></button>',
      responsive: [
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 3
          }
        }, {
          breakpoint: 525,
          settings: {
            slidesToShow: 2,
          }
        },
      ]
    });
    this.subscriptions = [
      fromEvent(this.e.nativeElement, 'click').subscribe(({target}) => {
        if (target) {
          const index = target.getAttribute('data-id');
          $(this.e.nativeElement).find('.slide').removeClass('active');
          if (index !== null) {
            $(this.e.nativeElement).find(`[data-id=${index}]`).parent().addClass('active');
            this.slideActivated.emit(Number(index));
          }
        }
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s && s.unsubscribe());
    if (typeof $.fn.Slick !== 'undefined') {
      $(this.e.nativeElement).slick('unslick');
    }
  }
}

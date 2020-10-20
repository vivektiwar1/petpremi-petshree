import {Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {BreedService} from '../breed.service';
import * as $ from 'jquery';
import 'slick-carousel';

@Directive({
  selector: '[appBreedSlick]'
})
export class BreedSlickDirective implements OnDestroy, OnInit {
  isFirst = true;
  itemsSubscription: Subscription;

  private subscriptions: Subscription[];
  @Output() slideActivated = new EventEmitter();

  constructor(private e: ElementRef<HTMLDivElement>,
              private service: BreedService) {
  }

  ngOnInit(): void {
    this.itemsSubscription = this.service.breedList$.subscribe(items => {
      if (!this.isFirst) {
        this.unSlickAndDestroy();
      }
      this.createSlick(items);
    });
  }

  createSlick(items: any[]): void {
    this.isFirst = false;
    const element = document.createElement('div');
    element.id = 'slick-items';
    element.innerHTML = items.reduce((total, item, index) =>
        `${total} <div class="slide ${(index === 0) ? 'active' : ''}"><img data-id="${index}" src="${item}" alt=""/></div>`,
      '');
    this.e.nativeElement.innerHTML = '';
    this.e.nativeElement.appendChild(element);
    $(element).slick({
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
          const index = (target as HTMLImageElement).getAttribute('data-id');
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
    this.unSlickAndDestroy();
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

  unSlickAndDestroy() {
    this.subscriptions.forEach(s => s && s.unsubscribe());
    if (typeof $.fn.Slick !== 'undefined') {
      const element = this.e.nativeElement.querySelector('#slick-items');
      $(element).slick('unslick');
    }
  }
}

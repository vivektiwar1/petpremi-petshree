import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ScrollOffset } from '../app.constant';
import { ECardService } from '../modules/e-card/e-card.service';

@Directive({
  selector: '[scrollActive]'
})
export class ScrollActiveDirective implements OnInit, AfterViewInit, OnDestroy {
  childElement: Array<any>;
  onElemChange: Subject<string> = new Subject();
  onDestroy$: Subject<any> = new Subject();

  constructor(
    private element: ElementRef,
    private eCardService: ECardService
  ) { }

  ngOnInit() {
    const scrollEvent$ = fromEvent(window, 'scroll');
    
    this.onElemChange.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.onDestroy$)
    ).subscribe(id => {
      this.eCardService.setNavActive(id);
    });

    scrollEvent$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      if (this.childElement.length) {
        this.childElement.forEach((elem: HTMLDivElement, index) => {
          const offset = Math.floor(window.pageYOffset + ScrollOffset + window.innerHeight/2);
          const smallOffset = elem.offsetHeight < window.innerHeight/2 ? 100 : 200;
          if (offset - smallOffset >= elem.offsetTop && offset + smallOffset < elem.offsetTop + ScrollOffset + 2 + elem.offsetHeight) {
            this.onElemChange.next(elem.getAttribute('id'));
          }
        });
      }
    })
  }

  ngAfterViewInit() {
    const sectionElement: HTMLElement = this.element.nativeElement;
    this.childElement = Array.from(sectionElement.children || []);
  }

  ngOnDestroy() {
    this.onDestroy$.next()
  }
}

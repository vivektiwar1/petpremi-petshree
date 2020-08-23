import { Directive, HostListener, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[keyboardNav]'
})
export class KeyboardNavigationDirective {

  childElementList: Array<HTMLLIElement>;
  @Output()
  keyboardNav: EventEmitter<number> = new EventEmitter<number>()

  constructor(
    private element: ElementRef,
    private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    const childElementList = (this.element.nativeElement as HTMLUListElement).children;
    this.childElementList = Array.from(childElementList) as Array<HTMLLIElement>;
    this.renderer.addClass(this.childElementList[0], 'active');
  }

  @HostListener('document:keydown.arrowUp', ['$event'])
  @HostListener('document:keydown.arrowDown', ['$event'])
  @HostListener('document:keydown.enter', ['$event']) onKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    if (event.code === 'ArrowUp') this.onArrowUp();
    if (event.code === 'ArrowDown') this.onArrowDown();
    if (event.code === 'Enter') this.onEnter();
  }

  onArrowUp() {
    for (let element of this.childElementList) {
      if (element.classList.contains('active')) {
        this.renderer.removeClass(element, 'active');
        const previousElement = element.previousElementSibling;
        this.renderer.addClass(
          previousElement ? previousElement : this.childElementList[this.childElementList.length - 1],
          'active'
        );
        break;
      }
    }
  }

  onArrowDown() {
    for (let element of this.childElementList) {
      if (element.classList.contains('active')) {
        this.renderer.removeClass(element, 'active');
        const nextElement = element.nextElementSibling;
        this.renderer.addClass(
          nextElement ? nextElement : this.childElementList[0],
          'active'
        );
        break;
      }
    }
  }

  onEnter() {
    this.keyboardNav.emit(
      this.childElementList.findIndex(element => element.classList.contains('active'))
    )
  }

}

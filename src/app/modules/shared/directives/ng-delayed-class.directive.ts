import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

interface Config {
  active: boolean;
  classList: Array<string>;
  delay?: number
}

@Directive({
  selector: '[ngDelayedClass]'
})
export class NgDelayedClassDirective {

  @Input('ngDelayedClass') set init(config: Config) {
    this.modifyClasses(config);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  modifyClasses(config: Config): void {
    const element = this.el.nativeElement as HTMLElement;
    this.toggleClasses(element, config)
  }

  toggleClasses(element: HTMLElement, { active, classList = [], delay = 200 }: Config): void {
    const localClassList = [...classList];
    while (localClassList.length) {
      const [className] = localClassList.splice(0, 1);
      if (active) {
        setTimeout(() => {
          className && this.renderer.addClass(element, className);
        }, delay);
      } else {
        className && this.renderer.removeClass(element, className);
      }
    }
  }

}
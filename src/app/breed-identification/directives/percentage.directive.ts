import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appPct]',
})
export class PercentageDirective {
  @Input() set pct(pct) {
    this.percentage = pct;
    this.setText();
  }

  @Input() set text(txt: string) {
    this.txt = txt;
    this.setText();
  }

  private percentage = 0;
  private txt = '';

  constructor(private e: ElementRef) {
  }

  setText() {
    const element = this.e.nativeElement;
    if (element) {
      const fill = element.querySelector('.ppc-progress-fill');
      const pct = this.percentage;
      if (pct > 50) {
        const size = element.clientWidth;
        element.style.backgroundColor = '#50A55D';
        element.querySelector('.ppc-progress').style.clip = `rect(0 ${size / 2}px ${size}px 0)`;
        fill.style.clip = `rect(0,${size}px,${size}px,${size / 2}px)`;
        fill.style.background = '#fff';
      }
      fill.style.transform = 'rotate(' + (360 * pct / 100) + 'deg)';
      element.querySelector('.ppc-percents').querySelector('span').innerHTML = `${pct}% ${this.txt}`;
    }
  }
}

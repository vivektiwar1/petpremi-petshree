import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, Validators} from '@angular/forms';
import $ from 'jquery';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFooterComponent implements AfterViewInit, OnDestroy, OnInit {
  resizeEvent = new Subject<boolean>();
  scrollEvent = new Subject<boolean>();
  newsletter = this.fb.control('', [Validators.required, Validators.email]);
  @ViewChild('scrollTopElement') scrollTopElement: ElementRef;
  @ViewChild('newsLetterElement') newsLetterElement: ElementRef;
  @ViewChild('resourcesElement') resourcesElement: ElementRef;

  constructor(private fb: FormBuilder,
              private service: HomeService,
              private renderer: Renderer2,
              private footer: ElementRef) {
  }

  ngOnInit(): void {
    this.resizeEvent.pipe(debounceTime(1)).subscribe(() => this.setResize());
    this.scrollEvent.pipe(debounceTime(1)).subscribe(() => this.setPosition());
  }

  ngOnDestroy(): void {
    this.resizeEvent.unsubscribe();
    this.scrollEvent.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.setPosition();
    this.setNewsletterPosition();
  }

  submitNewsLetter() {
    if (this.newsletter.valid) {
      this.service.subscribeUs(this.newsletter.value).then(() => this.newsletter.reset());
    }
  }

  @HostListener('window:scroll', [])
  scroll(): void {
    this.scrollEvent.next();
  }

  @HostListener('window:resize', [])
  resize(): void {
    this.resizeEvent.next();
  }

  setNewsletterPosition() {
    if (this.newsLetterElement) {
      const height = this.newsLetterElement.nativeElement.offsetHeight;
      this.renderer.setStyle(this.newsLetterElement.nativeElement, 'top', `-${Math.floor(height / 2)}px`);
      this.renderer.setStyle(this.resourcesElement.nativeElement, 'padding-top', `${Math.floor(height / 2) + 50}px`);
      this.setResize();
    }
  }

  getImageHeight() {
    return Math.floor((window.innerWidth * 409) / 2735);
  }

  setResize() {
    if (this.newsLetterElement) {
      const height = this.newsLetterElement.nativeElement.offsetHeight;
      this.renderer.setStyle(
        this.footer.nativeElement.children[0],
        'padding-top',
        `${window.innerWidth < 992 ? Math.floor(height * 0.7) : this.getImageHeight()}px`
      );
    }
  }

  setPosition(): void {
    if (this.scrollTopElement) {
      if (window.pageYOffset < (0.3 * window.innerHeight)) {
        this.renderer.addClass(this.scrollTopElement.nativeElement, 'hide');
      } else {
        this.renderer.removeClass(this.scrollTopElement.nativeElement, 'hide');
      }
    }
  }

  scrollTop() {
    $('html, body').animate({scrollTop: 0}, 700);
  }
}

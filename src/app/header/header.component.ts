import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {LANGUAGE_SWITCHER} from '../shared/constants/app.constants';
import {AppService} from '../app.service';
import {AppStore} from '../app.store';
import * as $ from 'jquery';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent{
  languageSwitcher = LANGUAGE_SWITCHER;
  api = environment.api;
  user: any;
  @Input() petSwitcher = true;
  @Output() petChanged = new EventEmitter();
  @ViewChild('petBlock') petBlock: ElementRef;
  @ViewChild('slideMenu') slideMenu: ElementRef;

  constructor(public store: AppStore,
              public translate: TranslateService,
              public service: AppService,
              public auth: AuthService) {
              this.auth.userData$.subscribe(data => this.user = data);
  }

  /*ngAfterViewInit() {
    const arrowMainMenu = $('.arrow-main-menu');
    for (let i = 0; i < arrowMainMenu.length; i++) {
      $(arrowMainMenu[i]).on('click', function () {
        $(this).parent().find('.sub-menu').slideToggle();
        $(this).toggleClass('turn-arrow');
      });
    }
  }*/

  toggleMenu() {
    $('.btn-show-menu-mobile').toggleClass('is-active');
    const e = $(this.slideMenu.nativeElement);
    if (e.hasClass('hide')) {
      e.removeClass('hide')
        .removeClass('slideOutRight')
        .addClass('slideInRight');
    } else {
      e.removeClass('slideInRight')
        .addClass('slideOutRight');
      setTimeout(() => e.addClass('hide'), 1000);
    }
  }

  toggleProfile(element: HTMLUListElement) {
    $(element).toggleClass('hide');
  }

  search() {
    alert('search');
  }

  showPets(show: { visible? } = null) {
    if (show) {
      const {visible} = show;
      if (visible) {
        this.petBlock.nativeElement.classList.add('show');
      } else {
        this.petBlock.nativeElement.classList.remove('show');
      }
    } else {
      this.petBlock.nativeElement.classList.toggle('show');
    }
  }

  changePet(pet) {
    this.store.setPet(pet);
    this.petChanged.next(pet);
  }

  /*@HostListener('window:resize', [])
  checkMenu() {
    if ($(window).width() >= 992) {
      const subMenu = $('.sub-menu');
      if (subMenu.css('display') === 'block') {
        subMenu.css('display', 'none');
        $('.arrow-main-menu').removeClass('turn-arrow');
      }
    }
  }*/

  /*@HostListener('window:scroll', [])
  stickyHeader() {
    if (this.w.scrollTop() >= 200 && this.w.width() > 992) {
      $('.fixed-header2').addClass('show-fixed-header2');
      const h = $('.header2');
      h.css('visibility', 'hidden');
      h.find('.header-dropdown').removeClass('show-header-dropdown');
    } else {
      const h = $('.fixed-header2');
      h.removeClass('show-fixed-header2');
      $('.header2').css('visibility', 'visible');
      h.find('.header-dropdown').removeClass('show-header-dropdown');
    }
  }*/
}

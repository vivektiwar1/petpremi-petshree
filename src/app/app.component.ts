import {Component, OnInit} from '@angular/core';
import {CommonService} from './services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {DEFAULT_LANGUAGE_CODE} from './shared/constants/app.constants';
import {AppStore} from './app.store';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navStatus$: Observable<boolean>;
  isDrawerStatePersistent: boolean = true;
  loading$ = new BehaviorSubject(false);

  constructor(private commonService: CommonService,
              private store: AppStore,
              private translate: TranslateService,
              private router: Router) {
    this.navStatus$ = this.commonService.navStatus$;
    const language = this.getNavigatorLanguage();
    const index = language.indexOf('-');
    translate.setDefaultLang(index === -1 ? language : language.substr(0, index));
    translate.use(store.state.languageCode);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading$.next(true);
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading$.next(false);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  setDrawerState(state: boolean) {
    this.isDrawerStatePersistent = state;
  }

  getNavigatorLanguage = () => navigator.languages && navigator.languages[0] ||
    (navigator as any).userLanguage ||
    navigator.language ||
    (navigator as any).browserLanguage ||
    DEFAULT_LANGUAGE_CODE;
}

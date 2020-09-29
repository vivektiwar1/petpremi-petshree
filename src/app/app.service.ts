import {Injectable} from '@angular/core';
import {retry, take} from 'rxjs/operators';
import {AppStore} from './app.store';
import {TranslateService} from '@ngx-translate/core';
import {DEFAULT_LANGUAGE} from './shared/constants/app.constants';
import {DataService} from './shared/services/data.service';

@Injectable()
export class AppService {

  static languageCode: string;

  constructor(private dataService: DataService,
              private store: AppStore,
              private translate: TranslateService) {
    AppService.languageCode = store.state.languageCode;
    this.getPets();
    this.getLanguages();
  }

  getPets() {
    this.dataService.search({
      entityName: 'PetType',
      uiBean: 'BNEPetType'
    }).pipe(
      take(1),
      retry(1),
    ).subscribe(
      (p: any[]) => this.store.setPets(p),
      () => {
      }
    );
  }

  getLanguages() {
    this.dataService.search('Language', {status: true}, null).pipe(
      take(1),
      retry(1),
    ).subscribe(
      (data: { code: string }[]) => {
        this.translate.addLangs(data.map(l => l.code));
        this.store.setLanguages(data);
      },
      () => {
        this.translate.addLangs([DEFAULT_LANGUAGE].map(l => l.code));
        this.store.setLanguages([DEFAULT_LANGUAGE]);
      }
    );
  }

  changeLanguage(language) {
    if (this.translate.currentLang !== language) {
      this.store.setLanguage(language);
      AppService.languageCode = language;
      window.location.reload();
      /*this.translate.use(language).pipe(take(1)).subscribe(() => {
        this.store.setLanguage(language);
        AppService.languageCode = language;
      });*/
    }
  }
}

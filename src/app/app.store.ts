import {Injectable} from '@angular/core';
import {Store} from './shared/helpers/store';
import {DEFAULT_LANGUAGE, DEFAULT_LANGUAGE_CODE, DEFAULT_PET} from './shared/constants/app.constants';

export class AppState {
  pet = DEFAULT_PET;
  pets = [DEFAULT_PET];
  languageCode = '';
  languages = [DEFAULT_LANGUAGE];
  basePath: string;
  isAuthenticated = false;
  token: string;
  refreshToken: string;
  tokenExpiresIn: number;

  constructor({code, token = null, basePath, refreshToken = null, tokenExpiresIn = 0}: {
    code?: string,
    basePath: string,
    token: string,
    refreshToken: string,
    tokenExpiresIn: number
  }) {
    this.languageCode = code;
    this.basePath = basePath;
    this.isAuthenticated = !!token;
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenExpiresIn = tokenExpiresIn;
  }
}

const storageConstants = {
  TOKEN: '_token',
  REFRESH_TOKEN: '_refreshToken',
  TOKEN_EXPIRES_IN: '_tokenExpiresIn',
};

@Injectable()
export class AppStore extends Store<AppState> {
  constructor() {
    const token = localStorage.getItem(storageConstants.TOKEN) ?? null;
    let tokenExpiresIn: any = localStorage.getItem(storageConstants.TOKEN_EXPIRES_IN);
    tokenExpiresIn = tokenExpiresIn ? Number(tokenExpiresIn) : 0;
    super(new AppState({
      code: localStorage.getItem('languageCode') || DEFAULT_LANGUAGE_CODE,
      basePath: AppStore.getBasePath(token),
      token,
      refreshToken: localStorage.getItem(storageConstants.REFRESH_TOKEN) ?? null,
      tokenExpiresIn,
    }));
  }

  static getBasePath(token) {
    return `service/${token ? 'oauth2/' : ''}api/`;
  }

  setPet(pet = this.state.pet) {
    this.setState({
      ...this.state,
      pet
    });
  }

  setPets(pets = []) {
    const pet = pets[0] ? {...pets[0]} : this.state.pet;
    this.setState({
      ...this.state,
      pets,
      pet
    });
  }

  setLanguages(languages = []) {
    this.setState({
      ...this.state,
      languages,
    });
  }

  setLanguage(code = DEFAULT_LANGUAGE_CODE) {
    this.setState({
      ...this.state,
      languageCode: code
    });
    localStorage.setItem('languageCode', code);
  }

  setAuthToken(token = null, refreshToken = null, tokenExpiresIn = 0) {
    this.setState({
      ...this.state,
      isAuthenticated: !!token,
      basePath: AppStore.getBasePath(token),
      token,
      refreshToken,
      tokenExpiresIn,
    });
    if (token) {
      localStorage.setItem(storageConstants.TOKEN, token);
      localStorage.setItem(storageConstants.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(storageConstants.TOKEN_EXPIRES_IN, tokenExpiresIn + '');
    } else {
      localStorage.removeItem(storageConstants.TOKEN);
      localStorage.removeItem(storageConstants.REFRESH_TOKEN);
      localStorage.removeItem(storageConstants.TOKEN_EXPIRES_IN);
    }
  }
}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthModalConfig } from '../../auth/auth-form/auth.constants';
import { environment } from '../../../environments/environment';
import { catchError, map, take } from 'rxjs/operators';
import { DataService } from './data.service';
import { AppStore } from '../../app.store';

@Injectable()
export class AuthService {
  countries$ = new BehaviorSubject(null);
  titles$ = new BehaviorSubject(null);
  genders$ = new BehaviorSubject(null);
  userData$ = new BehaviorSubject({});
  private dialogOpened = null;

  constructor(private dialog: MatDialog,
              private dataService: DataService,
              private app: AppStore,)
               {
    if (this.app.state.isAuthenticated) {
      this.userData$.next(JSON.parse(localStorage.getItem('userData')));
    }
  }
  
  checkAndLogin(config: AuthModalConfig = new AuthModalConfig()): Promise<any> {
    if (this.dialogOpened) {
      return this.dialogOpened;
    }
    if (this.app.state.isAuthenticated) {
      return Promise.resolve(true);
    }
    document.body.style.overflow = 'hidden';
    const dialogRef = this.dialog.open(AuthModalComponent, {
      closeOnNavigation: true,
      disableClose: config.disableClose,
      panelClass: 'auth-panel',
      maxWidth: '920px',
      data: {
        ...config,
      }
    });
    this.dialogOpened = dialogRef.afterClosed()
      .toPromise()
      .then(() => {
        this.dialogOpened = null;
        document.body.style.overflow = 'visible';
      });
    return this.dialogOpened;
  }

  signIn(objectHash) {
    return this.dataService.http.post(`${environment.api}service/oauth/token`,
      objectHash,
    ).pipe(map((data: any) => {
      if (data?.access_token) {
        const { access_token, refresh_token, expires_in } = data;
        this.app.setAuthToken(access_token, refresh_token, expires_in);
      }
      return data;
    }));
  }
  signInAdmin(objectHash) {
    return this.dataService.http.post(`${environment.api}service/oauth/token`,
      objectHash,
    ).pipe(map((data: any) => {
      if (data?.access_token) {
        const { access_token, refresh_token, expires_in } = data;
        this.app.setAuthToken(access_token, refresh_token, expires_in);
      }
      return data;
    }));
  }


  getUserProfile(params: any = {}) {
    if (this.app.state.isAuthenticated) {
      return this.dataService.http.get(`${environment.api}service/oauth2/api/user/data`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .pipe(take(1), map((user: any) => {
          localStorage.setItem('userData', JSON.stringify(user));
          this.userData$.next(user);
        })).toPromise();
    }
  }
  getCountries() {
    return this.dataService.search('Country')
      .pipe(take(1), map(countries => {
        this.countries$.next(countries);
        return countries;
      }));
  }

  getTitles() {
    return this.dataService.search('Title')
      .pipe(take(1), map(titles => {
        this.titles$.next(titles);
        return titles;
      }));
  }

  getGenders() {
    return this.dataService.search('Gender')
      .pipe(take(1), map(genders => {
        this.genders$.next(genders);
        return genders;
      }));
  }

  signUpStage1(objectHash) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}sign-up/user-stage1`, objectHash);
  }

  checkIdentifier(objectHash: { identifier: string, userType?: string }) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}check/identifier`, objectHash)
      .pipe(catchError(() => of({ apiError: true })));
  }

  sendOtp(payload) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}sendOtp`, payload)
      .pipe(take(1));
  }

  resendOtp(payload) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}reSendOtp`, payload)
      .pipe(take(1));
  }

  verifyOtp(payload) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}verifyOtp`, payload)
      .pipe(take(1));
  }

  signUpStage2(objectHash) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}sign-up/user-stage2`, objectHash)
      .pipe(map((data: any) => {
        if (data?.access_token) {
          const { access_token, refresh_token, expires_in } = data;
          this.app.setAuthToken(access_token, refresh_token, expires_in);
        }
        return data;
      }));
  }

  logout() {
    return this.dataService.http.get(`${environment.api}service/oauth/logout`)
      .pipe(catchError(() => of(0)), map(() => this.app.setAuthToken())).toPromise();
  }

  getUserDetails(randomKey) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}crud`, {
      commonParamHash: {
        entityName: 'User',
        operation: 'SEARCH',
        uiBean: 'BNECustomerProfile',
      },
      objectHash: {
        randomKey,
      }
    }).pipe(map((data: any) => data.responseResult.data.content));
  }

  updateUserDetails(objectHash, id) {
    return this.dataService.update({
      entityName: 'User',
      uiBean: 'BNECustomerProfile'
    }, id + '', objectHash);
  }

  updatePassword(payload) {
    return this.dataService.http.post(`${environment.api}${this.app.state.basePath}user/password/update`, payload)
      .pipe(take(1), map((data: any) => {
        if (data?.access_token) {
          const { access_token, refresh_token, expires_in } = data;
          this.app.setAuthToken(access_token, refresh_token, expires_in);
        }
        return data;
      }));
  }
}

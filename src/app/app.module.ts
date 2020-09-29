import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppStore} from './app.store';
import {AppService} from './app.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {LanguageInterceptor} from './shared/interceptors/language.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DEFAULT_LANGUAGE_CODE} from './shared/constants/app.constants';
import {CacheInterceptor} from './shared/interceptors/cache.interceptor';
import {CacheService} from './shared/services/cache.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {SlickService} from './shared/services/slick.service';
import {AuthInterceptor} from './shared/interceptors/auth.interceptor';
import {LocationService} from './shared/services/location.service';
import {AuthService} from './shared/services/auth.service';
import {AuthGuard} from './shared/guards/auth.guard';
import {GuestGuard} from './shared/guards/guest.guard';
import {AuthModalModule} from './auth/auth-modal/auth-modal.module';
import {AppConfig} from './app.config';
import {DataService} from './shared/services/data.service';

import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './modules/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MatSidenavModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: DEFAULT_LANGUAGE_CODE
    }),
    MatProgressBarModule,
    AuthModalModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AppStore,
    AppService,
    CacheService,
    SlickService,
    LocationService,
    AuthService,
    DataService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true},
    AuthGuard,
    GuestGuard,
    AppConfig,
  ],
  exports: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

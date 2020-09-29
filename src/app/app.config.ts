import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class AppConfig {
  /**
   * This method:
   *   Loads 'location' to get the current current restaurant location
   *   Validates location, guest token, cart and order data
   */
  public load() {

    // FB App Id
    this.addFBAppIdToDoc(environment.fbId);

    // Google App Id
    this.addGoogleAppIdToDoc(environment.googleId);
  }

  addFBAppIdToDoc(fbAppId: string) {
    if (fbAppId) {
      const script: HTMLScriptElement = document.createElement('script');
      script.text = `FB.init({
          appId: '${fbAppId}',
          cookie: true,
          xfbml: true,
          version: 'v8.0'
        });
        FB.AppEvents.logPageView();`;
      document.body.appendChild(script);
    }
  }

  addGoogleAppIdToDoc(googleAppId: string) {
    if (googleAppId) {
      const script: HTMLScriptElement = document.createElement('script');
      script.text = `window.onload = function () {
        gapi.load('auth2', function () {
          gapi.auth2.init({
            client_id: '${googleAppId}',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email',
          });
        });
      };`;
      document.body.appendChild(script);
    }
  }
}

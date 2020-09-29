import {AuthErrors, LoginConstants} from './auth.constants';
import difference from 'lodash/difference';

declare const gapi: any;
declare var FB: any;

class SocialAuthResponse {
  firstName: string;
  lastName: string;
  // name: string;
  profileImage: string;
  email: string;
  accessToken: string;
  social: number;

  constructor({
                firstName = null,
                lastName = null,
                // name = null,
                profileImage = null,
                email = null,
                accessToken = null,
                social = null,
              } = new SocialAuthResponse({})) {
    this.firstName = firstName;
    this.lastName = lastName;
    // this.name = name;
    this.profileImage = profileImage;
    this.email = email;
    this.accessToken = accessToken;
    this.social = social;
  }
}

export abstract class SocialLoginHelper {
  fbReRequest = false;    // this is set true when expected permissions are not provided by user on fb login
  fbRes = {} as any;

  /*
    * @desc this function will check login status
    * if already logged in to facebook, will check perms and login
    * else, function will check if user has to grant permissions,
    * then will call login with permissions rerequest or normal login
    * */
  loginWithFacebook(): Promise<SocialAuthResponse> {
    return new Promise(resolve => {
      FB.getLoginStatus((response) => {
        if (response.status !== LoginConstants.FB_CONNECTED_STATUS) {
          if (this.fbReRequest) {
            FB.login((loginResponse) => resolve(this.checkFBGrantedScopesAndLoginUser(loginResponse)),
              {auth_type: 'rerequest', scope: 'public_profile,email', return_scopes: true});
          } else {
            FB.login((loginResponse) => resolve(this.checkFBGrantedScopesAndLoginUser(loginResponse)),
              {scope: 'public_profile,email', return_scopes: true});
          }
        } else {
          this.fbRes = response;
          resolve(this.getFBDataAndLoginUser());
        }
      });
    });
  }

  /*
  * @desc this function will use google login API to get access token and user details of user which can be passed to
  * main server to login or sign up user
  * */
  loginWithGoogle(): Promise<SocialAuthResponse> {
    const auth = gapi.auth2.getAuthInstance();
    return new Promise((resolve, reject) => {
      auth.signIn().then(() => {
        // LoggerService.debug(success);
        const googleUser = auth.currentUser.get();
        const profile = googleUser.getBasicProfile();
        resolve(new SocialAuthResponse({
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          // name: profile.getName(),
          profileImage: profile.getImageUrl() + '?sz=300',
          email: profile.getEmail(),
          accessToken: googleUser.getAuthResponse().access_token,
          social: profile.getId(),
        }));
      }, fail => {
        // LoggerService.debug(fail);
        if (fail === 'access_denied') {
          this.socialSignOut(LoginConstants.TYPE_GOOGLE);
          return reject(AuthErrors.PERMISSIONS);
        }
        reject(AuthErrors.UNKNOWN);
      });
    });
  }

  /*
  * @desc for facebook provider, this function will check if scopes/permissions are granted, user will be logged in
  * else, user will be logged out and appropriate error message will be displayed so that user can re login
  * providing all permissions
  * */
  checkFBGrantedScopesAndLoginUser(loginResponse: any): Promise<SocialAuthResponse> {
    // LoggerService.debug(loginResponse);
    this.fbRes = loginResponse;
    return new Promise((resolve, reject) => {
      if ((loginResponse) && (loginResponse.status === LoginConstants.FB_CONNECTED_STATUS)) {
        this.fbReRequest = true;
        const grantedScopes = loginResponse.authResponse.grantedScopes.split(',');
        if (difference(['email'], grantedScopes).length === 0) {
          // all A entries are into B
          this.fbReRequest = false;
          return resolve(this.getFBDataAndLoginUser());
        } else {
          // if user does not grant required permission, fb-re-request flag is set to true so that if user logs in again,
          // user is again asked for permissions
        }
      }
      reject(AuthErrors.PERMISSIONS);
      this.socialSignOut(LoginConstants.TYPE_FB);
    });
  }

  /*
  * @desc this function is called after loggin in by fb and all required permissions are granted
  * user data is fetched from FB api and user is logged in
  * */
  getFBDataAndLoginUser(): Promise<SocialAuthResponse> {
    this.fbReRequest = false;
    return new Promise(resolve => {
      FB.api('/me?fields=id,name,first_name,last_name,picture.width(500).height(500),email,birthday', r1 => {
        FB.getLoginStatus(statusResponse => {
          // LoggerService.debug('login status2 - ', statusResponse);
          if (statusResponse.status === LoginConstants.FB_CONNECTED_STATUS) {
            resolve(new SocialAuthResponse({
              firstName: r1.first_name,
              lastName: r1.last_name,
              profileImage: r1.picture.data === undefined ? null : r1.picture.data.url,
              email: r1.email,
              accessToken: this.fbRes.authResponse.accessToken,
              social: this.fbRes.authResponse.userID,
            }));
          } else {
            resolve(this.loginWithFacebook());
          }
        });
      });
    });
  }

  /*
    * @desc this function will logout user from facebook and google
    * */
  socialSignOut(type): void {
    if (type === LoginConstants.TYPE_GOOGLE) {
      // logout for google
      try {
        if ((gapi) && (gapi.auth2)) {
          const auth = gapi.auth2.getAuthInstance();
          auth.disconnect().then(() => {
          }, () => {
          });
          auth.signOut().then(() => {
            // LoggerService.debug('User signed out from google.');
          }, () => {
          });
        } else {
          // LoggerService.debug('gapi was not init');
        }
      } catch (e) {
        // LoggerService.error('user was not logged into google, logout google exception - ', e);
      }
    }
    if (type === LoginConstants.TYPE_FB) {
      // logout for facebook
      try {
        FB.getLoginStatus((response) => {
          if (response.status !== LoginConstants.FB_UNKNOWN_STATUS) {
            FB.logout(() => {
              // user is now logged out
              // LoggerService.debug('logout - ', r);
            });
          }
        });
      } catch (e) {
        // LoggerService.error('logout fb exception - ', e);
      }
    }
  }
}

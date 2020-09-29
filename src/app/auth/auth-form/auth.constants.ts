export enum AuthFormTypes {
  NONE,                     // unknown form type
  LOGIN,                    // login type
  SIGN_UP_STAGE1,           // normal sign up, in case of mobile, goto stage 2
  SIGN_UP_STAGE2,           // after verify sign up stage 1, verify mobile
  VALIDATE_EXISTING_USER,   // verify user if identifier matched for different user type, send user to stage 1 with details
  VERIFY_DETAILS,           // same as sign up stage 1, only user is already verified along with user details
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
}

export const LoginConstants = {
  FB_CONNECTED_STATUS: 'connected',
  FB_NOT_AUTHORIZED: 'not_authorized',
  FB_UNKNOWN_STATUS: 'unknown',
  TYPE_NORMAL: 'self',
  TYPE_FB: 'fb',
  TYPE_GOOGLE: 'google',
  RESEND_AFTER: 15 * 60,
};

export enum AuthErrors {
  UNKNOWN,
  PERMISSIONS,
}

export const AUTH_USER_TYPE = {
  ADMIN: 'admin',
  PARTNER: 'partner',
  CUSTOMER: 'customer',
};

export const AUTH_SIGN_UP_CLIENT = {
  SELF: 'self',
  G_MAIL: 'gmail',
  FB: 'facebook',
};

export class AuthModalConfig {
  disableClose: boolean;
  formType: number;

  constructor({disableClose = false, formType = AuthFormTypes.LOGIN} = new AuthModalConfig({})) {
    this.disableClose = disableClose;
    this.formType = formType;
  }
}

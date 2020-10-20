import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, merge, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {catchError, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import $ from 'jquery';
import * as momentTz from 'moment-timezone';
import {AuthService} from '../../shared/services/auth.service';
import {AUTH_SIGN_UP_CLIENT, AUTH_USER_TYPE, AuthErrors, AuthFormTypes, LoginConstants} from './auth.constants';
import {CustomValidators, PWD_VALIDATORS, validateAllFormFields} from '../../shared/helpers/form.helper';
import {SocialLoginHelper} from './social-login.helper';
import {AlertModalComponent} from '../../shared/modals/alert-modal/alert-modal.component';
import {environment} from '../../../environments/environment';
import {ConfirmModalComponent, ConfirmModalData} from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent extends SocialLoginHelper implements AfterViewInit, OnDestroy, OnInit {
  environment = environment;
  firstTime = true;
  formTypes = AuthFormTypes;
  signUpClient = AUTH_SIGN_UP_CLIENT;
  currentForm: number = AuthFormTypes.LOGIN;
  authFlow = this.signUpClient.SELF;
  staticAssets = {
    title1: 'auth.title1',
    description1: 'auth.description1',
    title2: `auth.${this.getFormTitle(this.currentForm)}Title`,
    bg1: `${this.getAssetId(this.currentForm)}-bg.png`,
    img1: `${this.getAssetId(this.currentForm)}-illustration.png`,
    bg1Col: this.getBgCol(this.currentForm),
  };
  userType = AUTH_USER_TYPE.CUSTOMER;

  loginForm = this.fb.group({
    username: ['', [Validators.required, CustomValidators.userNameValidator]],
    password: ['', [Validators.required]],
    grant_type: 'password',
    user_type: this.userType,
    login_type: AUTH_SIGN_UP_CLIENT.SELF,
  }, {
    updateOn: 'blur',
  });

  signUpForm = this.fb.group({
    email: ['', {
      validators: Validators.email,
      asyncValidators: this.validateIdentifier.bind(this),
    }],
    password: ['', [Validators.required, ...PWD_VALIDATORS]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobile: ['', {
      asyncValidators: this.validateIdentifier.bind(this),
    }],
    timeZone: [momentTz.tz.guess()],
    countryId: ['', [Validators.required]],
    genderId: ['', Validators.required],
    titleId: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    signUpBy: AUTH_SIGN_UP_CLIENT.SELF,
    userType: this.userType,
    countryIndex: 0,
    profileImage: [''],
  }, {
    updateOn: 'blur',
    validators: [
      CustomValidators.countryMobileValidator(this.service.countries$),
      CustomValidators.passwordMatchValidator,
    ],
  });

  verifyOtpForm = this.fb.group({
    otp: ['', Validators.required],
    randomKey: [''],
    timeZone: [momentTz.tz.guess()],
  });

  changePasswordForm = this.fb.group({
    password: ['', [Validators.required, ...PWD_VALIDATORS]],
    confirmPassword: ['', Validators.required],
    randomKey: [''],
    userType: this.userType,
    signUpBy: AUTH_SIGN_UP_CLIENT.SELF
  }, {
    updateOn: 'blur',
    validators: [
      CustomValidators.passwordMatchValidator,
    ],
  });

  fpForm = this.fb.group({
    username: ['', [Validators.required, CustomValidators.userNameValidator]],
    password: ['', [Validators.required, ...PWD_VALIDATORS]],
  }, {
    updateOn: 'blur',
  });

  userDetailsForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobile: [''],
    email: ['', Validators.email],
    country: this.fb.group({
      id: ['', Validators.required],
    }),
    title: this.fb.group({
      id: ['', Validators.required]
    }),
    gender: this.fb.group({
      id: ['', Validators.required]
    }),
    // dob: [''],
    countryIndex: 0,
    validatedEmail: [''],
    id: [''],
    profileImage: [''],
    activated: true,
  }, {
    updateOn: 'blur',
    asyncValidators: this.validateUserEmail.bind(this),
  });
  socialForm = {};

  formError$ = new BehaviorSubject('');
  loading$ = new BehaviorSubject(false);
  signUpLoadError$ = new BehaviorSubject(false);
  resendOtpSeconds$ = new BehaviorSubject<number>(0);
  resendThreadId = 0;
  private subscriptions: Subscription[];
  @Input() isModal = false;

  @Input() set modalFormType(type) {
    if (this.currentForm !== type) {
      this.changeForm(type);
    }
  }

  @Output() scrollTop = new EventEmitter();
  @Output() closeModal = new EventEmitter<any>();
  @ViewChild('formBlock') formBlock: ElementRef;
  user: any;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              public service: AuthService,
              private translate: TranslateService,
              private cd: ChangeDetectorRef,
              private dialog: MatDialog) {
    super();
    this.service.userData$.subscribe(data => this.user = data);
  }

  get isLoginForm() {
    return this.currentForm === AuthFormTypes.LOGIN;
  }

  get isSignUpForm() {
    return this.currentForm === AuthFormTypes.SIGN_UP_STAGE1;
  }

  get showAlternateRoute() {
    return this.isLoginForm || this.isSignUpForm;
  }

  get showAdditionalAction() {
    return this.isLoginForm
      || this.currentForm === AuthFormTypes.SIGN_UP_STAGE2
      || this.currentForm === AuthFormTypes.VALIDATE_EXISTING_USER;
  }

  get additionalActionClick() {
    return this.isLoginForm ? this.fp() : this.resendOtp();
  }

  get additionalActionTxt() {
    return this.isLoginForm ? 'auth.forgotPassword' : 'auth.resendOtp';
  }

  get form() {
    switch (this.currentForm) {
      case AuthFormTypes.FORGOT_PASSWORD:
        return this.fpForm;
      case AuthFormTypes.SIGN_UP_STAGE1:
        return this.signUpForm;
      case AuthFormTypes.SIGN_UP_STAGE2:
      case AuthFormTypes.VALIDATE_EXISTING_USER:
        return this.verifyOtpForm;
      case AuthFormTypes.CHANGE_PASSWORD:
        return this.changePasswordForm;
      case AuthFormTypes.VERIFY_DETAILS:
        return this.userDetailsForm;
      case AuthFormTypes.LOGIN:
      default:
        return this.loginForm;
    }
  }

  get formControl() {
    return this.form.controls;
  }

  get enableUserType() {
    switch (this.currentForm) {
      case AuthFormTypes.LOGIN:
        return true;
      case AuthFormTypes.SIGN_UP_STAGE1:
        return this.authFlow === AUTH_SIGN_UP_CLIENT.SELF;
      default:
        return false;
    }
  }

  get notRole() {
    return this.userType === AUTH_USER_TYPE.CUSTOMER ? 'auth.notCustomer' : 'auth.notPartner';
  }

  get signUpRole() {
    return this.userType === AUTH_USER_TYPE.CUSTOMER ? 'auth.signUpPartner' : 'auth.signUpCustomer';
  }

  getFormGroupControls(group) {
    return (this.formControl[group] as FormGroup).controls;
  }

  get formLoading() {
    return this.isSignUpForm && !this.signUpLoadError$.value &&
      (!this.service.genders$.value || !this.service.countries$.value || !this.service.titles$.value);
  }

  ngOnInit(): void {
    if (this.route.snapshot.data.formType !== undefined && this.route.snapshot.data.formType !== this.currentForm) {
      this.changeForm(this.route.snapshot.data.formType);
    }
    this.subscriptions = [
      merge(
        this.loginForm.valueChanges,
        this.signUpForm.valueChanges,
        this.changePasswordForm.valueChanges,
        this.verifyOtpForm.valueChanges,
      ).subscribe(() => this.formError$.next('')),
    ];
  }

  getBasicData() {
    if (this.isSignUpForm) {
      if (!this.service.titles$.value) {
        this.service.getTitles()
          .subscribe(data => data.length && this.signUpForm.controls.titleId.setValue(data[0].id),
            () => this.signUpLoadError$.next(true));
      } else if (!this.signUpForm.controls.titleId.value) {
        const title = this.getTitle();
        if (title) {
          this.signUpForm.controls.titleId.setValue(title.id);
        }
      }
      if (!this.service.countries$.value) {
        this.service.getCountries()
          .subscribe(data => {
            if (data.length) {
              this.signUpForm.controls.countryId.setValue(data[0].id);
            }
          }, () => this.signUpLoadError$.next(true));
      } else if (!this.signUpForm.controls.countryId.value) {
        const country = this.getCountry();
        if (country) {
          this.signUpForm.controls.countryId.setValue(country.id);
        }
      }
      if (!this.service.genders$.value) {
        this.service.getGenders()
          .subscribe(data => data.length && this.signUpForm.controls.genderId.setValue(data[0].id),
            () => this.signUpLoadError$.next(true));
      } else if (!this.signUpForm.controls.genderId.value) {
        const gender = this.getGender();
        if (gender) {
          this.signUpForm.controls.genderId.setValue(gender.id);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.isModal) {
      this.scrollToForm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(s => s && s.unsubscribe());
  }

  private changeForm(type = AuthFormTypes.LOGIN) {
    this.currentForm = type;
    this.updateStaticAssets(type);
    this.getBasicData();
    if (!this.firstTime) {
      this.scrollToForm();
    }
    this.firstTime = false;
    this.resendOtpSeconds$.next(0);
    if (this.resendThreadId) {
      clearInterval(this.resendThreadId);
      this.resendThreadId = 0;
    }
  }

  updateStaticAssets(type) {
    this.staticAssets = {
      ...this.staticAssets,
      title2: `auth.${this.getFormTitle(this.currentForm)}Title`,
      bg1: `${this.getAssetId(type)}-bg.png`,
      img1: `${this.getAssetId(type)}-illustration.png`,
      bg1Col: this.getBgCol(this.currentForm),
    };
  }

  getAssetId(type) {
    return type === AuthFormTypes.LOGIN ? 'sign-in' : 'sign-up';
  }

  getBgCol(type) {
    return type === AuthFormTypes.LOGIN ? '#f1ced7' : '#ffe3b3';
  }

  getFormTitle(type) {
    switch (type) {
      case AuthFormTypes.LOGIN:
        return 'signIn';
      case AuthFormTypes.FORGOT_PASSWORD:
        return 'fp';
      case AuthFormTypes.SIGN_UP_STAGE2:
      case AuthFormTypes.VALIDATE_EXISTING_USER:
        return 'verifyOtp';
      case AuthFormTypes.CHANGE_PASSWORD:
        return 'changePassword';
      case AuthFormTypes.VERIFY_DETAILS:
        return 'verifyDetails';
      default:
        return 'signUp';
    }
  }

  getTranslateError(type): Promise<string> {
    let error = 'auth.error.unknown';
    if (type === AuthErrors.PERMISSIONS) {
      error = 'auth.error.permissions';
    }
    return this.translate.get(error).toPromise();
  }

  fp() {
    this.resetForms();
    this.authFlow = this.signUpClient.SELF;
    return this.isModal
      ? this.changeForm(AuthFormTypes.FORGOT_PASSWORD)
      : this.router.navigate(['/auth/forgot-password']);
  }

  signIn() {
    this.resetForms();
    this.authFlow = this.signUpClient.SELF;
    if (this.userType !== AUTH_USER_TYPE.CUSTOMER) {
      this.changeUserType();
    }
    return this.isModal
      ? this.changeForm(AuthFormTypes.LOGIN)
      : this.router.navigate(['/auth/sign-in']);
  }

  signUp() {
    this.resetForms();
    this.authFlow = this.signUpClient.SELF;
    return this.isModal
      ? this.changeForm(AuthFormTypes.SIGN_UP_STAGE1)
      : this.router.navigate(['/auth/sign-up']);
  }

  resetForms() {
    this.loginForm.reset({
      username: '',
      password: '',
      grant_type: 'password',
      user_type: AUTH_USER_TYPE.CUSTOMER,
      login_type: AUTH_SIGN_UP_CLIENT.SELF,
    });
    const title = this.getTitle();
    const country = this.getCountry();
    const gender = this.getGender();
    this.signUpForm.reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      mobile: '',
      timeZone: momentTz.tz.guess(),
      countryId: country ? country.id : '',
      genderId: gender ? gender.id : '',
      titleId: title ? title.id : '',
      confirmPassword: '',
      signUpBy: this.authFlow,
      userType: this.userType,
      countryIndex: 0,
      profileImage: '',
    });
    this.fpForm.reset();
  }

  showControlError(control) {
    return (this.formControl[control].dirty || this.formControl[control].touched) && this.formControl[control].errors;
  }

  showUpdatedControlError(control) {
    return (this.formControl[control].dirty && this.formControl[control].touched) && this.formControl[control].errors;
  }

  getAsyncMessage(control) {
    const c = this.formControl[control];
    if (c.errors.apiError) {
      return 'auth.error.unknown';
    }
    if (c.errors.userExistDiffType) {
      return 'auth.userExistDiffType';
    }
    return c.errors.userExist ? 'auth.userExist' : `form.${control}.error`;
  }

  scrollToForm() {
    if (window.innerWidth > 1199) {
      $(this.formBlock.nativeElement).animate({
        scrollTop: this.formBlock.nativeElement.offsetTop
      });
    } else {
      if (this.isModal) {
        this.scrollTop.emit(true);
      } else {
        window.scroll(0, 0);
      }
    }
  }

  socialLogin(signUpBy) {
    if (!this.loading$.value) {
      this.formError$.next('');
      this.loading$.next(true);
      (signUpBy === AUTH_SIGN_UP_CLIENT.FB ? this.loginWithFacebook() : this.loginWithGoogle()).then(info => {
        this.authFlow = signUpBy;
        return this.validateIdentifierFromServer(info.email, true, true)
          .toPromise()
          .then(({error, activated}) => {
            const title = this.getTitle();
            const country = this.getCountry();
            const gender = this.getGender();
            this.socialForm = {
              password: '',
              confirmPassword: '',
              accessToken: info.accessToken,
              email: info.email,
              firstName: info.firstName,
              lastName: info.lastName,
              profileImage: info.profileImage,
              social: info.social,
              signUpBy,
              userType: this.userType,
              timeZone: momentTz.tz.guess(),
              mobile: '',
              countryId: country ? country.id : '',
              genderId: gender ? gender.id : '',
              titleId: title ? title.id : '',
              countryIndex: 0,
            };
            if (error) {
              const e = error.userExistDiffType ? 'auth.userExistDiffType' : 'auth.error.unknown';
              if (error.userExist) {
                if (activated !== undefined && !activated) {
                  return;
                }
                const formData = new FormData();
                formData.append('password', info.accessToken);
                formData.append('username', info.email);
                formData.append('grant_type', 'password');
                formData.append('user_type', this.userType);
                formData.append('login_type', signUpBy);
                return this.service.signIn(formData)
                  .toPromise()
                  .then(data => {
                    if (this.isModal) {
                      this.closeModal.emit(data);
                    } else {
                      this.service.getUserProfile().then(() => {
                        let path = '/';
                        this.user.authorities.map(type => {
                          if (type.authorityId === 1 || type.authorityId === 3) {
                              path = '/dashboard';
                          }
                        });
                        this.router.navigate([path]);
                      });
                    }
                  })
                  .catch(loginError => {
                    const errorMsg = loginError?.error && (loginError.error.error_description || loginError.error.responseMessage);
                    if (errorMsg) {
                      this.formError$.next(errorMsg);
                    }
                  });
              } else {
                return this.translate.get(e)
                  .toPromise()
                  .then(msg => this.formError$.next(msg));
              }
            } else {
              this.signUpForm.reset(this.socialForm);
              if (this.currentForm !== AuthFormTypes.SIGN_UP_STAGE1) {
                this.changeForm(AuthFormTypes.SIGN_UP_STAGE1);
              }
              return;
            }
          });
      }, err => {
        this.getTranslateError(err).then(e => this.formError$.next(e));
        this.authFlow = this.signUpClient.SELF;
      }).then(() => this.loading$.next(false));
    }
  }

  submitForm() {
    const form = this.form;
    if ((!this.loading$.value) && form.valid) {
      this.loading$.next(true);
      this.sendInfoToServer()
        .toPromise()
        .then(data => this.processApiResponse(data) as any)
        .catch(error => {
          const errorMsg = error && error.error && (error.error.error_description || error.error.responseMessage);
          if (errorMsg) {
            this.formError$.next(errorMsg);
          }
        })
        .then(() => this.loading$.next(false));
    } else {
      validateAllFormFields(form);
    }
  }

  resendOtp() {
    if (!this.resendOtpSeconds$.value) {
      this.loading$.next(true);
      return this.service.resendOtp({
        randomKey: this.verifyOtpForm.controls.randomKey.value,
        timeZone: momentTz.tz.guess()
      }).toPromise()
        .then((data: { responseMessage: string }) => {
          this.resendOtpSeconds$.next(LoginConstants.RESEND_AFTER);
          this.resendThreadId = setInterval(() => {
            const remaining = this.resendOtpSeconds$.value;
            if (remaining) {
              this.resendOtpSeconds$.next(remaining - 1);
            } else {
              clearInterval(this.resendThreadId);
              this.resendThreadId = 0;
            }
          }, 1000);
          if (data && data.responseMessage) {
            this.formError$.next(data.responseMessage);
          }
        })
        .catch(error => {
          if (error && error.error && error.error.responseMessage) {
            this.formError$.next(error.error.responseMessage);
          }
        }).then(() => this.loading$.next(false));
    }
  }

  processApiResponse(data: any) {
    switch (this.currentForm) {
      case AuthFormTypes.LOGIN:
      case AuthFormTypes.CHANGE_PASSWORD:
      case AuthFormTypes.SIGN_UP_STAGE2: {
        return this.isModal ? this.closeModal.emit(data) :
          this.service.getUserProfile().then(() => {
            let path = '/';
            this.user.authorities.map(type => {
              if (type.authorityId === 1 || type.authorityId === 3) {
                  path = '/dashboard';
              }
            });
            this.router.navigate([path]);
          });
      }
      case AuthFormTypes.SIGN_UP_STAGE1: {
        this.translate.get('auth.verify')
          .toPromise()
          .then(action => {
            const dialog = this.dialog.open(AlertModalComponent, {
              disableClose: true,
              data: {
                message: data.responseMessage,
                action,
              }
            });
            dialog.beforeClosed()
              .toPromise()
              .then(() => {
                this.verifyOtpForm.reset({
                  randomKey: data.randomKey,
                  otp: '',
                  timeZone: momentTz.tz.guess(),
                });
                this.changeForm(AuthFormTypes.SIGN_UP_STAGE2);
              });
          });
        break;
      }
      case AuthFormTypes.VALIDATE_EXISTING_USER: {
        this.loading$.next(true);
        return this.service.getUserDetails(data.randomKey)
          .toPromise()
          .then(userData => {
            const user = userData.length ? userData[0] : null;
            const countries = this.service.countries$.value;
            const countryIndex = countries && user.country?.id ? countries.findIndex(country => country.id === user.country.id) : 0;
            this.userDetailsForm.reset({
              ...(this.authFlow !== AUTH_SIGN_UP_CLIENT.SELF ? this.socialForm : {}),
              ...user,
              validatedEmail: user.email,
              countryIndex: countryIndex === -1 ? 0 : countryIndex,
            });
            this.changeForm(AuthFormTypes.VERIFY_DETAILS);
          })
          .catch(error => {
            if (error && error.error && error.error.responseMessage) {
              this.formError$.next(error.error.responseMessage);
            }
          }).then(() => this.loading$.next(false));
      }
      case AuthFormTypes.VERIFY_DETAILS: {
        this.changePasswordForm.reset({
          password: '',
          confirmPassword: '',
          randomKey: data.randomKey,
          userType: this.userType,
          signUpBy: this.authFlow,
        });
        this.changeForm(AuthFormTypes.CHANGE_PASSWORD);
        break;
      }
    }
  }

  private sendInfoToServer(): Observable<any> {
    const data = {...this.form.value};
    delete data.confirmPassword;
    delete data.countryIndex;
    if (data.profileImage !== undefined && !data.profileImage) {
      delete data.profileImage;
    }
    switch (this.currentForm) {
      case AuthFormTypes.LOGIN:
        const formData = new FormData();
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
          }
        }
        return this.service.signIn(formData);
      case AuthFormTypes.SIGN_UP_STAGE1:
        return this.service.signUpStage1(data);
      case AuthFormTypes.SIGN_UP_STAGE2:
        return this.service.signUpStage2(data);
      case AuthFormTypes.VALIDATE_EXISTING_USER:
        return this.service.verifyOtp(data);
      case AuthFormTypes.CHANGE_PASSWORD:
        return this.service.updatePassword(data);
      case AuthFormTypes.VERIFY_DETAILS:
        const id = data.id;
        delete data.validatedEmail;
        delete data.id;
        return this.service.updateUserDetails(data, id);
      default:
        throw new Error();
    }
  }

  validateUserEmail(AC: AbstractControl) {
    const validatedEmail = AC.get('validatedEmail');
    const email = AC.get('email');
    if (validatedEmail) {
      if (email.value === validatedEmail.value) {
        return Promise.resolve(null);
      }
    }
    return this.validateIdentifier(email);
  }

  validateIdentifier(ctrl: AbstractControl) {
    return new Promise(resolve => {
      if (ctrl.value === '' || ctrl.value.length === 0 || ctrl.errors) {
        return resolve(null);
      }
      this.validateIdentifierFromServer(ctrl.value, this.currentForm !== AuthFormTypes.VERIFY_DETAILS)
        .toPromise()
        .then(({error}) => {
          if (error) {
            ctrl.markAsTouched();
          }
          resolve(error);
          this.cd.markForCheck();
        });
    });
  }

  validateIdentifierFromServer(identifier, validate = true, social = false) {
    return this.service.checkIdentifier({
      identifier,
      userType: this.userType
    }).pipe(
      switchMap((data: any): any => {
        const {activated, apiError, randomKey} = data || {};
        if (apiError) {
          return of({error: data});
        }
        let userExistError = null;
        if (!data || (activated !== undefined && activated)) {
          userExistError = {error: {userExist: true}, activated};
        }
        if (activated !== undefined && !activated && (!randomKey || !validate)) {
          userExistError = {error: {userExist: true}};
        }
        if (userExistError) {
          if (social) {
            return of(userExistError);
          }
          return Promise.all([
            this.translate.get('auth.userExistFP').toPromise(),
            this.translate.get('common.confirm').toPromise(),
            this.translate.get('common.cancel').toPromise(),
          ]).then(([message, yes, no]) => {
            const dialog = this.dialog.open(ConfirmModalComponent, {
              disableClose: true,
              data: {
                message,
                yes,
                no,
              } as ConfirmModalData,
            });
            return dialog.beforeClosed()
              .toPromise()
              .then(result => {
                if (result) {
                  this.changeForm(AuthFormTypes.FORGOT_PASSWORD);
                }
                return userExistError;
              });
          });
        }
        const observable = (activated !== undefined && !activated)
          ? of(data)
          : this.service.checkIdentifier({
            identifier,
          });
        return observable.pipe(
          switchMap((id: any): any => {
            if (id && id.apiError) {
              return of({error: id});
            }
            if (id && !id.randomKey) {
              return of({error: null});
            } else {
              if (!validate) {
                return of({error: {userExistDiffType: true}});
              }
              return Promise.all([
                this.translate.get('auth.' + ((activated !== undefined && !activated)
                  ? 'userExistSendOtp'
                  : 'userExist2SendOtp')
                ).toPromise(),
                this.translate.get('common.confirm').toPromise(),
                this.translate.get('common.cancel').toPromise(),
              ]).then(([message1, yes, no]) => {
                const dialog1 = this.dialog.open(ConfirmModalComponent, {
                  disableClose: true,
                  data: {
                    message: message1,
                    yes,
                    no,
                  } as ConfirmModalData,
                });
                return dialog1.beforeClosed()
                  .toPromise()
                  .then(result => {
                    if (result) {
                      return this.service.sendOtp({
                        randomKey: id.randomKey,
                        timeZone: momentTz.tz.guess(),
                      }).pipe(catchError(() => of({apiError: true})))
                        .toPromise()
                        .then((info: any) => {
                          if (!info.apiError) {
                            this.translate.get('auth.userExistDiffType')
                              .toPromise()
                              .then(message => this.translate.get('auth.verify')
                                .toPromise()
                                .then(action => {
                                  const dialog = this.dialog.open(AlertModalComponent, {
                                    disableClose: true,
                                    data: {
                                      message: info.responseMessage || message,
                                      action,
                                    }
                                  });
                                  dialog.beforeClosed()
                                    .toPromise()
                                    .then(() => {
                                      this.verifyOtpForm.reset({
                                        randomKey: info.randomKey,
                                        otp: '',
                                        timeZone: momentTz.tz.guess(),
                                      });
                                      this.changeForm(AuthFormTypes.VALIDATE_EXISTING_USER);
                                    });
                                })
                              );
                            const error = id && activated !== undefined && !activated ? 'userExist' : 'userExistDiffType';
                            return {error: {[error]: true}, activated};
                          }
                          return info;
                        });
                    }
                    const error1 = id && activated !== undefined && !activated ? 'userExist' : 'userExistDiffType';
                    return {error: {[error1]: true}, activated};
                  });
              });
            }
          }),
        );
      }),
    );
  }

  getFormattedTimer(seconds) {
    return momentTz('1900-01-01 00:00:00').add(seconds, 'seconds').format('mm[m]:ss[s]');
  }

  getTitle(index = 0) {
    const titles = this.service.titles$.value;
    return titles && titles.length ? titles[index] : null;
  }

  getCountry(index = 0) {
    const countries = this.service.countries$.value;
    return countries && countries.length ? countries[index] : null;
  }

  getGender(index = 0) {
    const genders = this.service.genders$.value;
    return genders && genders.length ? genders[index] : null;
  }

  changeUserType() {
    if (this.enableUserType) {
      const type = this.userType === AUTH_USER_TYPE.CUSTOMER ? AUTH_USER_TYPE.PARTNER : AUTH_USER_TYPE.CUSTOMER;
      this.userType = type;
      this.form.patchValue({
        user_type: type,
        userType: type,
      });
    }
  }
}

import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {HeaderModule} from '../header/header.module';
import {RouterModule} from '@angular/router';
import {AuthFormModule} from './auth-form/auth-form.module';
import {HomeFooterModule} from '../home/components/home-footer.module';
import {AuthFormTypes} from './auth-form/auth.constants';
import {AuthFormComponent} from './auth-form/auth-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      redirectTo: 'sign-in',
    }, {
      path: '',
      children: [{
        path: 'sign-in',
        data: {
          formType: AuthFormTypes.LOGIN,
        },
        component: AuthFormComponent,
      }, {
        path: 'sign-up',
        data: {
          formType: AuthFormTypes.SIGN_UP_STAGE1,
        },
        component: AuthFormComponent,
        // }, {
        //   path: 'forgot-password',
        //   data: {
        //     formType: AuthFormTypes.FORGOT_PASSWORD,
        //   },
        //   component: AuthFormComponent,
      }, {
        path: 'admin',
        data: {
          formType: AuthFormTypes.ADMIN,
        },
        component: AuthFormComponent,
      },
       {
        path: '**',
        redirectTo: 'sign-in'
      }],
      component: AuthComponent,
    }]),
    HeaderModule,
    AuthFormModule,
    HomeFooterModule,
  ],
  declarations: [
    AuthComponent,
  ],
})
export class AuthModule {
}

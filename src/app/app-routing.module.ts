import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/shared/components/error-page/error-page.component';
import { GuestGuard } from './shared/guards/guest.guard';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'breed-identification',
    loadChildren: () => import('./breed-identification/breed-identification.module').then(m => m.BreedIdentificationModule),
  },
  {
    path: 'profile',
    canLoad: [AuthGuard],
    loadChildren: () => import('./coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'life-with-pets',
    loadChildren: () => import('./coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'breed-selector',
    loadChildren: () => import('./coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'compare-breeds',
    loadChildren: () => import('./coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canLoad: [GuestGuard],
  },
  {
    path: 'ecard',
    loadChildren: () => import('./modules/feature/e-card/e-card.module').then(m => m.ECardModule)
  },
  {
    path: 'oldcard',
    loadChildren: () => import('./modules/feature/old-card/old-card.module').then(m => m.OldCardModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/feature/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./modules/feature/appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./modules/feature/customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/feature/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule)
  },
  { path: 'ecard-config', loadChildren: () => import('./modules/feature/ecard-details/ecard-details.module').then(m => m.EcardDetailsModule) },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  },

  {
    path: 'find-and-book',
    loadChildren: () => import('./modules/feature/find-and-book/find-and-book.module').then(m => m.FindAndBookModule),
  },
  {
    path: '404',
    component: ErrorPageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

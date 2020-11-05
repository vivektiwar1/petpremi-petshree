import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { PartnerComponent } from './partner/partner.component';
import { TimingComponent } from './timing/timing.component';
import { PayoutComponent } from './payout/payout.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'customer-profile', component: CustomerProfileComponent },
      { path: 'partner', component: PartnerComponent },
      { path: 'timings', component: TimingComponent },
      { path: 'payout', component: PayoutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

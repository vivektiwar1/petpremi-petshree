import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/shared/components/error-page/error-page.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'appointments',
        pathMatch: 'full'
    },
    {
        path: 'ecard',
        loadChildren: () => import('./modules/feature/e-card/e-card.module').then(m => m.ECardModule)
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
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    },
    {
        path: '404',
        component: ErrorPageComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
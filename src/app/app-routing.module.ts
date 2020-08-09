import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/shared/components/error-page/error-page.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'ecard',
        pathMatch: 'full'
    },
    {
        path: 'ecard',
        loadChildren: () => import('./modules/features/e-card/e-card.module').then(m => m.ECardModule)
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    },
    {
        path: '404',
        component: ErrorPageComponent
    }
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
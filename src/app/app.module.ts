import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ecard',
    pathMatch: 'full'
  },
  {
    path: 'ecard',
    loadChildren: () => import('./modules/e-card/e-card.module').then(m => m.ECardModule)
  }

];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

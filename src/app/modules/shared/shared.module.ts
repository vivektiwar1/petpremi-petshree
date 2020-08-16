import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { HeaderComponent } from './components/header/header.component';

import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ErrorPageComponent,
    HeaderComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    SideNavComponent
  ]
})
export class SharedModule { }

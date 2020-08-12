import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    ErrorPageComponent,
    HeaderComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    SideNavComponent
  ]
})
export class SharedModule { }

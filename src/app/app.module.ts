import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/container/dashboard.component';
import { NavMenuComponent } from './dashboard/components/nav-menu/nav-menu.component';
import { HeaderComponent } from './dashboard/components/header/header.component';
import { HomeComponent } from './dashboard/components/home/home.component';
import { AboutComponent } from './dashboard/components/about/about.component';
import { GalleryComponent } from './dashboard/components/gallery/gallery.component';
import { VideosComponent } from './dashboard/components/videos/videos.component';
import { EnquiryComponent } from './dashboard/components/enquiry/enquiry.component';
import { SanitizePipe } from './pipes/sanitize.pipe';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavMenuComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    GalleryComponent,
    VideosComponent,
    EnquiryComponent,
    SanitizePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

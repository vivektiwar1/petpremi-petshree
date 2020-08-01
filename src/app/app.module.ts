import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from "@angular/youtube-player";

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
import { LightboxModule } from 'ngx-lightbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollActiveDirective } from './directives/scroll-active.directive';

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
    SanitizePipe,
    ScrollActiveDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    LightboxModule,
    NgxPaginationModule,
    YouTubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

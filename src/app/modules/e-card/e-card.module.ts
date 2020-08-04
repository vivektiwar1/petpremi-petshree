import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { ECardRoutingModule } from './e-card-routing.module';
import { ECardComponent } from './container/e-card.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { VideosComponent } from './components/videos/videos.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { SanitizePipe } from 'src/app/pipes/sanitize.pipe';
import { ScrollActiveDirective } from 'src/app/directives/scroll-active.directive';

import { NgxPaginationModule } from 'ngx-pagination';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LightboxModule } from 'ngx-lightbox';

const routes: Routes = [
  { path: ':userId', component: ECardComponent }
];

@NgModule({
  declarations: [
    ECardComponent,
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
    CommonModule,
    ECardRoutingModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxPaginationModule,
    LightboxModule,
    YouTubePlayerModule
  ]
})
export class ECardModule { }

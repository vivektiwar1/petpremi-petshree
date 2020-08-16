import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ScrollActiveDirective } from './directives/scroll-active.directive';

import { NgxPaginationModule } from 'ngx-pagination';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LightboxModule } from 'ngx-lightbox';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ECardService } from './e-card.service';
import { AuthImagePipe } from 'src/app/pipes/auth-image.pipe';

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
    ScrollActiveDirective
  ],
  imports: [
    CommonModule,
    ECardRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    PipesModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    LightboxModule,
    YouTubePlayerModule
  ],
  providers: [
    AuthImagePipe,
    ECardService
  ]
})
export class ECardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { OldCardRoutingModule } from './old-card-routing.module';
import { OldCardComponent } from './container/old-card.component';
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
import { NgxVcardModule } from "ngx-vcard";

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { OldCardService } from './old-card.service';
import { AuthImagePipe } from 'src/app/pipes/auth-image.pipe';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ResponseInterceptor} from "../../../interceptors/response.interceptor";

@NgModule({
  declarations: [
    OldCardComponent,
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
    OldCardRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    PipesModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxVcardModule,
    LightboxModule,
    YouTubePlayerModule
  ],
  providers: [
    AuthImagePipe,
    OldCardService,
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
  ]
})
export class OldCardModule { }

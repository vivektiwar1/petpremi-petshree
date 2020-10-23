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
import { AppointmentDetailsComponent } from './components/appointmentdetails/appointmentdetails.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AppointmenttimeComponent} from './components/appointmenttime/appointmenttime.component';
import { ScrollActiveDirective } from './directives/scroll-active.directive';

import { PetDetailsComponent } from './components/petdetails/petdetails.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LightboxModule } from 'ngx-lightbox';
import { NgxVcardModule } from "ngx-vcard";
import { MatProgressSpinnerModule, MatSpinner } from "@angular/material/progress-spinner";

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ECardService } from './e-card.service';
import { AuthImagePipe } from 'src/app/pipes/auth-image.pipe';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ResponseInterceptor} from "../../../interceptors/response.interceptor";
import { InputDropdownComponent } from '../../shared/components/form-controls/input-dropdown/input-dropdown.component';
import {CGetPictureComponent} from '../e-card/components/get-picture/get-picture.component';
import {CCropPictureComponent} from '../e-card/components/crop-picture/crop-picture.component';
import { ButtonComponent } from '../e-card/components/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon'



@NgModule({
  declarations: [
    ECardComponent,
    NavMenuComponent,
    HeaderComponent,
    ButtonComponent,
    HomeComponent,
    CGetPictureComponent,
    CCropPictureComponent,
    AboutComponent,
    GalleryComponent,
    VideosComponent,
    EnquiryComponent,
    AppointmentComponent,
    AppointmentDetailsComponent,
    AppointmenttimeComponent,
    ScrollActiveDirective,
    PetDetailsComponent
  ],
  imports: [
    CommonModule,
    ECardRoutingModule,
    MatSelectModule,
    TranslateModule.forChild(),
    MatProgressSpinnerModule,
    MatFormFieldModule,
    PipesModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxVcardModule,
    LightboxModule,
    YouTubePlayerModule,
    MatIconModule
  ],
  providers: [
    AuthImagePipe,
    ECardService,
    {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
  ]
})
export class ECardModule { }

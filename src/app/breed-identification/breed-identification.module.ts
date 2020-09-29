import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BreedIdentificationComponent} from './breed-identification.component';
import {HeaderModule} from '../header/header.module';
import {FooterModule} from '../footer/footer.module';
import {IdentifyBreedComponent} from './identify/identify.component';
import {ResultBreedComponent} from './result/result.component';
import {BreedService} from './breed.service';
import {BreedSlickDirective} from './directives/breed-slick.directive';
import {PercentageDirective} from './directives/percentage.directive';
import {GetPictureComponent} from './shared/get-picture/get-picture.component';
import {GoogleAutoCompleteDirective} from './directives/google-autocomplete.directive';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GoogleLocationService} from '../shared/services/google-location.service';
import {CropPictureComponent} from './shared/crop-picture/crop-picture.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AgmCoreModule} from '@agm/core';

const routes: Routes = [
  {
    path: '',
    component: BreedIdentificationComponent,
    children: [{
      path: '',
      component: ResultBreedComponent,
      pathMatch: 'full',
    }, {
      path: '**',
      redirectTo: '/breed-identification'
    }]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    HeaderModule,
    FooterModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDTJBrJ1s2Qp4guO-zR_FOCQpM2mm1Nkig',
      libraries: ['places']
    }),
  ],
  declarations: [
    BreedIdentificationComponent,
    IdentifyBreedComponent,
    ResultBreedComponent,
    BreedSlickDirective,
    PercentageDirective,
    GetPictureComponent,
    GoogleAutoCompleteDirective,
    CropPictureComponent,
  ],
  providers: [
    BreedService,
    GoogleLocationService,
  ]
})
export class BreedIdentificationModule {
}

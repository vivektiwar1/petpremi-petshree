import {NgModule} from '@angular/core';
import {HeaderComponent} from './header.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {PetsModule} from '../pets/pets.module';
import {SharedModule} from '../shared/shared.module';
import {AuthModalModule} from '../auth/auth-modal/auth-modal.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    MatSelectModule,
    PetsModule,
    SharedModule,
    AuthModalModule,
  ],
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class HeaderModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {directives} from './directives';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {HomeResolve} from './home.resolve';
import {HeaderModule} from '../header/header.module';
import {HomeFooterModule} from './components/home-footer.module';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  resolve: {jsons: HomeResolve}
}];

@NgModule({
  declarations: [
    HomeComponent,
    ...directives
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    CommonModule,
    HeaderModule,
    HomeFooterModule,
  ],
  providers: [
    HomeResolve,
  ]
})
export class HomeModule {
}

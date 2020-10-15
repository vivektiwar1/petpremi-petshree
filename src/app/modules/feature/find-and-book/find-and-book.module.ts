import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindAndBookComponent } from './find-and-book.component';
import { Routes, RouterModule } from '@angular/router';
import {HeaderModule} from '../../../../app/header/header.module'


const routes: Routes = [{
  path: '',
  component: FindAndBookComponent,
}];


@NgModule({
  declarations: [FindAndBookComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderModule

  ]
})
export class FindAndBookModule { }

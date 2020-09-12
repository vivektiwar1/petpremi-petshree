import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HeaderComponent } from './components/header/header.component';
import { InputDropdownComponent } from './components/form-controls/input-dropdown/input-dropdown.component';
import { KeyboardNavigationDirective } from './directives/keyboard-navigation.directive';
import { NgDelayedClassDirective } from './directives/ng-delayed-class.directive';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';
import { TabNavWrapperComponent } from './components/tab-nav-wrapper/tab-nav-wrapper.component';

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { InputSearchComponent } from './components/form-controls/input-search/input-search.component';
import { InputDateComponent } from './components/form-controls/input-date/input-date.component';
import { ButtonComponent } from './components/button/button.component';
import { AddClientComponent } from './modals/add-client/add-client.component';
import { AddPetComponent } from './modals/add-pet/add-pet.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ErrorPageComponent,
    HeaderComponent,
    SideNavComponent,
    TabNavComponent,
    InputDropdownComponent,
    KeyboardNavigationDirective,
    InputSearchComponent,
    InputDateComponent,
    NgDelayedClassDirective,
    TabNavWrapperComponent,
    AddClientComponent,
    AddPetComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ButtonComponent,
    HeaderComponent,
    InputDateComponent,
    InputDropdownComponent,
    InputSearchComponent,
    KeyboardNavigationDirective,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    NgDelayedClassDirective,
    SideNavComponent,
    TabNavComponent,
    TabNavWrapperComponent,
    TableComponent
  ]
})
export class SharedModule { }

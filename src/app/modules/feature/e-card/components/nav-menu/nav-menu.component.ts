import { Component, Input, OnInit } from '@angular/core';
import { NavMenu,User } from "src/app/app.constant";
import { Observable, merge } from 'rxjs';
import { ECardService } from '../../e-card.service';
import { distinctUntilChanged } from 'rxjs/operators';
import * as $ from 'jquery';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppStore } from 'src/app/app.store';
import { LangService } from 'src/app/shared/services/lang.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit{
  readonly navMenuItems = NavMenu;
  readonly navMenuUser = User;
  @Input() activeLink$: Observable<string>;
  @Input() hiddenNavItems: Array<string>;

  mergedActiveLink$: Observable<string>;

  constructor(private eCardService: ECardService,
    public store: AppStore,
    public auth: AuthService,
    private langService:LangService) {}

  ngOnInit() {
    this.mergedActiveLink$ = merge(
      this.activeLink$,
      this.eCardService.getActiveNav()
    ).pipe(
      distinctUntilChanged()
    );
  }
  toggleProfile(element: HTMLUListElement) {
    $(element).toggleClass('hide');
  }
}

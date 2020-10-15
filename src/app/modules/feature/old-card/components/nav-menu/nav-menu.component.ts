import { Component, Input, OnInit } from '@angular/core';
import { NavMenu } from "src/app/app.constant";
import { Observable, merge } from 'rxjs';
import { OldCardService } from '../../old-card.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit{
  readonly navMenuItems = NavMenu;
  @Input() activeLink$: Observable<string>;
  @Input() hiddenNavItems: Array<string>;

  mergedActiveLink$: Observable<string>;

  constructor(private oldCardService: OldCardService) {}

  ngOnInit() {
    this.mergedActiveLink$ = merge(
      this.activeLink$,
      this.oldCardService.getActiveNav()
    ).pipe(
      distinctUntilChanged()
    );
  }
}

import { Component, Input } from '@angular/core';
import { navMenu } from "src/app/app.constant";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  navMenuItems = navMenu;
  @Input() activeLink$: Observable<string>;
}

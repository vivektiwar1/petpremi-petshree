import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {LANGUAGE_SWITCHER} from '../../../../../app/shared/constants/app.constants';

@Component({
  selector: 'app-header1',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  languageSwitcher = LANGUAGE_SWITCHER;
  user: any = [];
  constructor(private service: AuthService,
              private router: Router,
              public serviceapp: AppService,
              public translate: TranslateService,


  ) {}

  ngOnInit(): void {
    this.service.userData$.subscribe(data => this.user = data);
  }

  handleChangePassword() {

  }

  handleLogout() {
    this.service.logout();
    this.router.navigate(['/']);
  }

}

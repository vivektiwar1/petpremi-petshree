import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { ProfileService } from 'src/app/modules/feature/settings/profile/profile.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LANGUAGE_SWITCHER } from '../../../../../app/shared/constants/app.constants';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header1',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  languageSwitcher = LANGUAGE_SWITCHER;
  user: any = [];
  languages:any;
  selected=this.translate.currentLang;
  clinicData: Array<any> = [];
  apiInProgress = {
    userDataLoader: false,
    enquiryLoader: false,
  };
  constructor(private service: AuthService,
    private router: Router,
    public serviceapp: AppService,
    public translate: TranslateService,
    public profileService: ProfileService,
    public headerService: HeaderService
  ) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.getClinic(data.partnerId)
  }

  ngOnInit(): void {
    this.service.userData$.subscribe(data => this.user = data);
    this.getLanguages()
  }

  handleChangePassword() {
  }

  async getClinic(partnerId) {
    try {
      this.apiInProgress.userDataLoader = true;
      let response;
      response = await this.profileService.getPartnerDetails(partnerId).toPromise();
      let data = response?.responseResult?.data?.content;
      for (let i = 0; i < data.length; i++) {
        this.clinicData = (data[i].partnerAddresses)
      }
      if (!this.clinicData) {
        this.navigateToErrorPage();
        return;
      }
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }
  async getLanguages() {
    try {
      this.apiInProgress.userDataLoader = true;
      let response :any= await this.headerService.getLanguages();
      this.languages=response?.responseResult?.data?.content;
    } catch (error) {
      this.apiInProgress.userDataLoader = false;
      console.error(error);
    }
  }

  navigateToErrorPage() {
    this.router.navigate(['/404'], {
      skipLocationChange: true
    })
  }


  handleLogout() {
    this.service.logout();
    this.router.navigate(['/']);
  }

}

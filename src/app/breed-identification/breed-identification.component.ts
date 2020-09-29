import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BreedService} from './breed.service';
import {AuthService} from '../shared/services/auth.service';
import {AuthModalConfig} from '../auth/auth-form/auth.constants';

@Component({
  selector: 'app-breed-identification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breed-identification.component.scss'],
  templateUrl: './breed-identification.component.html',
})
export class BreedIdentificationComponent implements OnInit {
  constructor(private service: BreedService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.checkAndLogin(new AuthModalConfig({disableClose: true}))
      .then(() => true);
  }

  backPressed() {
    this.service.backPressed$.next();
  }
}

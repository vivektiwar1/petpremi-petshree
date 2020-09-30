import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  constructor(private commonService:CommonService) {
    commonService.hideDashboardNavs();
  }
}

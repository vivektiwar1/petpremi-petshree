import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements AfterViewInit {

  ngAfterViewInit(){
    window.scroll(0, 0);
  }

}

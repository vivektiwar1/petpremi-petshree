import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements AfterViewInit {

  ngAfterViewInit(){
    window.scroll(0, 0);
  }

}

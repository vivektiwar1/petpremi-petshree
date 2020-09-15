import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // this.iconRegistry.addSvgIcon(
    //   'custom_language',
    //   this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/mat-language.svg'));
  }

  ngOnInit(): void {
  }

}

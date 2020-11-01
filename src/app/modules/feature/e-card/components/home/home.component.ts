import {Component, Input} from '@angular/core';
import {VCard} from "ngx-vcard";
import {ECardService} from "../../e-card.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @Input() userDetails: any;
  vCard: VCard;

  ngOnInit() {
    this.createvCard();
    
  }

  constructor(private eCardService: ECardService) {

  }

  showDiv() {
    this.eCardService.showDiv();
  }

  createvCard() {
    this.vCard = {
      email: [this.userDetails.email],
      name: {
        firstNames: this.userDetails.name
      },
      // @ts-ignore
      telephone: [
        ...(this.userDetails.phone ? [{
          value: this.userDetails.phone as string, param: {
            type: 'mobile'
          }
        }] : []),
        ...(this.userDetails.whatsAppPhone ? [{
          value: this.userDetails.whatsAppPhone as string, param: {
            type: 'whatsApp'
          }
        }] : [])
      ],
      organization: {
        value: this.userDetails.businessName,
        param: {
          type: 'work'
        }
      },
      version: '2.1'
    }
  }


}

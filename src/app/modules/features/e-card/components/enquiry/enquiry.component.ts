import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent {
  
  @Input() countries: Array<any>;
  @Input() enquiryForm: FormGroup;
  @Input() enquiryLoader: boolean;
  @Input() titles: Array<any>;
  @Output() onSubmitEvent: EventEmitter<void> = new EventEmitter<void>();

  onSubmit() {
    this.onSubmitEvent.emit();
  }

  getEnquiryFormField(field) {
    return this.enquiryForm.get(field);
  }
}

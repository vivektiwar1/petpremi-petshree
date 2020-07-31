import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent {

  @Input() enquiryForm: FormGroup;
  @Input() enquiryLoader: boolean;
  @Output() onSubmitEvent: EventEmitter<void> = new EventEmitter<void>();

  onSubmit() {
    this.onSubmitEvent.emit();
  }
}

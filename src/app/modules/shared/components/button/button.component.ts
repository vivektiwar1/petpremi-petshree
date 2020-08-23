import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() loading: boolean;
  @Input() buttonText: string;
  @Input() disabled: boolean;
  @Input() className: string;

  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  handleClick() {
    this.buttonClicked.emit();
  }

}

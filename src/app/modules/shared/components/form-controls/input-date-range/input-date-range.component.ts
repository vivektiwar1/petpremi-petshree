import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss']
})
export class InputDateRangeComponent implements OnInit {

  @Input() parentFormGroup: FormGroup;
  @Input() name: string;
  @Input() startKey: string;
  @Input() endKey: string;
  @Input() label: string;
  @Input() minDate = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}

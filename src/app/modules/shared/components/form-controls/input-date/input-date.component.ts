import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss']
})
export class InputDateComponent implements OnInit {

  @Input() parentFormGroup: FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() minDate = new Date();


  constructor() { }

  ngOnInit(): void {
  }

}

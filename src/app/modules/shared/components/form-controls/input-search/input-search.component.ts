import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent implements OnInit {
  searchItems: Array<string>;
  apiInProgress: boolean;
  onDestroy$: Subject<void> = new Subject();

  @Input() parentFormGroup: FormGroup;
  @Input() name: string; // formControlName
  @Input() label: string;
  @Input() placeholder: string;
  @Input() set searchItems$(searchItems$: Observable<Array<string>>) {
    if (searchItems$) {
      searchItems$.pipe(
        takeUntil(this.onDestroy$)
      ).subscribe(items => {
        this.searchItems = items;
        this.apiInProgress = false;
      })
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.parentFormGroup.get(this.name).valueChanges.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((value) => {
      this.apiInProgress = value && value.length ? true : false;
    });
  }

  activeElement(event) {
    this.parentFormGroup.patchValue({
      [this.name]: this.searchItems[event]
    }, {
      emitEvent: false
    });
    this.searchItems = [];
  }

  ngOnDestoy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

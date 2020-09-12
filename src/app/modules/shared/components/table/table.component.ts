import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DisplayedColumn } from 'src/app/models/displayedColumn.interface';

interface Action {
  action: string;
  data: any
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input('displayedColumn') displayedColumn: Array<DisplayedColumn> = [];

  @Input('actionItems') actionItems: Array<string> = [];

  @Input('dataSource') dataSource: Array<any> = [];
  @Input('loading') loading: boolean;

  @Output() actionHandler: EventEmitter<Action> = new EventEmitter<Action>();

  constructor() { }

  ngOnInit(): void {
  }

  onActionClick(action, data) {
    this.actionHandler.emit({
      action,
      data
    });
  }

}

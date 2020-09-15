import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subscription } from 'rxjs';
import { pageSizeOptions } from 'src/app/app.constant';
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

  dataSource: any;
  subsRef: Subscription;
  readonly pageSizeOptions: Array<number> = pageSizeOptions;

  @Input('displayedColumn') displayedColumn: Array<DisplayedColumn> = [];
  @Input('actionItems') actionItems: Array<string> = [];
  @Input('dataSource') set tableData(tableData) {
    this.subsRef && this.subsRef.unsubscribe();
    if (tableData) {
      this.dataSource = tableData;
      this.cdRef.detectChanges();
      this.paginator.pageIndex = this.dataSource.number;
      this.paginator.pageSize = this.dataSource.size;

      this.subsRef = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      
      const tableEvents = merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
        this.onActionClick('tableAction', {
          data: {
            sort: {
              ...(this.sort.direction ? { [this.sort.direction.toUpperCase()]: [this.sort.active] } : {})
            },
            pageSize: this.paginator.pageSize,
            pageNumber: this.paginator.pageIndex
          }
        });
      });

      this.subsRef.add(tableEvents);
    }
  }
  @Input('loading') loading: boolean;

  @Output() private actionHandler: EventEmitter<Action> = new EventEmitter<Action>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onActionClick(action, data, navigateTo?) {
    this.actionHandler.emit({
      action,
      ...(navigateTo ? { data: { ...data, navigateTo } } : data)
    });
  }

}

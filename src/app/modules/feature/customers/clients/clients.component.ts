import { Component, OnInit } from '@angular/core';
import { AddClientComponent } from 'src/app/modules/shared/modals/add-client/add-client.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayedColumn } from 'src/app/models/displayedColumn.interface';
import { ClientsService } from './clients.service';
import { pageLimit as TableDataLimit } from 'src/app/app.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  displayedColumn: Array<DisplayedColumn> = [
    { name: 'Clients', fieldName: 'clients', type: 'figureCaption' },
    { name: 'Pets', fieldName: 'pets', type: 'figureCaption' },
    { name: 'Contact Number', fieldName: 'mobile', type: 'text' },
    { name: 'Email', fieldName: 'email', type: 'text' },
    { name: 'Last Visit', fieldName: 'lastVisit', type: 'dateTime' },
    { name: '', fieldName: '', type: 'action' }
  ];

  actionItems = ['edit', 'delete'];
  dataSource: any;
  apiInProgress: boolean;
  tableDataLimit: number = TableDataLimit;
  searchForm: FormGroup;
  countries: any;

  constructor(
    private clientService: ClientsService,
    private matDialog: MatDialog,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    this.getClientsList();
  }

  async createSearchForm() {

    // await this.commonService.getCountryList();

    this.searchForm = this.formBuilder.group({
      clientName: [''],
      petName: [''],
      countryId: [''],
      mobile: [],
      email: [''],
      lastVisit: []
    });
    console.log(this.searchForm);
  }

  async getClientsList(listOptions?) {
    try {
      this.apiInProgress = true;
      const response = await this.clientService.getClients(
        listOptions?.pageSize ?? this.tableDataLimit, listOptions?.pageNumber, listOptions?.sort
      ).toPromise() as any;
      this.apiInProgress = false;
      if (!response.isError) {
        this.dataSource = response?.responseResult?.data;
      } else {
        console.error(new Error(response?.responseError?.message))
      }
    } catch (error) {
      console.log(error);
      this.apiInProgress = false;
    }
  }

  openAddClientModal() {
    const dialog = this.matDialog.open(AddClientComponent, {
      disableClose: true,
      width: "40vw"
    })
  }

  handleAction({ action, data }) {
    switch (action) {
      case 'tableAction':
        this.getClientsList(data);
        break;
    }
  }

}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AddClientComponent} from 'src/app/modules/shared/modals/add-client/add-client.component';
import {MatDialog} from '@angular/material/dialog';
import {DisplayedColumn} from 'src/app/models/displayedColumn.interface';
import {ClientsService} from './clients.service';
import {pageLimit as TableDataLimit} from 'src/app/app.constant';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from 'src/app/services/common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  displayedColumn: Array<DisplayedColumn> = [
    {name: 'Clients', fieldName: 'clients', type: 'figureCaption'},
    {name: 'Pets', fieldName: 'pets', type: 'figureCaption'},
    {name: 'Contact Number', fieldName: 'mobile', type: 'text'},
    {name: 'Email', fieldName: 'email', type: 'text'},
    {name: 'Last Visit', fieldName: 'lastVisit', type: 'dateTime'},
    {name: '', fieldName: '', type: 'action'}
  ];

  actionItems = ['edit', 'delete'];
  dataSource: any;
  apiInProgress = {
    data: false,
    search: false
  };
  tableDataLimit: number = TableDataLimit;
  searchForm: FormGroup;
  countries: any;
  hideSearchBox: boolean = true;

  @ViewChild('clientSearchRef') clientSearchRef: ElementRef<HTMLElement>;

  constructor(
    private clientService: ClientsService,
    private matDialog: MatDialog,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createSearchForm();
    this.getClientsList();
  }

  async createSearchForm() {

    this.countries = await this.commonService.getCountryList() as Array<any>;

    this.searchForm = this.formBuilder.group({
      clientName: [null],
      petName: [null],
      countryId: [],
      mobile: [],
      email: [null],
      lastVisit: this.formBuilder.group({
        startDate: [null],
        endDate: [null]
      })
    });
  }

  async getClientsList(listOptions?) {
    try {
      this.apiInProgress.data = true;
      const response = await this.clientService.getClients(
        listOptions?.pageSize ?? this.tableDataLimit, listOptions?.pageNumber, listOptions?.sort, listOptions?.searchHash
      ).toPromise() as any;
      this.apiInProgress.data = false;
      if (!response.isError) {
        this.dataSource = response?.responseResult?.data;
      } else {
        console.error(new Error(response?.responseError?.message))
      }
    } catch (error) {
      console.log(error);
      this.apiInProgress.data = false;
    }
  }

  openAddClientModal() {
    const dialog = this.matDialog.open(AddClientComponent, {
      disableClose: true,
      width: "40vw"
    })
  }

  handleAction({action, data}) {
    console.log(action);
    switch (action) {
      case 'tableAction':
        this.getClientsList(data);
        break;
      case 'navigate':
        this.openDetails(data);
        break;
    }
  }

  async onSearch() {
    if (this.searchForm.valid) {

      const searchHash = {
        ...(this.searchForm.value.clientName ? {fullName_LIKE: this.searchForm.value.clientName} : {}),
        ...(this.searchForm.value.petName ? {pets_FK: this.searchForm.value.petName} : {}),
        ...(this.searchForm.value.email ? {email_LIKE: this.searchForm.value.email} : {}),
        ...(this.searchForm.value.countryId ? {country_FK: this.searchForm.value.countryId} : {}),
        ...(this.searchForm.value.mobile ? {mobile_LIKE: this.searchForm.value.mobile} : {}),
        ...(this.searchForm.value.lastVisit.startDate && this.searchForm.value.lastVisit.endDate ?
          {
            lastLogin_BETWEEN: [
              this.searchForm.value.lastVisit.startDate,
              this.searchForm.value.lastVisit.endDate
            ]
          } : {}),
      };

      if (Object.keys(searchHash).length) {
        this.apiInProgress.search = true;
        await this.getClientsList({searchHash});
        this.apiInProgress.search = false;
      }
    }
  }

  async resetSearch() {
    if (this.searchForm.touched && this.searchForm.dirty) {
      this.searchForm.reset();
      await this.getClientsList();
      this.clientSearchRef.nativeElement.click();
    }
  }

  openDetails(info) {
    this.router.navigate(['/customers', info.navigateTo, info.id]);
  }

}

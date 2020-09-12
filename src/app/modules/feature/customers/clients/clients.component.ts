import { Component, OnInit } from '@angular/core';
import { AddClientComponent } from 'src/app/modules/shared/modals/add-client/add-client.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayedColumn } from 'src/app/models/displayedColumn.interface';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  displayedColumn: Array<DisplayedColumn> = [
    { name: 'Clients', fieldName: 'clients', type: 'figureCaption' },
    { name: 'Pets', fieldName: 'pets', type: 'figureCaption' },
    { name: 'Contact Number', fieldName: 'phone', type: 'text' },
    { name: 'Email', fieldName: 'email', type: 'text' },
    { name: 'Last Visit', fieldName: 'lastVisit', type: 'dateTime' },
    { name: '', fieldName: '', type: 'action' }
  ];

  actionItems = ['edit', 'delete'];

  dataSource = Array(10).fill({
    clients: [
      {name: 'Prateek Srivastav', image: 'https://scontent-bom1-2.xx.fbcdn.net/v/t1.0-0/c8.0.585.585a/s526x395/1972374_606224692800805_339481721_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=RK9cfAHgrKcAX_LeN2H&_nc_ht=scontent-bom1-2.xx&oh=9924bca01cfd4f07fe033bbc5b51d237&oe=5F67B1D4'}
    ],
    pets: [
      {name: 'Lisa', image: 'https://scontent-bom1-2.xx.fbcdn.net/v/t1.0-0/c8.0.585.585a/s526x395/1972374_606224692800805_339481721_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=RK9cfAHgrKcAX_LeN2H&_nc_ht=scontent-bom1-2.xx&oh=9924bca01cfd4f07fe033bbc5b51d237&oe=5F67B1D4'},
      {name: 'Lizzy', image: 'https://scontent-bom1-2.xx.fbcdn.net/v/t1.0-0/c8.0.585.585a/s526x395/1972374_606224692800805_339481721_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=RK9cfAHgrKcAX_LeN2H&_nc_ht=scontent-bom1-2.xx&oh=9924bca01cfd4f07fe033bbc5b51d237&oe=5F67B1D4'}
    ],
    phone: '+91-9891780719',
    email: 'prateek@gmail.com',
    lastVisit: new Date(),
  });

  constructor( 
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openAddClientModal() {
    const dialog = this.matDialog.open(AddClientComponent, {
      disableClose: true,
      width: "40vw"
    })
  }

  handleAction(actionDetails) {
    console.log(actionDetails);
  }

}

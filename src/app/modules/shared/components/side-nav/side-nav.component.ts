import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactUsComponent } from 'src/app/contact-us/contact-us.component';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Output() onMouseOver: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog:MatDialog,
  ) { }
  openContact() {
    const dialogRef = this.dialog.open(ContactUsComponent, {
      closeOnNavigation: true,
      panelClass: 'auth-panel',
    });
  }

  ngOnInit(): void {
  }

  handleMouseOver() {
    this.onMouseOver.emit()
  }

}

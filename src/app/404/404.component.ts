import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-404',
  templateUrl: `./404.component.html`,
  styleUrls: ['./404.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

}

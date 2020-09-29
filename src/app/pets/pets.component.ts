import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {AppStore} from '../app.store';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-pets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export class PetsComponent {
  @Input() emit = true;
  @Output() petChanged = new EventEmitter<any>();
  api = environment.api;

  constructor(public store: AppStore) {
  }

  changePet(pet) {
    if (this.emit) {
      return this.petChanged.emit(pet);
    }
    this.store.setPet(pet);
  }
}

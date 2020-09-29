import {Injectable} from '@angular/core';
import {Router, CanLoad} from '@angular/router';
import {AppStore} from '../../app.store';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private store: AppStore, private router: Router) {
  }

  canLoad(): boolean {
    if (!this.store.state.isAuthenticated) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}

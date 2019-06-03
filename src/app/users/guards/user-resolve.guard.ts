import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import * as RouterActions from './../../core/+store/router/router.actions';

// NgRx
import { Store, select } from '@ngrx/store';
import { AppState, getSelectedUserByUrl } from './../../core/+store';
import * as UsersActions from './../../core/+store/users/users.actions';

// rxjs
import { Observable, of } from 'rxjs';
import { delay, map, catchError, finalize, take, tap } from 'rxjs/operators';

import { UserModel } from './../models/user.model';
import { SpinnerService } from './../../core';
import { UsersServicesModule } from '../users-services.module';

@Injectable({
  providedIn: UsersServicesModule
})
export class UserResolveGuard implements Resolve<UserModel> {
  constructor(
    private store: Store<AppState>,
    private spinner: SpinnerService
  ) {}

  resolve(): Observable<UserModel> | null {
    console.log('UserResolve Guard is called');
    this.spinner.show();

    return this.store.pipe(
      select(getSelectedUserByUrl),
      tap(user => this.store.dispatch(new UsersActions.SetOriginalUser(user))),
      delay(2000),
      map(user => {
        if (user) {
          return user;
        } else {
          this.store.dispatch(new RouterActions.Go({
            path: ['/users']
          }));
          return null;
        }
      }),
      take(1),
      catchError(() => {
        this.store.dispatch(new RouterActions.Go({
          path: ['/users']
        }));
        // catchError MUST return observable
        return of(null);
      }),
      finalize(() => this.spinner.hide())
    );
  }
}

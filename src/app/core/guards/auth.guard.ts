import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  NavigationExtras,
  Route,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';
import { CoreModule } from '../core.module';
import { AuthService } from '../services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from './../+store';
import * as RouterActions from './../+store/router/router.actions';

@Injectable({
  providedIn: CoreModule
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private store: Store<AppState>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('CanActivate Guard is called');
    const { url } = state;
    return this.checkLogin(url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('CanActivateChild Guard is called');
    const { url } = state;
    return this.checkLogin(url);
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log('CanLoad Guard is activated');
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    const sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    const navigationExtras: NavigationExtras = {
      queryParams: { sessionId },
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.store.dispatch(new RouterActions.Go({
      path: ['/login'],
      extras: navigationExtras
    }));

    return false;
  }
}

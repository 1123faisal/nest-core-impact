import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanMatch,
  Route,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanMatch {
  constructor(public authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      // User is authenticated
      return true;
    } else {
      // User is not authenticated, redirect to login
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  canMatch(
    route: Route,
    segments: Array<UrlSegment>
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isAuthenticated().pipe(
      map((rs) => {
        if (!rs) {
          return this.router.createUrlTree(['/auth/login']);
        }
        return rs;
      })
    );
  }

  isAuthenticated() {
    return this.authService.getUser().pipe(
      take(1),
      map((user) => !!user?.token)
    );
  }
}

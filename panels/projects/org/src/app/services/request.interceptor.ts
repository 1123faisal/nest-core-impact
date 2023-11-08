import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, finalize, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UiService } from './ui.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService, private uiService: UiService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.uiService.loading.next(true);
    return this.authService.getUser().pipe(
      take(1),
      exhaustMap((authData) => {
        if (authData?.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authData?.token}`,
            },
          });
        }

        return next.handle(request).pipe(
          catchError((error) => {
            // if (error.status === 401) {
            //   this.authService.logout();
            // }
            return throwError(() => error);
          }),
          finalize(() => {
            this.uiService.loading.next(false);
          })
        );
      })
    );
  }
}

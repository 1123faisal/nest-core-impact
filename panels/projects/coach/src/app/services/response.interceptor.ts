import { Injectable, NgZone } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Handle successful responses here
            // You can access the response body using event.body
            // Example: validate the response body
            if (event.body && event.body.success !== true) {
              // Perform your validation logic or throw an error
            }
          }
        },
        error: (error: any) => {
          if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors here
            // Example: log the error or perform custom error handling

            const config = new MatSnackBarConfig();
            config.panelClass = ['background-red'];
            config.verticalPosition = 'top';
            config.horizontalPosition = 'end';
            this.snackBar.dismiss();
            this.zone.run(() => {
              this.snackBar.open(
                error?.error?.message || error.message,
                undefined,
                {
                  duration: 1000 * 60 * 60,
                }
              );
            });
          }
        },
      })
    );
  }
}

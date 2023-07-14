import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loading = new BehaviorSubject<boolean>(false);
  constructor(private snackBar: MatSnackBar) {}

  openSnackbar(message?: string) {
    this.snackBar.dismiss();
    this.snackBar.open(message || 'An Error Occurred', undefined, {
      duration: 1000 * 2,
    });
  }
}

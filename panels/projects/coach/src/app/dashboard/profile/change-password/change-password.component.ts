import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dashboard.service';
import { Location } from '@angular/common';
import { REGX } from 'regex';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.pattern(REGX.Password)],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.dismiss();
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.form.value;
    this.dbService
      .changePassword(oldPassword, newPassword, confirmPassword)
      .subscribe((rs) => {
        this.uiService.openSnackbar('Password Changed Successfully.');
        this.location.back();
      });
  }
}

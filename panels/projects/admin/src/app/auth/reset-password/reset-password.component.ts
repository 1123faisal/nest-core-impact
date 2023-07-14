import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { REGX } from 'regex';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  passShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public uiService: UiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((rs) => {
      this.formInit(rs['email'], rs['otp']);
    });
  }

  formInit(email: string, otp: string) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(REGX.Password)]],
      email: [email, [Validators.required]],
      otp: [otp, [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, email, otp, confirmPassword } = this.form.value;

    this.authService
      .resetPassword(password, email, otp, confirmPassword)
      .subscribe({
        next: (value) => {
          this.uiService.openSnackbar('Password Reset Successfully');
          this.router.navigate(['/auth/login'], { replaceUrl: true });
        },
        error(err) {
          console.log(err);
        },
      });
  }
}
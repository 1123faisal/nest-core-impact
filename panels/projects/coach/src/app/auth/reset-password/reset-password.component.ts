import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { REGX } from 'regex';
import { InputErrorComponent } from '../../components/input-error/input-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  passShow: boolean = false;
  passShow1: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public uiService: UiService,
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
      email: [email, [Validators.required, Validators.pattern(REGX.Email)]],
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

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from '../../components/input-error/input-error.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    RouterModule,
  ],
})
export class ForgotComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    public uiService: UiService
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.value;

    this.authService.forgotPassword(email).subscribe({
      next: (value) => {
        this.uiService.openSnackbar(
          'OTP sent successfully to your registered Email Id.'
        );
        this.router.navigate(['/auth/verify-otp'], { queryParams: { email } });
      },
      error(err) {
        console.log(err);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
  form!: FormGroup;
  email?: string;

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
      this.email = rs['email'];
      if (!this.email) {
        throw new Error('email is required');
      }
      this.formInit(rs['email']);
    });
  }

  formInit(email: string) {
    this.form = this.fb.group({
      otp: ['', [Validators.required]],
      email: [email, [Validators.required]],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, otp } = this.form.value;

    this.authService.verifyOtp(email, otp).subscribe({
      next: (value) => {
        console.log(value);
        this.router.navigate(['/auth/reset-password'], {
          queryParams: { email, otp },
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }
}

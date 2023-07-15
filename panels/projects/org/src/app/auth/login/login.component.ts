import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from '../../components/input-error/input-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  passShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    public uiService: UiService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService
      .signIn(this.form.value.email, this.form.value.password)
      .subscribe({
        next: (value) => {
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: (err) => {
          this.uiService.openSnackbar('Invalid Credentials');
        },
      });
  }
}

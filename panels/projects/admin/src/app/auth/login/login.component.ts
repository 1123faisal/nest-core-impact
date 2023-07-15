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
import { REGX } from 'regex';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from '../../components/input-error/input-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, InputErrorComponent, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  passShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    public uiService: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(REGX.Email)]],
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

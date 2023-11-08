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
import { REGX } from 'regex';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from '../../components/input-error/input-error.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    RouterModule,
  ],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  passShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public uiService: UiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(REGX.Name)]],
      email: ['', [Validators.required, Validators.pattern(REGX.Email)]],
      password: ['', [Validators.required, Validators.pattern(REGX.Password)]],
      agree: [false],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.form.value.agree) {
      this.snackBar.dismiss();
      this.snackBar.open('Please agree term and conditions', undefined, {
        duration: 1000 * 2,
      });
      return;
    }

    this.authService
      .signUp(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password
      )
      .subscribe({
        next: (value) => {
          console.log('after save', value);
          this.router.navigate(['/']);
        },
        error(err) {
          console.log(err);
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { Location } from '@angular/common';
import { User } from '../../../models/user.model';
import { REGX } from 'regex';
import { AuthService } from '../../../auth/auth.service';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [InputErrorComponent, ReactiveFormsModule],
})
export class EditComponent implements OnInit {
  user?: User | null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((rs) => {
          if (!rs['info']) return null;
          return JSON.parse(rs['info']);
        })
      )
      .subscribe({
        next: (value) => {
          this.user = value;
          this.initForm();
        },
      });
  }

  initForm() {
    this.form = this.fb.group({
      name: [
        this.user?.name,
        [Validators.required, Validators.pattern(REGX.Name)],
      ],
      email: [
        { value: this.user?.email, disabled: true },
        [Validators.required, Validators.pattern(REGX.Email)],
      ],
      mobile: [
        this.user?.mobile,
        [Validators.required, Validators.pattern(REGX.Mobile)],
      ],
      avatar: [null],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.dismiss();
      return;
    }

    const { name, email, mobile, avatar } = this.form.value;
    this.dbService
      .updateProfile(name, email, mobile, avatar)
      .subscribe((rs) => {
        this.authService.updateUser(rs.email, rs.avatar, rs.mobile, rs.name);
        this.location.back();
      });
  }

  onSelectImg(e: Event) {
    const el = e.target as HTMLInputElement;

    if (!el.files?.length) {
      this.snackbar.dismiss();
      this.snackbar.open('Please select file', undefined, {
        duration: 2 * 1000,
      });
    }

    this.form.get('avatar')?.patchValue(el.files?.item(0));
  }
}

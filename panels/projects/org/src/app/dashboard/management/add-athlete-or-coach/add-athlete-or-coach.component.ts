import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { Observable } from 'rxjs';
import { Coach } from '../../../models/coach.model';
import { Athlete, Gender } from '../../../models/athlete.model';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { REGX } from 'regex';
declare var $: any;

enum FormMode {
  Athlete = 'Athlete',
  Coach = 'Coach',
}

type AthleteOrCoach = Coach | Athlete;

@Component({
  selector: 'app-add-athlete-or-coach',
  templateUrl: './add-athlete-or-coach.component.html',
  styleUrls: ['./add-athlete-or-coach.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
})
export class AddAthletesOrCoachComponent implements OnInit {
  form?: FormGroup;
  isEditMode: boolean = false;
  formMode = FormMode.Athlete;
  formModes = FormMode;
  onUpdateRecordId?: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    $(function () {
      $('input[name="daterange"]').daterangepicker(
        {
          opens: 'left',
        },
        function (start: any, end: any, label: any) {}
      );
    });

    this.route.queryParams.subscribe((qparam: any) => {
      let query: Observable<AthleteOrCoach> | undefined;
      if (qparam.type === this.formModes.Athlete) {
        this.formMode = this.formModes.Athlete;
        query = this.dbService.getAthlete(qparam.id);
      } else if (qparam.type === this.formModes.Coach) {
        this.formMode = this.formModes.Coach;
        query = this.dbService.getCoach(qparam.id);
      }

      if (query) {
        this.isEditMode = true;
        query.subscribe((rs) => {
          this.onUpdateRecordId = rs._id;
          this.formInit(rs);
        });
      } else {
        this.formInit();
      }
    });
  }

  onChangeFormMode(e: string) {
    if (e === 'Athlete') {
      this.formMode = FormMode.Athlete;
    } else if (e === 'Coach') {
      this.formMode = FormMode.Coach;
    } else {
      this.snackbar.dismiss();
      this.snackbar.open('form mode invalid', undefined, {
        duration: 2 * 1000,
      });
    }
  }

  formInit(rs?: AthleteOrCoach) {
    this.form = this.fb.group({
      name: [
        rs?.name || '',
        [Validators.required, Validators.pattern(REGX.Name)],
      ],
      avatar: ['', [Validators.required]],
      gender: [rs?.gender || 'Male', [Validators.required]],
      email: [
        rs?.email || '',
        [Validators.required, Validators.pattern(REGX.Email)],
      ],
      mobile: [
        rs?.mobile || '',
        [Validators.required, Validators.pattern(REGX.Mobile)],
      ],
    });
  }

  submit() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { name, avatar, gender, email, mobile } = this.form?.value;

    if (this.formMode == FormMode.Athlete && !this.isEditMode) {
      this.addAthlete(name, gender, email, mobile, avatar);
    } else if (this.formMode == FormMode.Athlete && this.isEditMode) {
      if (!this.onUpdateRecordId) {
        this.snackbar.dismiss();
        this.snackbar.open('update record id not found.', undefined, {
          duration: 2 * 1000,
        });
        return;
      }

      this.updateAthlete(
        this.onUpdateRecordId,
        name,
        gender,
        email,
        mobile,
        avatar
      );
    } else if (this.formMode == FormMode.Coach && !this.isEditMode) {
      this.addCoach(name, gender, email, mobile, avatar);
    } else if (this.formMode == FormMode.Coach && this.isEditMode) {
      if (!this.onUpdateRecordId) {
        this.snackbar.dismiss();
        this.snackbar.open('update record id not found.', undefined, {
          duration: 2 * 1000,
        });
        return;
      }

      this.updateCoach(
        this.onUpdateRecordId,
        name,
        gender,
        email,
        mobile,
        avatar
      );
    } else {
      this.snackbar.dismiss();
      this.snackbar.open('invalid form mode', undefined, {
        duration: 2 * 1000,
      });
    }
  }

  formReset() {
    const el = document.getElementById('file') as HTMLInputElement;
    el.value = '';
    this.isEditMode = false;
    this.form?.reset({
      gender: [Gender.Male],
    });
  }

  addAthlete(
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    this.dbService.addAthletes(name, gender, email, mobile, avatar).subscribe({
      next: (rs) => {
        this.formReset();
        this.router.navigate(['/dashboard/list-ath-coach']);
      },
    });
  }

  updateAthlete(
    id: string,
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    this.dbService
      .updateAthletes(id, name, gender, email, mobile, avatar)
      .subscribe({
        next: (rs) => {
          this.formReset();
          this.router.navigate(['/dashboard/list-ath-coach']);
        },
      });
  }

  addCoach(
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    this.dbService.addCoach(name, gender, email, mobile, avatar).subscribe({
      next: (rs) => {
        this.formReset();
        this.location.back();
      },
    });
  }

  updateCoach(
    id: string,
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    this.dbService
      .updateCoach(id, name, gender, email, mobile, avatar)
      .subscribe({
        next: (rs) => {
          this.formReset();
          this.location.back();
        },
      });
  }

  onSelectImg(e: Event) {
    const el = e.target as HTMLInputElement;

    if (!el.files?.length) {
      this.snackbar.dismiss();
      this.snackbar.open('Please select file', undefined, {
        duration: 2 * 1000,
      });
      return;
    }

    this.form?.get('avatar')?.patchValue(el.files?.item(0));
  }
}

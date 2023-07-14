import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Athlete } from '../../models/athlete.model';
import { PaginatedResponse } from '../../models/paginated.model';
import { Coach } from '../../models/coach.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-assign-coach',
  templateUrl: './assign-coach.component.html',
  styleUrls: ['./assign-coach.component.css'],
  standalone: true,
  imports: [InputErrorComponent, ReactiveFormsModule, NgIf, AsyncPipe],
})
export class AssignCoachComponent implements OnInit {
  @Input() athlete?: Athlete;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  form!: FormGroup;
  coaches!: Observable<PaginatedResponse<Coach>>;

  constructor(private dbService: DashboardService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getCoaches();
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      physician_coach: [],
      batting_coach: [],
      trainer_coach: [],
      pitching_coach: [],
    });
  }

  getCoaches() {
    this.coaches = this.dbService.getCoaches();
  }

  assignCoach() {
    if (!this.athlete?._id) {
      throw new Error('athlete id not found.');
    }

    if (this.form.invalid) {
      alert('invalid form submission');
      return;
    }

    const { physician_coach, batting_coach, trainer_coach, pitching_coach } =
      this.form.value;

    this.dbService
      .assignCoach(
        physician_coach,
        batting_coach,
        trainer_coach,
        pitching_coach,
        this.athlete!._id
      )
      .subscribe((rs) => {
        this.close.next(true);
      });
  }

  onClose() {
    this.close.next(false);
  }
}

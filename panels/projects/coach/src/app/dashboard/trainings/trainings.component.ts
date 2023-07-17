import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../dashboard.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { Category } from '../../models/category.model';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { AddSessionComponent } from './add-session/add-session.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css'],
  standalone: true,
  imports: [CommonModule, AddExerciseComponent, AddSessionComponent],
})
export class TrainingsComponent implements OnInit {
  form!: FormGroup;
  categories?: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.categories = this.dbService.getCategories().pipe(shareReplay());

    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      name: [],
      exCategory: [],
      exSubCategory: [],
      steps: this.fb.array([this.getNewStep()]),
      file: [],
      description: [],
    });
  }

  getNewStep() {
    return this.fb.group({
      title: [],
      content: [],
    });
  }

  getFormArr() {
    return this.form.get('steps') as FormArray;
  }

  getFormStepGroup(idx: number) {
    return this.getFormArr().controls[idx] as FormGroup;
  }

  addStep() {
    this.getFormArr().push(this.getNewStep());
  }

  removeStep(idx: number) {
    this.getFormArr().removeAt(idx);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.dismiss();
      return;
    }

    const { name, steps, file, description, exCategory, exSubCategory } =
      this.form.value;
    this.dbService
      .createExercise(name, steps, file, description, exCategory, exSubCategory)
      .subscribe((rs) => {
        this.snackbar.dismiss();
        this.snackbar.open('Exercise Added.', undefined, {
          duration: 2 * 1000,
        });
        (document.getElementById('file') as HTMLInputElement).value = '';
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

    this.form.get('file')?.patchValue(el.files?.item(0));
  }
}

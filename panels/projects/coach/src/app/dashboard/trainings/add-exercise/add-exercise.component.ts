import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dashboard.service';
import { CommonModule, Location } from '@angular/common';
import { Observable, map, shareReplay } from 'rxjs';
import { Category } from '../../../models/category.model';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';

@Component({
  selector: '[app-add-exercise]',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
})
export class AddExerciseComponent {
  form!: FormGroup;
  subCategories?: Observable<Category[] | undefined>;
  @Input() categories?: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.formInit();

    this.form.get('exCategory')?.valueChanges.subscribe((rs) => {
      this.subCategories = this.categories?.pipe(
        map((val) => val.find((cat) => cat._id == rs)?.subCategories)
      );
    });
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      exCategory: [null, [Validators.required]],
      exSubCategory: [null, [Validators.required]],
      steps: this.fb.array([this.getNewStep()]),
      file: [],
      description: ['', [Validators.required]],
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

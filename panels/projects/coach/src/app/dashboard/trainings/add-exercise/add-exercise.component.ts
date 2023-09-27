import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { REGX } from 'regex';
import { Observable, map } from 'rxjs';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { Category } from '../../../models/category.model';
import { UiService } from '../../../services/ui.service';
import { DashboardService } from '../../dashboard.service';

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
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private uiSrv: UiService,
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
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(REGX.Name),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      exCategory: [null, [Validators.required]],
      exSubCategory: [null, [Validators.required]],
      steps: this.fb.array([this.getNewStep()]),
      file: [],
      description: ['', [Validators.required]],
    });
  }

  getNewStep() {
    return this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
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
      return;
    }

    this.submitting = true;

    const { name, steps, file, description, exCategory, exSubCategory } =
      this.form.value;
    this.dbService
      .createExercise(name, steps, file, description, exCategory, exSubCategory)
      .subscribe({
        next: (rs) => {
          this.submitting = false;
          this.uiSrv.openSnackbar('Exercise Added.');
          this.form.reset();
          (document.getElementById('file') as HTMLInputElement).value = '';
          // this.location.back();
        },
        error: (err) => {
          this.submitting = false;
          this.uiSrv.handleError(err);
        },
      });
  }

  onSelectImg(e: Event) {
    const el = e.target as HTMLInputElement;

    if (!el.files?.length) {
      this.uiSrv.openSnackbar('Please select file');
      return;
    }

    if (
      !['image/png', 'image/jpeg', 'image/jpg'].includes(el.files.item(0)!.type)
    ) {
      this.uiSrv.openSnackbar('Please select jpg,png file');
      return;
    }

    this.form.get('file')?.patchValue(el.files?.item(0));
  }
}

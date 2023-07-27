import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { Athlete } from '../../../models/athlete.model';
import { Exercise } from '../../../models/excercise.model';
import { Category } from '../../../models/category.model';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

interface Item {
  _id: string;
  name: string;
}

@Component({
  selector: '[app-add-session]',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    NgMultiSelectDropDownModule,
  ],
})
export class AddSessionComponent {
  form!: FormGroup;
  athletes?: Observable<Athlete[]>;
  exercises?: Observable<Exercise[]>;
  subCategories?: Observable<Category[] | undefined>;

  @Input() categories?: Observable<Category[]>;

  selectedItems: any[] = [];
  dropdownSettings: any = {};

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.athletes = this.dbService
      .getAthletes()
      .pipe(map((res) => res.results));

    this.form.get('exCategory')?.valueChanges.subscribe((rs) => {
      this.subCategories = this.categories?.pipe(
        map((val) => val.find((cat) => cat._id == rs)?.subCategories)
      );

      this.getExercise.bind(this);
    });

    this.form
      .get('exSubCategory')
      ?.valueChanges.subscribe(this.getExercise.bind(this));

    // this.selectedItems = [
    //   { _id: 'a1, name: 'Pune' },
    //   { _id: 'a1, name: 'Navsari' },
    // ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  getExercise(rs: any) {
    const exCategory = this.form?.get('exCategory')?.value;
    const exSubCategory = this.form?.get('exSubCategory')?.value;

    if (!exCategory?.length || !exSubCategory?.length) return;

    this.exercises = this.dbService.getExercises(exCategory, exSubCategory);
  }

  formInit() {
    this.form = this.fb.group({
      exCategory: [null, [Validators.required]],
      exSubCategory: [null, [Validators.required]],
      exercise: [null, [Validators.required]],
      athletes: [[], [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.dismiss();
      return;
    }

    const { exCategory, exSubCategory, exercise, athletes } = this.form.value;

    this.dbService
      .createTrainingSession(exCategory, exSubCategory, exercise, athletes)
      .subscribe((rs) => {
        this.snackbar.dismiss();
        this.snackbar.open('Session Added.', undefined, {
          duration: 2 * 1000,
        });
        (document.getElementById('file') as HTMLInputElement).value = '';
        // this.location.back();
        this.form.reset();
      });
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
}

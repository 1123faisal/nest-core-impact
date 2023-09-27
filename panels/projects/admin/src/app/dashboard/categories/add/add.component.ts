import { AsyncPipe, CommonModule, Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
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
import { Category } from '../../../models/category.model';
import { REGX } from 'regex';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UiService } from '../../../services/ui.service';

declare var $: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    CommonModule,
    AsyncPipe,
    NgMultiSelectDropDownModule,
  ],
})
export class AddComponent {
  form?: FormGroup;
  isEditMode: boolean = false;
  onUpdateRecordId?: string;

  subCategories?: Observable<Category[]>;
  selectedItems: any[] = [];
  dropdownSettings: any = {};
  submitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location,
    private uiSrv: UiService
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

    this.subCategories = this.dbService.getCategories(false);
    this.route.queryParams.subscribe((qparam: any) => {
      if (qparam.id) {
        this.isEditMode = true;
        this.dbService.getCategory(qparam.id).subscribe((rs: any) => {
          this.onUpdateRecordId = rs._id;
          this.formInit(rs);
        });
      } else {
        this.formInit();
      }
    });
  }

  formInit(rs?: Category) {
    this.form = this.fb.group({
      name: [
        rs?.name || '',
        [
          Validators.required,
          Validators.pattern(REGX.Name),
          Validators.minLength(3),
        ],
      ],
      subCategories: [rs?.subCategories || []],
    });
  }

  submit() {
    if (this.form?.invalid) {
      return this.form.markAllAsTouched();
    }

    this.submitting = true;
    const { name, subCategories } = this.form?.value;

    if (!this.isEditMode) {
      this.createCategory(name, subCategories);
    } else {
      if (!this.onUpdateRecordId) {
        this.snackbar.dismiss();
        this.snackbar.open('update record id not found.', undefined, {
          duration: 2 * 1000,
        });
        return;
      }

      this.updateCategory(this.onUpdateRecordId, name, subCategories);
    }
  }

  formReset() {
    this.isEditMode = false;
    this.form?.reset({});
  }

  createCategory(name: string, subCategories: string[]) {
    this.dbService.createCategory(name, subCategories).subscribe({
      next: (rs) => {
        this.uiSrv.openSnackbar('category created successfully.');
        this.formReset();
        this.router.navigate(['/dashboard/categories']);
        this.submitting = false;
      },
      error: (err) => {
        this.submitting = false;
        this.uiSrv.handleErr(err);
      },
    });
  }

  updateCategory(id: string, name: string, subCategories: string[]) {
    this.dbService.updateCategory(id, name, subCategories).subscribe({
      next: (rs) => {
        this.uiSrv.openSnackbar('category updated successfully.');
        this.formReset();
        this.router.navigate(['/dashboard/categories']);
        this.submitting = false;
      },
      error: (err) => {
        this.submitting = false;
        this.uiSrv.handleErr(err);
      },
    });
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
}

import { AsyncPipe, Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { REGX } from 'regex';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

declare var $: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    NgIf,
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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private location: Location
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
        [Validators.required, Validators.pattern(REGX.Name)],
      ],
      subCategories: [rs?.subCategories || []],
    });
  }

  submit() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.dismiss();
      this.snackbar.open('invalid form', undefined, {
        duration: 2 * 1000,
      });
      return;
    }

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
        this.formReset();
        this.location.back();
      },
    });
  }

  updateCategory(id: string, name: string, subCategories: string[]) {
    this.dbService.updateCategory(id, name, subCategories).subscribe({
      next: (rs) => {
        this.formReset();
        this.location.back();
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

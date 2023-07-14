import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';
import { REGX } from 'regex';

declare var $: any;

@Component({
  selector: 'app-add-sub-cat',
  templateUrl: './add-sub-cat.component.html',
  styleUrls: ['./add-sub-cat.component.css'],
})
export class AddSubCatComponent {
  form?: FormGroup;
  isEditMode: boolean = false;
  onUpdateRecordId?: string;
  categoryId?: string;

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

    this.route.queryParams.subscribe((qparam: any) => {
      this.categoryId = qparam['categoryId'];

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
      categoryId: [this.categoryId],
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

    const { name, categoryId } = this.form?.value;

    if (!this.isEditMode) {
      this.createSubCategory(name, categoryId);
    } else {
      if (!this.onUpdateRecordId) {
        this.snackbar.dismiss();
        this.snackbar.open('update record id not found.', undefined, {
          duration: 2 * 1000,
        });
        return;
      }

      this.updateCategory(this.onUpdateRecordId, name);
    }
  }

  formReset() {
    this.isEditMode = false;
    this.form?.reset({});
  }

  createSubCategory(name: string, categoryId: string) {
    this.dbService.createSubCategory(name, categoryId).subscribe({
      next: (rs) => {
        this.formReset();
        this.location.back();
      },
    });
  }

  updateCategory(id: string, name: string) {
    this.dbService.updateSubCategory(id, name).subscribe({
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

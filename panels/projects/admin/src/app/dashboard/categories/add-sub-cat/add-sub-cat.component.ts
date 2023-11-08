import { CommonModule, Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';
import { REGX } from 'regex';
import { InputErrorComponent } from '../../../components/input-error/input-error.component';
import { UiService } from '../../../services/ui.service';

declare var $: any;

@Component({
  selector: 'app-add-sub-cat',
  templateUrl: './add-sub-cat.component.html',
  styleUrls: ['./add-sub-cat.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
})
export class AddSubCatComponent {
  form?: FormGroup;
  isEditMode: boolean = false;
  onUpdateRecordId?: string;
  categoryId?: string;
  submitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private uiSrv: UiService,
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
        [
          Validators.required,
          Validators.pattern(REGX.Name),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      categoryId: [this.categoryId],
    });
  }

  submit() {
    if (this.form?.invalid) {
      return this.form.markAllAsTouched();
    }

    const { name, categoryId } = this.form?.value;
    this.submitting = true;

    if (!this.isEditMode) {
      this.createSubCategory(name, categoryId);
    } else {
      if (!this.onUpdateRecordId) {
        this.uiSrv.openSnackbar('update record id not found.');
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
        this.submitting = false;
        this.formReset();
        this.location.back();
      },
      error: (err) => {
        this.submitting = false;
        this.uiSrv.handleErr(err);
      },
    });
  }

  updateCategory(id: string, name: string) {
    this.dbService.updateSubCategory(id, name).subscribe({
      next: (rs) => {
        this.submitting = false;
        this.formReset();
        this.location.back();
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

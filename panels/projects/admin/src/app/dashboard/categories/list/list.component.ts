import { Component, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  categories: Category[] = [];

  constructor(
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private viewContainerRef: ViewContainerRef
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
    this.getTableData();
  }

  getTableData() {
    this.dbService.getCategories().subscribe((rs) => {
      this.categories = rs;
    });
  }

  deleteCategory(id: string) {
    this.dbService.deleteAthlete(id).subscribe(this.getTableData);
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

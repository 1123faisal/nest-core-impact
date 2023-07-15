import { NgFor, NgIf } from '@angular/common';
import { Component, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';
import { CatItemComponent } from '../cat-item/cat-item.component';

declare var $: any;

@Component({
  selector: 'app-sub-cat-list',
  templateUrl: './sub-cat-list.component.html',
  styleUrls: ['./sub-cat-list.component.css'],
  standalone: true,
  imports: [NgFor, CatItemComponent, NgIf],
})
export class SubCatListComponent {
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((rs) => {
      rs['parentId'] &&
        this.dbService.getCategories(false, rs['parentId']).subscribe((rs) => {
          this.categories = rs;
        });
    });
  }

  deleteCategory(id: string) {
    this.dbService.deleteAthlete(id).subscribe(this.getTableData);
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

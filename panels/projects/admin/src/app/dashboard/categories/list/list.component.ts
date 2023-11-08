import { CommonModule } from '@angular/common';
import { Component, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';
import { CatItemComponent } from '../cat-item/cat-item.component';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [CommonModule, CatItemComponent],
})
export class ListComponent {
  categories?: Observable<Category[]>;

  constructor(
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
    this.categories = this.dbService.getCategories();
  }

  deleteCategory(id: string) {
    this.dbService.deleteAthlete(id).subscribe(this.getTableData);
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

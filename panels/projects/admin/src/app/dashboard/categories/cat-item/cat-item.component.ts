import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Category } from '../../../models/category.model';
import { DashboardService } from '../../dashboard.service';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: '[app-cat-item]',
  templateUrl: './cat-item.component.html',
  styleUrls: ['./cat-item.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class CatItemComponent implements OnDestroy {
  @Input() item!: Category;
  @Output() getTableData = new EventEmitter<void>();
  @Input() isSubCat: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dbService: DashboardService
  ) {}

  updateCategoryStatus(id: string, status: boolean) {
    this.dbService
      .updateCategoryStatus(id, status)
      .subscribe((rs) => this.getTableData.next());
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

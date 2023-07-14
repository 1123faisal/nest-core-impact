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

@Component({
  selector: '[app-cat-item]',
  templateUrl: './cat-item.component.html',
  styleUrls: ['./cat-item.component.css'],
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

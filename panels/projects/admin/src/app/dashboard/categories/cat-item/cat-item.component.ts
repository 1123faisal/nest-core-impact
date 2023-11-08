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
import { UiService } from '../../../services/ui.service';

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
    private dbService: DashboardService,
    private uiService: UiService
  ) {}

  updateCategoryStatus(id: string, status: boolean) {
    this.item.status = status;
    this.dbService.updateCategoryStatus(id, status).subscribe({
      next: (value) => this.uiService.openSnackbar('Status updated.'),
      error: (err) => {
        this.item.status = !status;
        this.uiService.openSnackbar('Status update Failed.');
      },
    });
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

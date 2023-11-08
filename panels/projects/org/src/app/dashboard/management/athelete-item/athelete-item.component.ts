import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Athlete } from '../../../models/athlete.model';
import { AssignCoachComponent } from '../../../components/assign-coach/assign-coach.component';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: '[app-athelete-item]',
  templateUrl: './athelete-item.component.html',
  styleUrls: ['./athelete-item.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AtheleteItemComponent implements OnDestroy {
  @Input() item!: Athlete;
  @Input() idx!: number;
  @Output() getTableData = new EventEmitter<void>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dbService: DashboardService,
    private uiService: UiService
  ) {}

  openAssignCoachPopup() {
    if (!this.item) {
      throw new Error('no athlete found');
    }

    this.viewContainerRef?.clear();
    const ref =
      this.viewContainerRef.createComponent<AssignCoachComponent>(
        AssignCoachComponent
      );

    ref.instance.athlete = this.item;
    ref.instance.close.subscribe((rs) => {
      if (rs) this.getTableData.next();
      ref.destroy();
    });
  }

  updateAthletesStatus(id: string, status: boolean) {
    this.item.status = status;
    this.dbService.updateAthletesStatus(id, status).subscribe({
      next: (value) => {
        this.uiService.openSnackbar('Status Updated.');
      },
      error: (err) => {
        this.item.status = !status;
        this.uiService.openSnackbar('Status Update Failed.');
      },
    });
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

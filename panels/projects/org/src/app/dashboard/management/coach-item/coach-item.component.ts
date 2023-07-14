import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Coach } from '../../../models/coach.model';

@Component({
  selector: '[app-coach-item]',
  templateUrl: './coach-item.component.html',
  styleUrls: ['./coach-item.component.css'],
})
export class CoachItemComponent {
  @Input() item!: Coach;
  @Input() idx!: number;
  @Output() getTableData = new EventEmitter<void>();

  constructor(private dbService: DashboardService) {}

  updateCoachStatus(id: string, status: boolean) {
    this.dbService.updateCoachStatus(id, status).subscribe((rs) => {
      this.getTableData.next();
    });
  }
}

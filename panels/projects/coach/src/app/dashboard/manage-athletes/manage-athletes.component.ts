import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Athlete } from '../../models/athlete.model';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AtheleteItemComponent } from './athelete-item/athelete-item.component';

@Component({
  selector: 'app-manage-athletes',
  templateUrl: './manage-athletes.component.html',
  styleUrls: ['./manage-athletes.component.css'],
  standalone: true,
  imports: [CommonModule, AtheleteItemComponent],
})
export class ManageAthletesComponent implements OnInit {
  athletes?: Observable<Athlete[]>;

  constructor(private dbService: DashboardService) {}

  ngOnInit(): void {
    this.athletes = this.dbService.getAthletes().pipe(map((rs) => rs.results));
  }
}

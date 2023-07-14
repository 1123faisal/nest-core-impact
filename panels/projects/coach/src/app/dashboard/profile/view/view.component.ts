import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent {
  profile: Observable<User | null>;

  constructor(private dbService: DashboardService) {
    this.profile = this.dbService.getProfile();
  }

  getInfoAsString(data: User) {
    return JSON.stringify(data);
  }
}

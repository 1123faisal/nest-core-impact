import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { User } from '../../../models/user.model';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  standalone: true,
  imports: [RouterModule, NgIf, AsyncPipe],
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

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthData } from '../../models/auth.model';
import { AuthService } from '../../auth/auth.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { AsyncPipe, NgIf } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-top-sidebar',
  templateUrl: './top-sidebar.component.html',
  styleUrls: ['./top-sidebar.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule],
})
export class TopSidebarComponent implements OnInit {
  user!: Observable<AuthData | null>;

  constructor(
    public authService: AuthService,
    public dbService: DashboardService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    $('#submenu')
      // .off("click")
      .on('click', function (e1: any) {
        $('#menu').slideToggle();
      });
  }

  logout() {
    if (confirm('Are you sure you want to logout from panel?')) {
      this.authService.logout();
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }
}

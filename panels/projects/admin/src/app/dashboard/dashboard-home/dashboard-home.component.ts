import { Component, OnInit } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { AuthData } from '../../models/auth.model';
import { Setting } from '../../models/setting.model';
import { Athlete } from '../../models/athlete.model';
import { AuthService } from '../../auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  user!: Observable<AuthData | null>;
  settings?: Observable<Setting>;
  athletes?: Observable<Athlete[]>;

  constructor(
    public authService: AuthService,
    public dbService: DashboardService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.owl-carousel').owlCarousel({
        loop: true,
        items: 1,
        slideSpeed: 2000,
        autoplay: true,
        thumbs: true,
        thumbImage: true,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item',
      });
    });

    this.getSetting();
    // this.getAthletes();
  }

  // getAthletes() {
  //   this.athletes = this.dbService.getAthletes(0, 3).pipe(
  //     map((rs) => {
  //       $(document).ready(function () {
  //         $('.owl-carousel').owlCarousel({
  //           loop: true,
  //           items: 1,
  //           slideSpeed: 2000,
  //           autoplay: true,
  //           thumbs: true,
  //           thumbImage: true,
  //           thumbContainerClass: 'owl-thumbs',
  //           thumbItemClass: 'owl-thumb-item',
  //         });
  //       });
  //       return rs.results;
  //     })
  //   );
  // }

  getSetting() {
    this.settings = this.dbService.getDashboardSetting();
  }

  onChangeBanner(e: Event) {
    const el = e.target as HTMLInputElement;

    if (!el.files?.length) {
      console.log('no image');
      return;
    }

    this.dbService
      .updateDashboardSetting(undefined, el.files.item(0)!)
      .pipe(
        finalize(() => {
          el.value = '';
        })
      )
      .subscribe({
        next: (value) => {
          console.log('updated');
          this.getSetting();
        },
        error: (err) => {
          console.log('error', err);
        },
      });
  }

  onChangeLogo(e: Event) {
    const el = e.target as HTMLInputElement;

    if (!el.files?.length) {
      console.log('no image');
      return;
    }

    this.dbService
      .updateDashboardSetting(el.files.item(0)!)
      .pipe(
        finalize(() => {
          el.value = '';
        })
      )
      .subscribe({
        next: (value) => {
          console.log('updated');
          this.getSetting();
        },
        error: (err) => {
          console.log('error', err);
        },
      });
  }
}

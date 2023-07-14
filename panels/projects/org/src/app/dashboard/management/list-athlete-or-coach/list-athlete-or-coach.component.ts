import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Athlete } from '../../../models/athlete.model';
import { Coach } from '../../../models/coach.model';
import { DashboardService } from '../../dashboard.service';
import { UploadCoachAthletesComponent } from '../../../components/upload-coach-athletes/upload-coach-athletes.component';
declare var $: any;

enum FormMode {
  Athlete = 'Athlete',
  Coach = 'Coach',
}

@Component({
  selector: 'app-list-athlete-or-coach',
  templateUrl: './list-athlete-or-coach.component.html',
  styleUrls: ['./list-athlete-or-coach.component.css'],
})
export class ListAthleteOrCoachComponent implements OnInit, OnDestroy {
  tableMode = FormMode.Athlete;
  tableModes = FormMode;
  athletes: Athlete[] = [];
  coaches: Coach[] = [];
  loading: boolean = true;

  constructor(
    private snackbar: MatSnackBar,
    private dbService: DashboardService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    $(function () {
      $('input[name="daterange"]').daterangepicker(
        {
          opens: 'left',
        },
        function (start: any, end: any, label: any) {}
      );
    });
    this.getTableData();
  }

  getTableData() {
    this.loading = true;
    if (this.tableMode === this.tableModes.Athlete) {
      this.dbService.getAthletes().subscribe((rs) => {
        this.athletes = rs.results;
        this.loading = false;
      });
    } else {
      this.dbService.getCoaches().subscribe((rs) => {
        this.coaches = rs.results;
        this.loading = false;
      });
    }
  }

  onChangeTableMode(e: string) {
    if (e === 'Athlete') {
      this.tableMode = FormMode.Athlete;
      this.getTableData();
    } else if (e === 'Coach') {
      this.tableMode = FormMode.Coach;
      this.getTableData();
    } else {
      this.snackbar.dismiss();
      this.snackbar.open('form mode invalid', undefined, {
        duration: 2 * 1000,
      });
    }
  }

  deleteAthleteOrCoach(id: string) {
    if (this.tableMode === this.tableModes.Athlete) {
      this.dbService.deleteAthlete(id).subscribe(this.getTableData);
    } else {
      this.dbService.deleteCoach(id).subscribe(this.getTableData);
    }
  }

  onClickUploadCsv() {
    this.viewContainerRef.clear();

    const ref =
      this.viewContainerRef.createComponent<UploadCoachAthletesComponent>(
        UploadCoachAthletesComponent
      );

    ref.instance.mode = this.tableMode;
    ref.instance.onClose.subscribe(ref.destroy);
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

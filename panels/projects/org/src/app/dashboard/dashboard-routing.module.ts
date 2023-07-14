import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardComponent } from './dashboard.component';
import { AddAthletesOrCoachComponent } from './management/add-athlete-or-coach/add-athlete-or-coach.component';
import { ListAthleteOrCoachComponent } from './management/list-athlete-or-coach/list-athlete-or-coach.component';
import { ViewComponent } from './profile/view/view.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { HeatMapMetricsComponent } from './heat-map-metrics/heat-map-metrics.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'add-ath-coach', component: AddAthletesOrCoachComponent },
      { path: 'list-ath-coach', component: ListAthleteOrCoachComponent },
      { path: 'profile', component: ViewComponent },
      { path: 'profile/edit', component: EditComponent },
      { path: 'change_password', component: ChangePasswordComponent },
      { path: 'trainings', component: TrainingsComponent },
      { path: 'heat-map', component: HeatMapMetricsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

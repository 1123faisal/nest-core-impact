import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AssignCoachComponent } from '../components/assign-coach/assign-coach.component';
import { InputErrorComponent } from '../components/input-error/input-error.component';
import { TopSidebarComponent } from '../components/top-sidebar/top-sidebar.component';
import { UploadCoachAthletesComponent } from '../components/upload-coach-athletes/upload-coach-athletes.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeatMapMetricsComponent } from './heat-map-metrics/heat-map-metrics.component';
import { AddAthletesOrCoachComponent } from './management/add-athlete-or-coach/add-athlete-or-coach.component';
import { AtheleteItemComponent } from './management/athelete-item/athelete-item.component';
import { CoachItemComponent } from './management/coach-item/coach-item.component';
import { ListAthleteOrCoachComponent } from './management/list-athlete-or-coach/list-athlete-or-coach.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { ViewComponent } from './profile/view/view.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { CopyrightComponent } from '../components/copyright/copyright.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardComponent,
    EditComponent,
    ViewComponent,
    ChangePasswordComponent,
    AddAthletesOrCoachComponent,
    ListAthleteOrCoachComponent,
    TrainingsComponent,
    HeatMapMetricsComponent,
    AtheleteItemComponent,
    CoachItemComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    DashboardRoutingModule,
    ReactiveFormsModule,
    AssignCoachComponent,
    UploadCoachAthletesComponent,
    InputErrorComponent,
    CopyrightComponent,
    TopSidebarComponent,
  ],
})
export class DashboardModule {}

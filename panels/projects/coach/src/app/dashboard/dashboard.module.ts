import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { AssignCoachComponent } from '../components/assign-coach/assign-coach.component';
import { CopyrightComponent } from '../components/copyright/copyright.component';
import { InputErrorComponent } from '../components/input-error/input-error.component';
import { TopSidebarComponent } from '../components/top-sidebar/top-sidebar.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AtheleteItemComponent } from './manage-athletes/athelete-item/athelete-item.component';
import { ManageAthletesComponent } from './manage-athletes/manage-athletes.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { ViewComponent } from './profile/view/view.component';
import { AddExerciseComponent } from './trainings/add-exercise/add-exercise.component';
import { AddSessionComponent } from './trainings/add-session/add-session.component';
import { TrainingsComponent } from './trainings/trainings.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardComponent,
    EditComponent,
    ViewComponent,
    ChangePasswordComponent,
    ManageAthletesComponent,
    TrainingsComponent,
    AtheleteItemComponent,
    AddExerciseComponent,
    AddSessionComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    DashboardRoutingModule,
    ReactiveFormsModule,
    AssignCoachComponent,
    NgxSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    InputErrorComponent,
    TopSidebarComponent,
    CopyrightComponent,
  ],
})
export class DashboardModule {}

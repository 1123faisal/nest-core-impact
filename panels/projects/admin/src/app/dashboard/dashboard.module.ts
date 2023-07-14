import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AssignCoachComponent } from '../components/assign-coach/assign-coach.component';
import { CopyrightComponent } from '../components/copyright/copyright.component';
import { InputErrorComponent } from '../components/input-error/input-error.component';
import { TopSidebarComponent } from '../components/top-sidebar/top-sidebar.component';
import { AddSubCatComponent } from './categories/add-sub-cat/add-sub-cat.component';
import { AddComponent } from './categories/add/add.component';
import { CatItemComponent } from './categories/cat-item/cat-item.component';
import { ListComponent } from './categories/list/list.component';
import { SubCatListComponent } from './categories/sub-cat-list/sub-cat-list.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeatMapMetricsComponent } from './heat-map-metrics/heat-map-metrics.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { ViewComponent } from './profile/view/view.component';
import { TrainingsComponent } from './trainings/trainings.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardComponent,
    EditComponent,
    ViewComponent,
    ChangePasswordComponent,
    TrainingsComponent,
    HeatMapMetricsComponent,
    ListComponent,
    AddComponent,
    CatItemComponent,
    AddSubCatComponent,
    SubCatListComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    DashboardRoutingModule,
    ReactiveFormsModule,
    AssignCoachComponent,
    NgMultiSelectDropDownModule.forRoot(),
    InputErrorComponent,
    TopSidebarComponent,
    CopyrightComponent,
  ],
})
export class DashboardModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardComponent } from './dashboard.component';
import { ViewComponent } from './profile/view/view.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { HeatMapMetricsComponent } from './heat-map-metrics/heat-map-metrics.component';
import { AddComponent } from './categories/add/add.component';
import { ListComponent } from './categories/list/list.component';
import { AddSubCatComponent } from './categories/add-sub-cat/add-sub-cat.component';
import { SubCatListComponent } from './categories/sub-cat-list/sub-cat-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'categories', component: ListComponent },
      { path: 'categories/add', component: AddComponent },
      { path: 'categories/sub', component: SubCatListComponent },
      { path: 'categories/add/sub', component: AddSubCatComponent },
      { path: '', component: DashboardHomeComponent },
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

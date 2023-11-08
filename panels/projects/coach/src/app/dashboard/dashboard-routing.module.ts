import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardComponent } from './dashboard.component';
import { ManageAthletesComponent } from './manage-athletes/manage-athletes.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { EditComponent } from './profile/edit/edit.component';
import { ViewComponent } from './profile/view/view.component';
import { TrainingsComponent } from './trainings/trainings.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'athletes', component: ManageAthletesComponent },
      { path: 'trainings', component: TrainingsComponent },
      { path: 'profile', component: ViewComponent },
      { path: 'profile/edit', component: EditComponent },
      { path: 'change_password', component: ChangePasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

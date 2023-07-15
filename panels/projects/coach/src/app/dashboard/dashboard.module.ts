import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CopyrightComponent } from '../components/copyright/copyright.component';
import { TopSidebarComponent } from '../components/top-sidebar/top-sidebar.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TopSidebarComponent,
    CopyrightComponent,
  ],
})
export class DashboardModule {}

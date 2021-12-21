import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsByBusinessPage } from './statistics-by-business.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsByBusinessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsByBusinessPageRoutingModule {}

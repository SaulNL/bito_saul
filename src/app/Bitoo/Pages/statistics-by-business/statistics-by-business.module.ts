import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StatisticsByBusinessPageRoutingModule } from './statistics-by-business-routing.module';
import { StatisticsByBusinessPage } from './statistics-by-business.page';
import { CommonComponentsModule } from '../../module/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatisticsByBusinessPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [StatisticsByBusinessPage]
})
export class StatisticsByBusinessPageModule {}

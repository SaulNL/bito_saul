import { ReloadComponent } from './../components/reload/reload.component';
import { LoaderComponent } from './../components/loader/loader.component';
import { HeaderComponent } from './../components/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, LoaderComponent, ReloadComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [HeaderComponent, LoaderComponent, ReloadComponent]
})
export class CommonComponentsModule { }

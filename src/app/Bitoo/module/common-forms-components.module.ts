import { ShowAlertFormComponent } from './../components/show-alert-form/show-alert-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ShowAlertFormComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ShowAlertFormComponent]
})
export class CommonFormsComponentsModule { }

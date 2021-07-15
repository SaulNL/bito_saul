import { SpinnerComponent } from './spinner.component';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [SpinnerComponent]
})
export class SpinnerModule { }

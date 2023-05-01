import { SpinnerModule } from './../spinner/spinner.module';
import { CalificarNegocioComponent } from './calificar-negocio.component';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [CalificarNegocioComponent],
  imports: [CommonModule, FormsModule, IonicModule, SpinnerModule],
  exports: [CalificarNegocioComponent]
})
export class CalificarNegocioModule { }

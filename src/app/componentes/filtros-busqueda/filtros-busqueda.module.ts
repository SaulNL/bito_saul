import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {FiltrosBusquedaComponent} from "./filtros-busqueda.component";

@NgModule({
    imports: [ CommonModule, FormsModule, IonicModule],
    declarations: [FiltrosBusquedaComponent],
    exports: [FiltrosBusquedaComponent]
})

export class FiltrosBusquedaModule {

}

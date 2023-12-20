import { PlazasAfiliacionesComponent } from '../../componentes/plazas-afiliaciones/plazas-afiliaciones.component';
import { BotonTopComponent } from "../../componentes/boton-top/boton-top.component";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BannerPromocionesComponent } from "../../componentes/banner-promociones/banner-promociones.component";
import { ToolbarBusquedaComponent } from "../../componentes/toolbar-busqueda/toolbar-busqueda.component";
import { InputTagsComponent } from "../../components/input-tags/input-tags.component";
import { UbicacionFormularioComponent } from 'src/app/components/ubicacion-formulario/ubicacion-formulario.component';
import { TabsPageRoutingModule } from "./tabs-routing.module";
import { ModalClasificacionComponent } from "../../componentes/modal-clasificacion/modal-clasificacion.component";
import { RecorteImagenComponent } from "../../components/recorte-imagen/recorte-imagen.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { TabsPage } from "./tabs.page";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { InputLugaresEntregaComponent } from '../../components/input-lugares-entrega/input-lugares-entrega.component';
import { ModalLoguearseComponent } from '../../componentes/modal-loguearse/modal-loguearse.component'
import { BannerAnunciosComponent } from '../../componentes/banner-anuncios/banner-anuncios.component';
import { ModalPromocionNegocioComponent } from '../../componentes/modal-promocion-negocio/modal-promocion-negocio.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {
    ModalInfoPromocionComponent
} from "../../componentes/modal-promocion-negocio/modal-info-promocion/modal-info-promocion.component";
import {SpinnerModule} from "../../componentes/spinner/spinner.module";
import {ModalInicioSesionPageModule} from "../modal-inicio-sesion/modal-inicio-sesion.module";
import { ModalImagenCuponComponent } from '../../components/modal-imagen-cupon/modal-imagen-cupon.component';
import { DetallesReservaComponent } from '../eventos/detalles-reserva/detalles-reserva.component';
import { InfoReservacionComponent } from '../eventos/info-reservacion/info-reservacion.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        ImageCropperModule,
        SpinnerModule,
        ModalInicioSesionPageModule,
        ReactiveFormsModule
    ],
    declarations: [
        TabsPage,
        BannerPromocionesComponent,
        BannerAnunciosComponent,
        ToolbarBusquedaComponent,
        BotonTopComponent,
        InputTagsComponent,
        UbicacionFormularioComponent,
        InputLugaresEntregaComponent,
        ModalClasificacionComponent,
        RecorteImagenComponent,
        FiltrosBusquedaComponent,
        PlazasAfiliacionesComponent,
        DetallesReservaComponent,
        InfoReservacionComponent,
        ModalLoguearseComponent,
        ModalPromocionNegocioComponent,
        ModalInfoPromocionComponent,
        ModalImagenCuponComponent,
    ],
  exports: [
    BannerPromocionesComponent,
    BannerAnunciosComponent,
    ToolbarBusquedaComponent,
    BotonTopComponent,
    InputTagsComponent,
    UbicacionFormularioComponent,
    InputLugaresEntregaComponent,
    ModalClasificacionComponent,
    RecorteImagenComponent,
    FiltrosBusquedaComponent,
    PlazasAfiliacionesComponent,
    ModalLoguearseComponent,
    ModalPromocionNegocioComponent
  ],
  providers: [SocialSharing],
})
export class TabsPageModule { }

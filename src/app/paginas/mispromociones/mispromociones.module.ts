import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MispromocionesPageRoutingModule } from './mispromociones-routing.module';
import { MispromocionesPage } from './mispromociones.page';
import { FormularioAgregarPromocionComponent } from '../../components/formulario-agregar-promocion/formulario-agregar-promocion.component';
import { InputTagsComponent } from '../../components/input-tags/input-tags.component';
import { RecorteImagenComponent } from '../../components/recorte-imagen/recorte-imagen.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalPublicarComponent } from '../../components/modal-publicar/modal-publicar.component';
import { ModalInfoPromoComponent } from '../../components/modal-info-promo/modal-info-promo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MispromocionesPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [
  	MispromocionesPage,
    FormularioAgregarPromocionComponent,
    InputTagsComponent,
    RecorteImagenComponent,
    ModalPublicarComponent,
    ModalInfoPromoComponent
  ]
})
export class MispromocionesPageModule {}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesModel } from 'src/app/Modelos/busqueda/PromocionesModel';
import {RegistrarPromotionService} from "../../api/registrar-promotion.service";
@Component({
  selector: 'app-modal-promocion-negocio',
  templateUrl: './modal-promocion-negocio.component.html',
  styleUrls: ['./modal-promocion-negocio.component.scss'],
})
export class ModalPromocionNegocioComponent implements OnInit {
  @Input() promocionTO: PromocionesModel;
  @Input() idPersona: number | null;
  @Input() latitud: any;
  @Input() longitud: any;
  constructor(
    public modalController: ModalController,
    private vioPromo: RegistrarPromotionService
  ) { }

  ngOnInit() {
    this.vioPromo.registrarQuienVio(this.promocionTO.id_promocion, this.idPersona, this.latitud, this.longitud);
  }

  cerrar() {
    this.modalController.dismiss();
    this.promocionTO = new PromocionesModel();
  }

}

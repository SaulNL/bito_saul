import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesModel } from 'src/app/Modelos/busqueda/PromocionesModel';
@Component({
  selector: 'app-modal-promocion-negocio',
  templateUrl: './modal-promocion-negocio.component.html',
  styleUrls: ['./modal-promocion-negocio.component.scss'],
})
export class ModalPromocionNegocioComponent implements OnInit {
  @Input() promocionTO: PromocionesModel;
  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
    console.log(this.promocionTO);
  }
  
  cerrar() {
    this.modalController.dismiss();
    this.promocionTO = new PromocionesModel();
  }
  
}

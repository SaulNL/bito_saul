import {Component, Input, OnInit} from '@angular/core';
import {ProductoModel} from "../../../Modelos/ProductoModel";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {

  @Input() public seleccionadoDetalleArray: Array<ProductoModel>;

  slideOpts ={
    scrollbar:true
  }
  constructor(
      public modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  verMas(){

  }

}

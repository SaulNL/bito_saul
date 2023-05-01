import { Component, Input, OnInit } from "@angular/core";
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ModalController } from "@ionic/angular";
import { NegocioService } from "../../api/negocio.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-modal-productos",
  templateUrl: "./modal-productos.component.html",
  styleUrls: ["./modal-productos.component.scss"],
})
export class ModalProductosComponent implements OnInit {

  @Input() public seleccionadoDetalleArray: Array<ProductoModel>;
  @Input() public unoProducto: any;
  @Input() public losDemas: Array<ProductoModel>;

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
    });
  }
}

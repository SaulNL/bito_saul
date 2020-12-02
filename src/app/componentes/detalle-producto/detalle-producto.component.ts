import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UtilsCls} from "../../utils/UtilsCls";

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
  providers:[
      UtilsCls
  ]
})
export class DetalleProductoComponent implements OnInit {

  @Input() public _entregaDomicilio: any;
  @Input() public _entregaSitio: boolean;
  @Input() public _consumoSitio: boolean;
  @Input() datos: any;
  @Output() llenarLista :  EventEmitter<any> = new EventEmitter();

  constructor(
      private utilsCls: UtilsCls,
      private modalController: ModalController,
  ) {
    console.log(this.datos)
  }

  ngOnInit() {
    console.log(this.datos)
  }

  cerrarModal() {
    this.modalController.dismiss({
      'data': null,
    });
  }

  get mostrarComponente() {
    return (this._entregaDomicilio === 1 || this._entregaSitio === true || this._consumoSitio === true) && this.utilsCls.existe_sesion() && parseInt(this.datos.precio) > 0;
  }

  agragarproducto() {
    const producto = {
      idProducto: this.datos.idProducto,
      precio: this.datos.precio,
      imagen: this.datos.imagen,
      cantidad: 1,
      idNegocio: this.datos.negocio.idNegocio,
      nombre: this.datos.nombre,
      descripcion: this.datos.descripcion
    };
    this.modalController.dismiss({
      'data': producto,
    });
  }
}

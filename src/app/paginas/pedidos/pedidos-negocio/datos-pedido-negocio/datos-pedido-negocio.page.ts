import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PedidosService } from '../../../../api/pedidos.service';
import {Map, tileLayer, marker} from 'leaflet';
import {PedidosNegocioPage} from '../pedidos-negocio.page';

@Component({
  selector: 'app-datos-pedido-negocio',
  templateUrl: './datos-pedido-negocio.page.html',
  styleUrls: ['./datos-pedido-negocio.page.scss'],
})
export class DatosPedidoNegocioPage implements OnInit {
  @Input() public pedido:any;
  blnCancelar: boolean;
  motivo: any;
  numeroSolicitud: any;
  public loaderBtn: boolean;
  map: any;
  constructor(
    private pedidosServicios: PedidosService,
    public modalController: ModalController
  ) {
    this.blnCancelar = false;
    this.loaderBtn = false;
   }

  ngOnInit() {
    if(this.pedido.id_tipo_pedido === 2){
      this.loadMap();
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  cancelar() {
    this.blnCancelar = true;
  }

  regresar() {
    this.blnCancelar = false;
  }

  cancelarPedido(pedido: any) {
    //this.loaderBtn = true;
    this.pedidosServicios.cancelar(pedido.id_pedido_negocio, this.motivo).subscribe(
      respuesta => {
        //this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
        pedido.motivo = respuesta.data.motivo;
        this.blnCancelar = false;
      },
      error => {
        //this.loaderBtn = false;
        console.log('error');        
      });
  }
  perpararPedido(pedido) {
    this.loaderBtn = true;
    this.pedidosServicios.preparar(pedido.id_pedido_negocio).subscribe(
      respuesta => {
        this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
      },
      error => {
        this.loaderBtn = false;
      });
  }
  enviarPedido(pedido: any) {
    this.loaderBtn = true;
    this.pedidosServicios.enviar(pedido.id_pedido_negocio).subscribe(
      respuesta => {
        this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
      },
      error => {
        this.loaderBtn = false;
      });
  }
  entregarPedido(pedido: any) {
    this.loaderBtn = true;
    this.pedidosServicios.entregar(pedido.id_pedido_negocio).subscribe(
      respuesta => {
        this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
      },
      error => {
        this.loaderBtn = false;
      });
  }

  loadMap() {
    const lat = this.pedido.direccion.latitud;
    const lng = this.pedido.direccion.longitud;
    this.map = new Map("mapId").setView([lat, lng], 16);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: ''}).addTo(this.map);
    marker([lat, lng]).addTo(this.map)
}

}

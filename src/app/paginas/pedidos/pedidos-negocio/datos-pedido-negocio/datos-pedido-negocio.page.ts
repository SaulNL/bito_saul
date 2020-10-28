import { Component, Input, OnInit } from '@angular/core';
import { PedidosService } from '../../../../api/pedidos.service';
import {Map, tileLayer, marker} from 'leaflet';
import {Router, ActivatedRoute} from '@angular/router';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';

@Component({
  selector: 'app-datos-pedido-negocio',
  templateUrl: './datos-pedido-negocio.page.html',
  styleUrls: ['./datos-pedido-negocio.page.scss'],
})
export class DatosPedidoNegocioPage implements OnInit {
  public pedido:any;
  blnCancelar: boolean;
  motivo: any;
  numeroSolicitud: any;
  public loaderBtn: boolean;
  map: any;
  constructor(
    private pedidosServicios: PedidosService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private notificaciones: ToadNotificacionService
  ) {
    this.blnCancelar = false;
    this.loaderBtn = false;
   }

  ngOnInit() {    
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.pedido = JSON.parse(params.special);
      }      
    });    
    if(this.pedido.id_tipo_pedido === 2){
      this.loadMap();
    }
  }

  cancelar() {
    this.blnCancelar = true;
  }

  regresar(){
    this.blnCancelar = false;
    this.router.navigate(['/tabs/home/ventas'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosVariable = false;
    //this.admin.getVariables();
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
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        //this.loaderBtn = false;
        this.notificaciones.error(error.message);    
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
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        this.loaderBtn = false;
        this.notificaciones.error(error.message);
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
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        this.loaderBtn = false;
        this.notificaciones.error(error.message);
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
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        this.loaderBtn = false;
        this.notificaciones.error(error.message);
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

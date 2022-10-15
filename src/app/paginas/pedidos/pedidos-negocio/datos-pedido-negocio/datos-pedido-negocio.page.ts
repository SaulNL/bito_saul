import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../../../api/pedidos.service';
// import {Map, tileLayer, marker, icon, Marker} from 'leaflet';
import { icon, LatLng, latLng, Map, Marker, marker, tileLayer } from "leaflet";
import { Router, ActivatedRoute } from '@angular/router';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

declare var google: any;
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-datos-pedido-negocio',
    templateUrl: './datos-pedido-negocio.page.html',
    styleUrls: ['./datos-pedido-negocio.page.scss'],
})
export class DatosPedidoNegocioPage implements OnInit {
    
    public pedido: any;
    blnCancelar: boolean;
    motivo: any;
    numeroSolicitud: any;
    public loaderBtn: boolean;
    map: any;
    private marker: Marker<any>;
    public mapView: string;
    public total: number;
    public domicilioEnvio: boolean;
    public domicilioEnvioMessage: any;
    public estasUbicacion: any;
    public isIos: boolean;

    constructor(
        private pedidosServicios: PedidosService,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private notificaciones: ToadNotificacionService,
        private socialSharing: SocialSharing,
        private platform: Platform,
    ) {
        this.blnCancelar = false;
        this.loaderBtn = false;
        this.mapView = 'block';
        this.domicilioEnvio = false;
        this.domicilioEnvioMessage = '';
        this.total = 0;
        this.isIos = this.platform.is('ios');
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.special) {
                const body = JSON.parse(params.special);
                this.pedido = body.pedido;
                this.visto(this.pedido.id_pedido_negocio);
                if (this.pedido.id_tipo_pedido === 2) {
                    this.textoDomicilio(body.precioEntrega);
                    this.loadMap();
                    this.domicilioEnvio = true;
                } else {
                    this.mapView = 'none';
                }
                this.pedido.productos.forEach(element => {
                    this.total += Number(element.costo);
                });
            }
        });
        this.buscarNumeroRepartidor();
    }

    public visto(idPedidoNegocio) {
        this.pedidosServicios.ponerVisto(idPedidoNegocio).subscribe(
            () => { }, () => { });
    }

    public textoDomicilio(domicilioEnvioMessage: any) {
        const temp = Number(domicilioEnvioMessage);
        if (isNaN(temp)) {
            this.domicilioEnvioMessage = '+ Costo de envio : ' + domicilioEnvioMessage;
        } else {
            this.domicilioEnvioMessage = '+ $' + temp + 'pesos del envio';
        }

    }

    cancelar() {
        this.blnCancelar = true;
    }

    setBlnCancelar(bandera: boolean) {
        this.blnCancelar = bandera;
    }

    regresar() {
        //this.blnCancelar = false;
        this.router.navigate(['/tabs/home/ventas'], { queryParams: { special: true } });
        //this.admin.blnActivaDatosVariable = false;
        //this.admin.getVariables();
    }

    cancelarPedido(pedido: any) {
        //this.loaderBtn = true;
        this.pedidosServicios.cancelar(pedido.id_pedido_negocio, this.motivo).subscribe(
            respuesta => {
                pedido.id_estatus_pedido = respuesta.data.id;
                pedido.estatus = respuesta.data.estatus;
                pedido.color = respuesta.data.color;
                pedido.motivo = respuesta.data.motivo;
                this.loaderCancel();
                this.notificaciones.exito(respuesta.message);
            },
            error => {
                //this.loaderBtn = false;
                this.notificaciones.error(error.message);
            });
    }

    perpararPedido(pedido: any) {
        this.loaderBtn = true;
        this.pedidosServicios.preparar(pedido.id_pedido_negocio).subscribe(
            respuesta => {
                this.loaderCancel();
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
                this.loaderCancel();
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
                this.loaderCancel();
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

    shareSocial() {

        if(this.isIos){
            let urlIos: string = 'https://www.google.com.mx/maps/@'+ this.pedido.direccion.latitud + ","+ this.pedido.direccion.longitud + ",17z";
            this.socialSharing.share('Dirección:'+ this.pedido.direccion.direccion, 'Dirección:', '', urlIos);
        }else{
            let url = 'https://www.google.com/maps/search/?api=1&query='
            + this.pedido.direccion.latitud + ","
            + this.pedido.direccion.longitud+"&zoom=15"
            this.socialSharing.share('Dirección:', 'Dirección:', '','' + this.pedido.direccion.direccion + ' ' + url);
        }
       
    }

    shareCliente() {
        let cliente = this.pedido.persona.nombre;
            cliente = cliente != null ? cliente : 'Sin dato';
        let telefono = this.pedido.persona.telefono;
            telefono = telefono != null ? telefono : 'Sin dato';
        let celular = this.pedido.persona.celular;
            celular = celular != null ? celular : 'Sin dato';
        let correo = this.pedido.persona.correo;
            correo = correo != null ? correo : 'Sin dato';
        let direccion = this.pedido.direccion.direccion;
            direccion = direccion != null ? direccion : "Sin dato";

        this.socialSharing.share(
        'Cliente: ' + cliente + ', ' +
        'Teléfono: ' + telefono + ', ' +
        'Celular: ' + celular + ', ' +
        'Correo: ' + correo + ', ' +
        'Dirección: ' + direccion, 'Cliente:', '','');
    }


    public gLatLng(lat, lng) {
        const coder = new google.maps.Geocoder;
        const lnr = {
            lat: parseFloat(String(lat)),
            lng: parseFloat(String(lng))
        };
        coder.geocode({ location: lnr }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.estasUbicacion = results[0].formatted_address;
                } else {
                }
            } else {
            }
        });
    }

    getLatLong(e) {
        // this.lat =
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        // this.lng =
        this.map.panTo([lat, lng]);
        this.marker.setLatLng([lat, lng]);
        this.gLatLng(lat, lng);
    }

    loadMap() {
        // const lat = this.pedido.direccion.latitud;
        // const lng = this.pedido.direccion.longitud;
        // this.map = new Map("mapId").setView([lat, lng], 16);
        // tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: ''}).addTo(this.map);
        // marker([lat, lng]).addTo(this.map);

        //    Cambio de logica

        setTimeout(() => {
            const lat = this.pedido.direccion.latitud;
            const lng = this.pedido.direccion.longitud;
            this.map = new Map("mapId").setView([lat, lng], 16);
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
            // const myIcon = icon({iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png', iconSize: [45, 41], iconAnchor: [13, 41],});
            this.marker = marker([lat, lng], { draggable: true }).addTo(this.map);
            this.marker.on("dragend", () => {
                this.getLatLong({ latlng: this.marker.getLatLng() });
            });
            setTimeout(() => {
                this.local(lat, lng);
            }, 500);
        }, 500);
    }


    async local(lat, lng) {
        this.map.panTo([lat, lng]);
        this.marker.setLatLng([lat, lng]);
        this.gLatLng(lat, lng);
    }

    private buscarNumeroRepartidor() {
        this.pedidosServicios.numero().subscribe(
            respuesta => {
                this.numeroSolicitud = respuesta.data.valor_cadena;
            },
            () => {
            });
    }
    /**
     * @author Juan Antonio
     * @description Terminar loader
     */
    private loaderCancel() {
        this.loaderBtn = false;
    }
    /**
     * @author Juan Antonio
     * @description Valida el tipo del pedido
     * @param idTipoPedido
     * @returns
     */
    public typeSendMessage(idTipoPedido: number) {
        return (idTipoPedido === 2) ? 'Enviar' : 'Notificar';
    }

    public precioUnitarioParche(cantidad: number, precio: number) {
        return (Number(precio) / Number(cantidad));
    }
}

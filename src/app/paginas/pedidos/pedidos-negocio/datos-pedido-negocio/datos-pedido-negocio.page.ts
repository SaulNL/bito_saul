import { SentNotificationModel } from './../../../../Modelos/OneSignalNotificationsModel/SentNotificationModel';
import { CommonOneSignalModel } from './../../../../Modelos/OneSignalNotificationsModel/CommonOneSignalModel';
import { AppSettings } from './../../../../AppSettings';
import { SentPushNotificationService } from './../../../../api/sent-push-notification.service';
import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../../../api/pedidos.service';
// import {Map, tileLayer, marker, icon, Marker} from 'leaflet';
import { icon, Map, Marker, marker, tileLayer } from "leaflet";
import { Router, ActivatedRoute } from '@angular/router';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';

declare var google: any;

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

    constructor(
        private pedidosServicios: PedidosService,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private notificaciones: ToadNotificacionService,
        private sentPushNotificationService: SentPushNotificationService
    ) {
        this.blnCancelar = false;
        this.loaderBtn = false;
        this.mapView = 'block';
        this.domicilioEnvio = false;
        this.domicilioEnvioMessage = '';
        this.total = 0;
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
                //this.loaderBtn = false;
                pedido.id_estatus_pedido = respuesta.data.id;
                pedido.estatus = respuesta.data.estatus;
                pedido.color = respuesta.data.color;
                pedido.motivo = respuesta.data.motivo;
                this.sendOneSignalNotifications('Se cancelo tu compra en ' + pedido.negocio, 'El negocio cancelo tu compra por el motivo de: ' + this.motivo, pedido.id_persona);
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
                this.sendOneSignalNotifications('El negocio ' + pedido.negocio + ' vio tu pedido y lo esta preparando', 'Tu pedido esta en proceso', pedido.id_persona);
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
                let content = '';
                let header = '';
                if (pedido.id_tipo_pedido === 2) {
                    content = 'El negocio ' + pedido.negocio + ' envío tu pedido, por favor contactalo para saber los detalles del envío';
                    header = 'Tu pedido se envio';
                } else {
                    content = 'Por favor pasa a recogerlo';
                    header = 'Tu pedido se encuentra listo';
                }
                this.sendOneSignalNotifications(content, header, pedido.id_persona);
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
                this.sendOneSignalNotifications('Tu pedido del negocio ' + pedido.negocio + ' se entrego', 'El pedido se entrego con éxito', pedido.id_persona);
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
     * @description Metodo para enviar las notificaciones
     * @param body
     * @param header
     * @param idPersona
     */
    private sendOneSignalNotifications(body: string, header: string, idPersona: string) {
        this.sentPushNotificationService.getUserByPersona(idPersona).subscribe(
            response => {
                this.sentPushNotificationService.getTkn().subscribe(
                    res => {
                        let content = new CommonOneSignalModel(body);
                        let headings = new CommonOneSignalModel(header);
                        let sentNotification = new SentNotificationModel(content, headings, [String(response.data.usuario)], res.data.api); /* Produccion */
                        this.sentPushNotificationService.sentNotification(sentNotification, res.data.tkn).subscribe( /* Produccion */
                            () => {
                                this.loaderCancel();
                            }, () => {
                                this.loaderCancel();
                            }
                        );
                    }, () => {
                        this.loaderCancel();
                    }
                );
            }, () => {
                this.loaderCancel();
            }
        );
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

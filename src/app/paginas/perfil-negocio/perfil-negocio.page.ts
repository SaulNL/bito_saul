import {AppSettings} from './../../AppSettings';
import {Component, EventEmitter, OnInit} from '@angular/core';
import {Map, tileLayer, marker, icon} from 'leaflet';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {NegocioService} from "../../api/negocio.service";
import {Geolocation} from "@capacitor/core";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {Location} from "@angular/common";
import {UtilsCls} from '../../utils/UtilsCls';
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {ActionSheetController} from '@ionic/angular';
import {ModalController} from '@ionic/angular';
import {DenunciaNegocioPage} from './denuncia-negocio/denuncia-negocio.page';
import {Plugins} from '@capacitor/core';
import {CalificarNegocioComponent} from '../../componentes/calificar-negocio/calificar-negocio.component';
import {ProveedorServicioService} from '../../api/busqueda/proveedores/proveedor-servicio.service';
import {DetalleProductoComponent} from "../../componentes/detalle-producto/detalle-producto.component";
import {PedidoNegocioComponent} from "../../componentes/pedido-negocio/pedido-negocio.component";

const {Share} = Plugins;
const haversineCalculator = require('haversine-calculator');


@Component({
    selector: 'app-perfil-negocio',
    templateUrl: './perfil-negocio.page.html',
    styleUrls: ['./perfil-negocio.page.scss'],
})
export class PerfilNegocioPage implements OnInit {
    public seccion: any;
    public map: Map;
    public negocio: string;
    public informacionNegocio: any;
    public loader: boolean;
    public miLat: any;
    public miLng: any;
    public permisoUbicacionCancelado: boolean;
    public distanciaNegocio: string;
    public existeSesion: boolean;
    url = `${AppSettings.URL_FRONT}`;
    public url_negocio: string;
    public estatusCalificacion: boolean;
    public hoy: number;
    public estatus: { tipo: number; mensaje: string };
    public motrarContacto = true;

    public diasArray = [
        {id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null},
        {id: 2, dia: 'Martes', horarios: [], hi: null, hf: null},
        {id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null},
        {id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null},
        {id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null},
        {id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null},
        {id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null},
    ];
    private detalle: any;
    private bolsa: Array<any>;

    constructor(
        private navctrl: NavController,
        private route: ActivatedRoute,
        private toadController: ToastController,
        private negocioService: NegocioService,
        private notificacionService: ToadNotificacionService,
        private location: Location,
        private util: UtilsCls,
        private sideBarService: SideBarService,
        private actionSheetController: ActionSheetController,
        private _router: Router,
        public modalController: ModalController,
        private serviceProveedores: ProveedorServicioService,
        public alertController: AlertController
    ) {
        this.seccion = 'ubicacion';
        this.loader = true;
        this.existeSesion = util.existe_sesion();
        this.estatusCalificacion = true;
        this.bolsa = [];
    }

    ngOnInit() {
        this.sideBarService.getObservable().subscribe((data) => {
            this.existeSesion = this.util.existe_sesion();
        });
        this.route.params.subscribe(params => {
            this.negocio = params.negocio;
        });
        if (this.negocio !== undefined && this.negocio !== null && this.negocio !== '') {
            this.obtenerInformacionNegocio();
        } else {
            this.notificacionService.error('Ocurrio un error con este negocio');
            this.location.back();
        }
        this.getCurrentPosition();

    }

    async getCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition().then(res => {
            this.miLat = res.coords.latitude;
            this.miLng = res.coords.longitude;
            // const start = {
            //     latitude: this.miLat,
            //     longitude: this.miLng
            // };
            // const end = {
            //     latitude: this.informacionNegocio.latitud,
            //     longitude: this.informacionNegocio.longitud
            // };              
            // const dis = haversineCalculator(start, end);
            // this.distanciaNegocio = dis.toFixed(2);
                  
        }).catch(error => {
                this.permisoUbicacionCancelado = true;
            }
        );
    }

    obtenerInformacionNegocio() {
        this.loader = true;
        this.negocioService.obteneretalleNegocio(this.negocio).subscribe(
            response => {
                if (response.data !== null) {
                    this.informacionNegocio = response.data;
                    this.informacionNegocio.catProductos = [];
                    this.informacionNegocio.catServicos = [];
                    // this.obtenerPromociones();
                    this.obtenerProductos();
                    this.obtenerServicios();
                    this.obtenerEstatusCalificacion();

                    this.horarios(this.informacionNegocio);
                    this.calcularDistancia();
                    
                }
                this.loader = false;
                setTimeout(it => {
                    this.loadMap()
                }, 100)

            },
            error => {
                confirm('Error al cargar');
                this.loader = false;
            }
        );
    }

    obtenerProductos() {
        this.negocioService.obtenerDetalleDeNegocio(this.informacionNegocio.id_negocio, 0).subscribe(
            response => {
                if (response.code === 200 && response.agrupados != null) {
                    const productos = response.agrupados;
                    const cats = [];

                    if (productos !== undefined) {
                        productos.map(catprod => {

                            if (catprod.activo) {

                                const productos3 = [];
                                catprod.productos.map(pro => {
                                    if (pro.existencia) {
                                        productos3.push(pro);
                                    }
                                });
                                catprod.productos = productos3;

                                if (productos3.length > 0) {
                                    cats.push(catprod);
                                }
                            }

                        });
                        this.informacionNegocio.catProductos = cats;

                    }
                }
                if (response.code === 200) {
                    this.informacionNegocio.cartaProducto = response.data.cartaProducto;
                    this.informacionNegocio.cartaServicio = response.data.cartaServicio;
                    this.informacionNegocio.tagsProductos = response.data.productoTags;
                    this.informacionNegocio.tagsServicios = response.data.serviciosTags;
                }
            },
            error => {
                confirm('Error al o¿btener los productos');
            });
    }

    obtenerServicios() {
        this.negocioService.obtenerDetalleDeNegocio(this.informacionNegocio.id_negocio, 1).subscribe(
            response => {
                if (response.code === 200 && response.agrupados != null) {
                    const servicios = response.agrupados;
                    const cats = [];

                    if (servicios !== undefined) {
                        servicios.map(catprod => {

                            if (catprod.activo) {

                                const servicios3 = [];
                                catprod.servicios.map(ser => {
                                    if (ser.existencia) {
                                        servicios3.push(ser);
                                    }
                                });
                                catprod.servicios = servicios3;

                                if (servicios3.length > 0) {
                                    cats.push(catprod);
                                }
                            }

                        });
                        this.informacionNegocio.catServicos = cats;
                    }
                }
            },
            error => {
                confirm('Error al o¿btener los servicios');
            });
    }

    loadMap() {
        const lat = this.informacionNegocio.det_domicilio.latitud;
        const lng = this.informacionNegocio.det_domicilio.longitud;
        this.map = new Map("mapId").setView([lat, lng], 16);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: ''}).addTo(this.map);

        var myIcon = icon({
            iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
            iconSize: [45, 41],
            iconAnchor: [13, 41],
        });


        marker([lat, lng], {icon: myIcon}).addTo(this.map)
    }


    async configToad(mensaje) {
        const toast = await this.toadController.create({
            color: 'red',
            duration: 2000,
            message: mensaje
        });
        return await toast.present();
    }


    cambio() {
        if (this.seccion === 'ubicacion') {
            setTimeout(it => {
                this.loadMap()
            }, 100)
        }
    }

    irAlDetalle(producto: any) {
        this.detalle = producto;
        this.abrirModaldetalle()
    }

    enviarWhasapp(celular: any) {
        this.abrirVentana('https://api.whatsapp.com/send?phone=+52' + celular)
    }

    llamar(telefono) {
        this.abrirVentana('tel:' + telefono);
    }

    abrirVentana(ruta) {
        window.open(ruta, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=400,height=400");
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Negocio',
            buttons: [
                {
                    text: 'Denunciar',
                    icon: 'receipt-outline',
                    handler: () => {
                        this.abrirModalDenuncia();
                    }
                },
                {
                    text: 'Compartir',
                    icon: 'share-social-outline',
                    handler: () => {
                        this.compartir();
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                    }
                }]

        });
        await actionSheet.present();
    }

    async abrirModalDenuncia() {
        const modal = await this.modalController.create({
            component: DenunciaNegocioPage,
            componentProps: {
                idNegocio: this.informacionNegocio.id_negocio
            }
        });
        await modal.present();
    }

    async abrirModaldetalle() {
        const modal = await this.modalController.create({
            component: DetalleProductoComponent,
            componentProps: {
                datos: this.detalle,
                _entregaDomicilio: this.informacionNegocio.entrega_domicilio,
                _entregaSitio: this.informacionNegocio.entrega_sitio,
                _consumoSitio: this.informacionNegocio.consumo_sitio
            }
        });
        await modal.present()
        await modal.onDidDismiss().then(r => {
            if (r.data.data !== undefined) {
                this.llenarBolsa(r.data.data);
            }
        });

    }

    async abrirModalpedido() {
        const modal = await this.modalController.create({
            component: PedidoNegocioComponent,
            componentProps: {
                lista: this.bolsa,
                _entregaDomicilio: this.informacionNegocio.entrega_domicilio,
                _entregaSitio: this.informacionNegocio.entrega_sitio,
                _consumoSitio: this.informacionNegocio.consumo_sitio
            }
        });
        await modal.present()
        await modal.onDidDismiss().then(r => {
            if (r.data.data !== undefined) {
                this.bolsa = r.data.data
            }
        });
    }

    async compartir() {
        this.url_negocio = this.url + this.informacionNegocio.url_negocio;
        await Share.share({
            title: 'Ver cosas interesantes',
            text: 'Te recomiendo este negocio ' + this.informacionNegocio.nombre_comercial,
            url: this.url_negocio,
            dialogTitle: 'Compartir con Amigos'
        })
            .then(() => this.notificacionService.exito('Se compartio exitosamente'))
            .catch((error) => this.notificacionService.error(error));
    }

    async abrirModalCalifica() {
        const modal = await this.modalController.create({
            component: CalificarNegocioComponent,
            componentProps: {
                actualTO: this.informacionNegocio
            }
        });
        await modal.present();
        const {data} = await modal.onDidDismiss();
        if (data !== undefined) {
            this.informacionNegocio.numCalificaciones = data.numCalificaciones;
            this.informacionNegocio.promedio = data.promedio;
            this.obtenerEstatusCalificacion();
        }
    }

    /**
     * funcion para obtener el estatus de la calificacion
     * @author Omar
     */
    obtenerEstatusCalificacion() {
        //  this.loaderEstatusCalifi = true;
        if (this.existeSesion) {
            this.serviceProveedores.obtenerEstatusCalificacionUsuario(this.informacionNegocio).subscribe(
                response => {
                    if (response.code === 200) {
                        this.estatusCalificacion = true;
                        this.valorEstrellas();
                    } else {
                        this.estatusCalificacion = false;
                        this.valorEstrellas();
                    }
                },
                error => {
                    //      this.loaderEstatusCalifi = false;
                }, () => {
                    //     this.loaderEstatusCalifi = false;
                });
        } else {
            this.estatusCalificacion = false;
            //   this.loaderEstatusCalifi = false;
        }
    }

    valorEstrellas() {
        setTimeout(it => {
            let numeroEstrella = this.informacionNegocio.promedio.toString();
            let estrellas = <any>document.getElementsByName('estrellas');
            for (let i = 0; i < estrellas.length; i++) {
                if (estrellas[i].value === numeroEstrella) {
                    let estrellaValor = estrellas[i];
                    estrellaValor.setAttribute('checked', true);
                }
            }
        }, 500);
    }

    private horarios(negocio: any) {

        this.estatus = {tipo: 0, mensaje: 'No abre hoy'};

        const hros = negocio.horarios;
        let hoy: any;
        hoy = new Date();
        this.hoy = hoy.getDay() !== 0 ? hoy.getDay() : 7;
        const diasArray = JSON.parse(JSON.stringify(this.diasArray));
        if (hros !== undefined) {
            hros.forEach(horarioTmp => {

                diasArray.map(dia => {
                    if (horarioTmp.dias.includes(dia.dia) && horarioTmp.hora_inicio !== undefined && horarioTmp.hora_fin !== undefined) {
                        const dato = {
                            texto: horarioTmp.hora_inicio + ' a ' + horarioTmp.hora_fin,
                            hi: horarioTmp.hora_inicio,
                            hf: horarioTmp.hora_fin
                        };
                        dia.horarios.push(dato);
                    }
                });

            });

            diasArray.map((dia) => {

                if (dia.id === this.hoy) {
                    const now = new Date(1995, 11, 18, hoy.getHours(), hoy.getMinutes(), 0, 0);
                    let abieto = null;
                    let index = null;
                    const listaAux = [];
                    if (dia.horarios.length !== 0) {
                        dia.horarios.map((item, i) => {
                            const inicio = item.hi.split(':');
                            // tslint:disable-next-line:radix
                            const fi = new Date(1995, 11, 18, parseInt(inicio[0]), parseInt(inicio[1]), 0, 0);
                            const fin = item.hf.split(':');
                            let aux = 18;
                            // tslint:disable-next-line:radix
                            if (parseInt(inicio[0]) > parseInt(fin[0])) {
                                aux = 19;
                            }
                            // tslint:disable-next-line:radix
                            const ff = new Date(1995, 11, aux, parseInt(fin[0]), parseInt(fin[1]), 0, 0);
                            listaAux.push({valor: ((fi.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), index: i});
                            if (now >= fi && now <= ff) {
                                abieto = true;
                                index = i;
                            }
                        });
                        if (abieto) {
                            this.estatus = {tipo: 1, mensaje: 'Cierra a las ' + dia.horarios[index].hf};
                        } else {
                            let listaValores: Array<number> = [];
                            let siHay = false;
                            listaAux.map(item => {
                                listaValores.push(item.valor);
                                if (item.valor > 0) {
                                    siHay = true;
                                }
                            });
                            if (siHay) {
                                listaValores = listaValores.filter(item => {
                                    return item >= 0;
                                });
                            }
                            const valor = Math.min.apply(null, listaValores);
                            const valorMax = Math.max.apply(null, listaValores);
                            if (valor > 0) {
                                listaAux.map(item => {
                                    if (item.valor === valor) {
                                        index = item.index;
                                    }
                                });
                                this.estatus = {tipo: 0, mensaje: 'Abre a las ' + dia.horarios[index].hi};
                            } else {
                                listaAux.map(item => {
                                    if (item.valor === valorMax) {
                                        index = item.index;
                                    }
                                });
                                this.estatus = {tipo: 0, mensaje: 'Cerró a las ' + dia.horarios[index].hf};
                            }
                        }
                    } else {
                        this.estatus = {tipo: 0, mensaje: 'No abre hoy'};
                    }
                }
            });
            this.diasArray = diasArray;
            console.log(this.diasArray);
        }
    }

    private llenarBolsa(dato) {
        let existe = false;
        this.bolsa.map(it => {
            if (it.idProducto === dato.idProducto) {
                existe = true;
                it.cantidad ++;
            }
        });

        if (!existe) {
            this.bolsa.push(dato);
        }
    }

    salir() {
        if (this.bolsa.length > 0) {
            this.mensajeBolsa()
        } else {
            this.navctrl.back();
        }
    }

    async mensajeBolsa() {
        const alert = await this.alertController.create({
            header: 'Advertencia',
            message: 'Message <strong>¿Estas seguro de salir?... tu bolsa se perderá </strong>!!!',
            buttons: [
                {
                    text: 'Cancelar',
                }, {
                    text: 'Salir',
                    handler: () => {
                        this.bolsa = [];
                        this.navctrl.back();
                    }
                }
            ]
        });

        await alert.present();
    }
    calcularDistancia(){
        const start = {
            latitude: this.miLat,
            longitude: this.miLng
        };
        const end = {
            latitude: this.informacionNegocio.latitud,
            longitude: this.informacionNegocio.longitud
        };              
        const dis = haversineCalculator(start, end);
        this.distanciaNegocio = dis.toFixed(2);
    }
}

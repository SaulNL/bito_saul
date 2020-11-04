import { AppSettings } from './../../AppSettings';
import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { NegocioService } from "../../api/negocio.service";
import { Geolocation } from "@capacitor/core";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Location } from "@angular/common";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DenunciaNegocioPage } from './denuncia-negocio/denuncia-negocio.page';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;


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
    public existeSesion: boolean;
    url = `${AppSettings.URL_FRONT}`;
    public url_negocio: string;

    constructor(
        private route: ActivatedRoute,
        private toadController: ToastController,
        private negocioService: NegocioService,
        private notificacionService: ToadNotificacionService,
        private location: Location,
        private util: UtilsCls,
        private sideBarService: SideBarService,
        private actionSheetController: ActionSheetController,
        private _router: Router,
        public modalController: ModalController
    ) {
        this.seccion = 'ubicacion';
        this.loader = true;
        this.existeSesion = util.existe_sesion();
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
                        console.log(cats)
                    }
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
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);

        var myIcon = icon({
            iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
            iconSize: [45, 41],
            iconAnchor: [13, 41],
        });


        marker([lat, lng], { icon: myIcon }).addTo(this.map)
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
                        //   this._router.navigate(['/tabs/cambio-contrasenia']);
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
    async compartir() {
        this.url_negocio = this.url + this.informacionNegocio.url_negocio;
        await Share.share({
            title: 'Ver cosas interesantes',
            text: 'Te recomiento este negocio' + this.informacionNegocio.nombre_comercial,
            url: this.url_negocio,
            dialogTitle: 'Compartir con Amigos'
        })
            .then(() => this.notificacionService.exito('Se compartio exitosamente'))
            .catch ((error) => this.notificacionService.error(error));
    }
}

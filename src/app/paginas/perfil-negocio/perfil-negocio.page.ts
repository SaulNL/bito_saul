import {Component, OnInit} from '@angular/core';
import {Map, tileLayer, marker} from 'leaflet';
import {ActivatedRoute} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {NegocioService} from "../../api/negocio.service";

@Component({
    selector: 'app-perfil-negocio',
    templateUrl: './perfil-negocio.page.html',
    styleUrls: ['./perfil-negocio.page.scss'],
})
export class PerfilNegocioPage implements OnInit {
    seccion: any;
    map: Map;
    public negocio: string;
    public informacionNegocio: any;
    public loader: boolean;

    constructor(
        private route: ActivatedRoute,
        private toadController: ToastController,
        private negocioService: NegocioService,
    ) {
        this.seccion = 'ubicacion'
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.negocio = params.negocio;
        });

        if (this.negocio !== undefined) {
            this.obtenerInformacionNegocio();
        }
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

    // The below function is added
    loadMap() {
        const lat = this.informacionNegocio.det_domicilio.latitud;
        const lng = this.informacionNegocio.det_domicilio.longitud;
        this.map = new Map("mapId").setView([lat, lng], 16);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: ''}).addTo(this.map);
        marker([lat, lng], {
            draggable:
                true
        }).addTo(this.map)
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
}

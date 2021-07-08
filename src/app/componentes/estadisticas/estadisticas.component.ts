import {Component, Input, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {FiltroEstadisticaModel} from '../../Modelos/FiltroEstadisticaModel';
import {NegocioService} from '../../api/negocio.service';
import {ToadNotificacionService} from '../../api/toad-notificacion.service';
import {PopoverVistasComponent} from './popover-vistas/popover-vistas.component';
import * as moment from 'moment';

@Component({
    selector: 'app-estadisticas',
    templateUrl: './estadisticas.component.html',
    styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit {
    @Input() public idNegocio: any;
    public filtroGrafica: FiltroEstadisticaModel;
    public totalVisitasQR: number;
    public totalVisitasURL: number;
    public totalLikesNegocio: number;
    public calificacionBuena: number;
    public calificacionMedia: number;
    public calificacionBaja: number;
    public totalSolicitudes: number;
    public solicitudes: any;
    public totalPromociones: number;
    public promociones: any;
    public totalProductos: number;
    public productos: any;

    constructor(
        private modalController: ModalController,
        private servicioNegocio: NegocioService,
        private notificaciones: ToadNotificacionService,
        private popoverController: PopoverController
    ) {
        this.filtroGrafica = new FiltroEstadisticaModel();
        this.totalVisitasQR = 0;
        this.totalVisitasURL = 0;
        this.totalLikesNegocio = 0;
        this.calificacionBuena = 0;
        this.calificacionMedia = 0;
        this.calificacionBaja = 0;
        this.totalSolicitudes = 0;
        this.solicitudes = [];
        this.totalPromociones = 0;
        this.promociones = [];
        this.totalProductos = 0;
        this.productos = [];
    }

    ngOnInit() {
        this.filtroGrafica.id_negocio = this.idNegocio;
        this.obtenerTodasEstadisticas();
    }

    public obtenerTodasEstadisticas(){
        this.obtenerVisitasQR();
        this.obtenerVisitasUrl();
        this.obtenerLikesNegocio();
        this.obtenerCalificacionesNegocio();
        this.obtenerSolicitudesNegocio();
        this.obtenerPromocionesNegocio();
        this.obtenerLikesProductosNegocio();
    }

    public filtroEstadistica(evento){
        let filtro;
        filtro = evento.detail.value;

        let newMoment = moment();
        let hoy = newMoment.format(moment.HTML5_FMT.DATE);

        switch (filtro) {
            case 'hoy':
                this.filtroGrafica.fecha_inicio = hoy;
                this.filtroGrafica.fecha_final = hoy;
                this.obtenerTodasEstadisticas();
                break;
            case 'siete':
                const fechaInicio7 = moment().subtract(7,'d');
                this.filtroGrafica.fecha_inicio = fechaInicio7.format(moment.HTML5_FMT.DATE);
                this.filtroGrafica.fecha_final = hoy;
                this.obtenerTodasEstadisticas();
                break;
            case 'treinta':
                const fechaInicio30 = moment().subtract(30,'d');
                this.filtroGrafica.fecha_inicio = fechaInicio30.format(moment.HTML5_FMT.DATE);
                this.filtroGrafica.fecha_final = hoy;
                this.obtenerTodasEstadisticas();
                break;
            case 'todo':
                this.filtroGrafica.fecha_inicio = null;
                this.filtroGrafica.fecha_final = null;
                this.obtenerTodasEstadisticas();
                break;
        }
    }

    public obtenerVisitasQR() {
        this.servicioNegocio.estadisticaVisitasQR(this.filtroGrafica).subscribe(
            response => {
                this.totalVisitasQR = response.data.numero_visto;
                if (response.data.numero_visto === 0) {
                    this.totalVisitasQR = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerVisitasUrl() {
        this.servicioNegocio.estadisticaVisitasURL(this.filtroGrafica).subscribe(
            response => {
                this.totalVisitasURL = response.data.numero_visto;
                if (response.data.numero_visto === undefined) {
                    this.totalVisitasURL = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerLikesNegocio() {
        this.servicioNegocio.estadisticaLikesNegocio(this.filtroGrafica).subscribe(
            response => {
                this.totalLikesNegocio = response.data.numero_likes;
                if (response.data.numero_likes === undefined) {
                    this.totalLikesNegocio = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerCalificacionesNegocio() {
        this.servicioNegocio.estadisticaComentariosNegocio(this.filtroGrafica).subscribe(
            response => {
                this.calificacionBuena = response.data.calificacion_buena;
                this.calificacionMedia = response.data.calificacion_media;
                this.calificacionBaja = response.data.calificacion_baja;
                if (response.data.total_califaciones === 0) {
                    this.calificacionBuena = 0;
                    this.calificacionMedia = 0;
                    this.calificacionBaja = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerSolicitudesNegocio() {
        this.servicioNegocio.estadisticaSolicitudesNegocio(this.filtroGrafica).subscribe(
            response => {
                this.totalSolicitudes = response.data.length;
                this.solicitudes = response.data;
                if (this.totalSolicitudes === 0) {
                    this.solicitudes = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerPromocionesNegocio() {
        this.servicioNegocio.estadisticaPromocionesNegocio(this.filtroGrafica).subscribe(
            response => {
                    this.totalPromociones = response.data.length;
                    this.promociones = response.data;
                    if (this.totalPromociones === 0) {
                    this.totalPromociones = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    public obtenerLikesProductosNegocio() {
        this.servicioNegocio.estadisticaVistasProductosNegocio(this.filtroGrafica).subscribe(
            response => {
                this.totalProductos = response.data.length;
                this.productos = response.data;
                if (this.totalProductos === 0) {
                    this.totalProductos = 0;
                }
            },
            error => {
                this.notificaciones.error(error);
            }
        );
    }

    async infoVistas(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverVistasComponent,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true,
            componentProps: {
                visitasQR: this.totalVisitasQR,
                visitasURL: this.totalVisitasURL
            },
        });
        await popover.present();

        const { role } = await popover.onDidDismiss();

    }

    cerrarModal() {
        this.modalController.dismiss();
    }

}

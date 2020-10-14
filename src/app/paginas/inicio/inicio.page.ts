import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from "@ionic/angular";
import { BusquedaService } from "../../api/busqueda.service";
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { Router } from "@angular/router";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { PromocionesService } from '../../api/busqueda/proveedores/promociones.service';
import { FormControl } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'inicio.page.html',
    styleUrls: ['inicio.page.scss']
})
export class InicioPage implements OnInit {
    private loaderPrincipal: HTMLIonLoadingElement;
    private Filtros: FiltrosModel;
    public listaCategorias: any;
    private modal: any;
    public anyFiltros: FiltrosModel;
    strBuscar: any;
    public filterMunicipio = new FormControl();
    public miUbicacionlatitud: number;
    public miUbicacionlongitud: number;
    public kilometrosView: number;
    public tipoNegocio: any;
    public tipoProducto: any;
    public entregaDomicilio: boolean;
    lstPromociones: any;
    public lstAvisos: any;
    public listaPrueba: any;
    promocionDefault: any;
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
    };
    @ViewChild('mySlider') slides: IonSlides;
    constructor(
        public loadingController: LoadingController,
        private _router: Router,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private modalController: ModalController,
        private notificaciones: ToadNotificacionService,
        private servicioPromociones: PromocionesService
    ) {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
        this.lstPromociones = [];
        this.listaPrueba = [];
    }

    ngOnInit(): void {
        this.buscarNegocios();
        this.obtenerPromociones();
        this.obtenerAvisos();
    }
    swipeNext() {
        this.slides.slideNext();
    }
    swipePrev() {
        this.slides.slidePrev();
    }
    buscarNegocios() {
        this.presentLoading().then(a => { });
        this.principalSercicio.obtenerDatos(this.Filtros).subscribe(
            respuesta => {
                this.listaCategorias = respuesta.data;
                this.loaderPrincipal.onDidDismiss();
            },
            error => {

                this.notificaciones.error('Error al buscar los datos')
                this.loaderPrincipal.onDidDismiss();
            }
        );
    }

    async presentLoading() {
        this.loaderPrincipal = await this.loadingController.create({
            message: 'Cargando. . .',
            duration: 1000
        });
        return await this.loaderPrincipal.present();
    }


    async configToad(mensaje) {
        const toast = await this.toadController.create({
            color: 'dark',
            duration: 2000,
            message: mensaje
        });
        return await toast.present();
    }

    buscarToolbar(event) {
        this.Filtros.strBuscar = event;
        this.buscarNegocios();
    }

    abrirFiltros() {
        this.presentModal();
    }

    async presentModal() {
        let eventEmitter = new EventEmitter();
        eventEmitter.subscribe(res => {
            this.modal.dismiss({
                'dismissed': true
            });
            this.Filtros = res;
            console.log(res);
            this.buscarNegocios();
        });
        this.modal = await this.modalController.create({
            component: FiltrosBusquedaComponent,
            componentProps: {
                buscarPorFiltros: eventEmitter,
                filtros: this.Filtros
            }
        });
        return await this.modal.present();
    }
    /**
      * Funcion para obtener las promociones
      * @author Omar
      */
    public obtenerPromociones() {
        // this.loaderPromo = true;
        this.anyFiltros = new FiltrosModel(this.strBuscar,
            null, this.filterMunicipio.value, this.kilometrosView,
            this.miUbicacionlatitud, this.miUbicacionlongitud, this.tipoNegocio, this.tipoProducto, this.entregaDomicilio);

        this.servicioPromociones.buscarPromocinesPublicadasFiltros(this.anyFiltros).subscribe(
            response => {
                this.lstPromociones = response.data;
                //this.loaderPromo = false;
            },
            error => {
                // this._notificacionService.pushError(error);
            }
        );
    }
    /**
       * Funcion para obtener avisos
    */
    public obtenerAvisos() {
        // this.loaderPromo = true;
        this.servicioPromociones.obtenerAvisos().subscribe(
            response => {
                this.lstAvisos = response.data;
                // this.loaderPromo = false;
            },
            error => {
                //this._notificacionService.pushError(error);
            }
        );
    }
}

import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from "@ionic/angular";
import { BusquedaService } from "../../api/busqueda.service";
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { FormControl } from '@angular/forms';



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
    constructor(
        public loadingController: LoadingController,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private modalController: ModalController,
        private notificaciones: ToadNotificacionService
    ) {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
    }

    ngOnInit(): void {
        this.buscarNegocios();
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
}

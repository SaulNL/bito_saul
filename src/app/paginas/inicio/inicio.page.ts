import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController, MenuController, ModalController, ToastController } from "@ionic/angular";
import { BusquedaService } from "../../api/busqueda.service";
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { MapaNegociosComponent } from '../../componentes/mapa-negocios/mapa-negocios.component';



@Component({
    selector: 'app-tab3',
    templateUrl: 'inicio.page.html',
    styleUrls: ['inicio.page.scss']
})
export class InicioPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    public cordenada: number;
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
    private seleccionado: any;
    loader: any;
    constructor(
        public loadingController: LoadingController,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private modalController: ModalController,
        private notificaciones: ToadNotificacionService,
        private route: ActivatedRoute
    ) {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
    }

    ngOnInit(): void {
        this.buscarNegocios();
        this.route.queryParams.subscribe(params => {
            if (params && params.special) {
                if (params.special) {
                    this.Filtros = new FiltrosModel();
                    this.Filtros.idEstado = 29;
                    this.listaCategorias = [];
                    this.buscarNegocios();
                }
            }
        }
        )
    }
    buscarNegocios() {
        this.loader = true;
        this.principalSercicio.obtenerDatos(this.Filtros).subscribe(
            respuesta => {
                this.listaCategorias = respuesta.data;
                this.loader = false;
            },
            error => {
                this.notificaciones.error('Error al buscar los datos')
                this.loader = false;
            }
        );
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

    private buscarSeleccionado(seleccionado: any) {
        this.seleccionado = seleccionado;
        this.Filtros = new FiltrosModel();
        this.Filtros.idCategoriaNegocio = [seleccionado.id_categoria];
        this.Filtros.idGiro = [seleccionado.idGiro];
        this.buscarNegocios();
    }

    async abrirModalMapa() {
        let listaIds = [68, 95, 116, 52, 155, 20, 142];
        const modal = await this.modalController.create({
            component: MapaNegociosComponent,
            componentProps: {
                listaIds: listaIds
            }
        });
        await modal.present();
    }
}

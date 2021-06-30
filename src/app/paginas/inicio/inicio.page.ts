import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {IonContent, LoadingController, MenuController, ModalController, ToastController} from "@ionic/angular";
import {BusquedaService} from "../../api/busqueda.service";
import {FiltrosModel} from '../../Modelos/FiltrosModel';
import {FiltrosBusquedaComponent} from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {MapaNegociosComponent} from '../../componentes/mapa-negocios/mapa-negocios.component';
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {Router} from "@angular/router";
import {ProveedorServicioService} from "../../api/busqueda/proveedores/proveedor-servicio.service";
import {UtilsCls} from "../../utils/UtilsCls";
import {MsNegocioModel} from 'src/app/Modelos/busqueda/MsNegocioModel';

@Component({
    selector: 'app-tab3',
    templateUrl: 'inicio.page.html',
    styleUrls: ['inicio.page.scss'],
    providers: [
        SideBarService
    ]
})
export class InicioPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    public cordenada: number;
    private Filtros: FiltrosModel;
    public listaCategorias: any;
    private modal: any;
    public anyFiltros: FiltrosModel;
    strBuscar: any;
    private seleccionado: any;
    loader: any;
    listaIdsMapa: any;
    filtroActivo: boolean;
    user: any;
    public existeSesion: boolean;

    constructor(
        public loadingController: LoadingController,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private modalController: ModalController,
        private notificaciones: ToadNotificacionService,
        private route: ActivatedRoute,
        private eventosServicios: SideBarService,
        private ruta: Router,
        private serviceProveedores: ProveedorServicioService,
        private util: UtilsCls
    ) {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.filtroActivo = false;
        this.listaCategorias = [];
        this.listaIdsMapa = [];
        this.user = this.util.getUserData();
        this.existeSesion = this.util.existe_sesion();
    }

    ngOnInit(): void {
        this.user = this.util.getUserData();
        this.eventosServicios.eventBuscar().subscribe((data) => {
            this.buscarNegocios();
        });
        this.buscarNegocios();

    }

    ionViewWillEnter() {

        let categoria = localStorage.getItem('seleccionado');
        if (this.filtroActivo === false) {
            localStorage.setItem('resetFiltro', '0');
        }
        let estatusFiltro = localStorage.getItem('resetFiltro');
        if (categoria !== null) {
            this.filtroActivo = true;
            const dato = JSON.parse(categoria);
            localStorage.setItem('resetFiltro', '1');
            estatusFiltro = localStorage.getItem('resetFiltro');
            this.Filtros = new FiltrosModel();
            this.Filtros.idGiro = [(dato.idGiro != null) ? dato.idGiro : 1];
            this.Filtros.idCategoriaNegocio = [dato.id_categoria];
            this.buscarNegocios();
            localStorage.removeItem('seleccionado');
        }
        if (categoria === null && estatusFiltro === '0') {
            if (this.Filtros.abierto === null &&
                this.Filtros.blnEntrega === null &&
                this.Filtros.idEstado === 29 &&
                this.Filtros.idCategoriaNegocio === null &&
                this.Filtros.idGiro === null &&
                this.Filtros.idLocalidad === null &&
                this.Filtros.idMunicipio === null &&
                this.Filtros.idTipoNegocio === null &&
                this.Filtros.intEstado === 0 &&
                this.Filtros.kilometros === 10 &&
                this.Filtros.latitud === 0 &&
                this.Filtros.longitud === 0 &&
                this.Filtros.strBuscar === '' &&
                this.Filtros.strMunicipio === '' &&
                this.Filtros.tipoBusqueda === 0) {
            } else {
                this.borrarFiltros();
            }
        }
    }

    buscarNegocios() {
        this.loader = true;
        const usr = this.user;
        if (usr.id_persona !== undefined) {
            this.Filtros.id_persona = usr.id_persona;
        }
        this.principalSercicio.obtenerDatos(this.Filtros).subscribe(
            respuesta => {
                this.listaCategorias = respuesta.data;
                this.negociosIdMapa();
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
        this.Filtros = new FiltrosModel();
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
            this.filtroActivo = true;
            this.Filtros = res;
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
        //  let listaIds = [68, 95, 116, 52, 155, 20, 142];
        const modal = await this.modalController.create({
            component: MapaNegociosComponent,
            componentProps: {
                listaIds: this.listaIdsMapa
            }
        });
        await modal.present();
    }

    negociosIdMapa() {
        let listaIdNegocio = [];
        let listaIds = [];
        this.listaCategorias.map(l => {
            l.negocios.map(n => {
                listaIds.push(n);
            });
        });
        for (let index = 0; index < listaIds.length; index++) {
            listaIdNegocio.push(listaIds[index].id_negocio);
        }
        this.listaIdsMapa = listaIdNegocio;
    }

    borrarFiltros() {
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.Filtros.idGiro = (this.Filtros.idGiro!= null ) ? this.Filtros.idGiro : [1];
        this.filtroActivo = false;
        this.buscarNegocios();
    }

    negocioRuta(negocioURL) {
        if (negocioURL == "") {
            this.notificaciones.error('Este negocio aún no cumple los requisitos mínimos');
        } else {
            this.ruta.navigate(['/tabs/negocio/' + negocioURL]);
        }
    }

    public darLikes(proveedor: MsNegocioModel) {
        if (this.user.id_persona !== undefined) {
            this.serviceProveedores.darLike(proveedor, this.user).subscribe(
                response => {
                    if (response.code === 200) {
                        proveedor.likes = response.data;
                        this.notificaciones.exito(response.message);
                    } else {
                        this.notificaciones.alerta(response.message);
                    }

                },
                error => {
                });
        }
    }
}

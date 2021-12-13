import {AfiliacionPlazaModel} from '../../Modelos/AfiliacionPlazaModel';
import {Component, OnInit} from "@angular/core";
import {PromocionesService} from "../../api/promociones.service";
import {LoadingController, Platform} from "@ionic/angular";
import {FiltrosService} from "../../api/filtros.service";
import {ProveedorServicioService} from "../../api/proveedor-servicio.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {ActivatedRoute} from "@angular/router";
/* Modelos */
import {PromocionesModel} from "../../Modelos/PromocionesModel";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {UtilsCls} from "../../utils/UtilsCls";

@Component({
    selector: "app-tab2",
    templateUrl: "promociones.page.html",
    styleUrls: ["promociones.page.scss"],
})
export class PromocionesPage implements OnInit {
    private loaderPrincipal: HTMLIonLoadingElement;
    public lstPromociones: Array<PromocionesModel>;
    public anyFiltros: FiltrosModel;
    public loader: boolean = false;
    private Filtros: FiltrosModel;
    public listaCategorias: any;
    public blnBtnMapa: boolean;
    public blnBtnMap: boolean;
    public idGiro: any;
    public mostrarDetalle: boolean;
    public lstCatTipoNegocio: Array<any>;
    public imagenSeparadorCategoria: string;
    public mensaje: string;
    public banner: string;
    public cargando = 'Cargando';
    private plazaAfiliacion: AfiliacionPlazaModel | null;
    public isIOS: boolean = false;
    public idPersona: number | null;

    constructor(
        private _promociones: PromocionesService,
        public loadingController: LoadingController,
        private filtrosService: FiltrosService,
        private serviceProveedores: ProveedorServicioService,
        public _notificacionService: ToadNotificacionService,
        private active: ActivatedRoute,
        private platform: Platform,
        private utils : UtilsCls
    ) {
        this.idPersona = null;
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
        this.blnBtnMapa = true;
        this.blnBtnMap = true;
        this.idGiro = null;
        this.mostrarDetalle = false;
        this.isIOS = this.platform.is('ios');
    }

    ngOnInit(): void {
        this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;
        if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
            localStorage.setItem("isRedirected", "true");
            location.reload();
        }
        this.loader = true;
        this.anyFiltros = new FiltrosModel();
        this.lstPromociones = new Array<PromocionesModel>();
        this.anyFiltros.kilometros = 1;
        this.anyFiltros.idEstado = 29;
        this.lstCatTipoNegocio = new Array<any>();
        this.obtenerPromociones();
        this.active.queryParams.subscribe((params) => {
            if (params && params.special) {
                if (params.special) {
                    this.loader = true;
                    this.anyFiltros = new FiltrosModel();
                    this.lstPromociones = new Array<PromocionesModel>();
                    this.anyFiltros.kilometros = 1;
                    this.anyFiltros.idEstado = 29;
                    this.lstCatTipoNegocio = new Array<any>();
                    this.obtenerPromociones();
                }
            }
        });
    }

    public recargar(event: any) {
        if (event.active) {
            this.obtenerPromociones();
        }
    }

    public obtenerPromociones() {
        if (navigator.geolocation && this.anyFiltros.tipoBusqueda === 1) {
            navigator.geolocation.getCurrentPosition((posicion) => {
                this.anyFiltros.latitud = posicion.coords.latitude;
                this.anyFiltros.longitud = posicion.coords.longitude;
                this.obtenerPromocionesServicio();
            });
        } else {
            this.anyFiltros.tipoBusqueda = 0;
            this.obtenerPromocionesServicio();
        }
    }

    public obtenerPromocionesServicio() {
        this.plazaAfiliacion = JSON.parse(localStorage.getItem('org'));
        if (this.plazaAfiliacion != null) {
            this.anyFiltros.organizacion = this.plazaAfiliacion.id_organizacion;
        }
        this.anyFiltros.typeGetOption = true;
        this._promociones.buscarPromocinesPublicadasModulo(this.anyFiltros)
            .subscribe(
                (response) => {
                    if (response.code === 402) {
                    }
                    if (response.data !== null) {
                        this.lstPromociones = response.data;
                        this.loader = false;
                        // if(this.anyFiltros.strBuscar !== ""){this.modalMapBuscador()}
                    } else {
                        this.lstPromociones = [];
                    }
                },
                () => {
                    
                    this.lstPromociones = [];
                },
                () => {
                    window.scrollTo({top: 0, behavior: "smooth"});
                }
            );
    }

    buscarToolbar(respuesta) {
        if (respuesta !== null) {
            this.blnBtnMap = true
        }
        this.idGiro = null;
        this.anyFiltros = new FiltrosModel();
        this.mostrarDetalle = false;
        this.reiniciarFiltro();
        this.obtenerCatagorias(null);
        this.mensaje = "Todas las promociones";
        this.anyFiltros.strBuscar = JSON.parse(JSON.stringify(respuesta));
        this.banner = respuesta;
        this.obtenerPromociones();
    }

    reiniciarFiltro() {
        this.anyFiltros.tipoBusqueda = 0;
        this.anyFiltros.idEstado = 29;
        this.anyFiltros.kilometros = 1;
        this.lstCatTipoNegocio.map((item) => {
            item.estaSeleccionado = false;
        });
        this.anyFiltros.blnEntrega = null;
        this.filtrosService.actualizarfiltro();
    }

    public obtenerCatagorias(buscar) {
        this.listaCategorias = [];
        this.serviceProveedores.obtenerCategoriasGiro(buscar).subscribe(
            (response) => {
                this.listaCategorias = response.data;
                this.listaCategorias.map((i) => {
                    i.estaSeleccionado = false;
                    i.id_tipo_producto = i.id_categoria;
                });
            },
            (error) => {
                this._notificacionService.error(error);
            }
        );
    }
}

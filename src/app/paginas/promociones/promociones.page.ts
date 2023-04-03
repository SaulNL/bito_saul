import {AfiliacionPlazaModel} from '../../Modelos/AfiliacionPlazaModel';
import {Component, OnInit, ViewChild} from "@angular/core";
import {PromocionesService} from "../../api/promociones.service";
import {IonContent, LoadingController, Platform} from "@ionic/angular";
import {FiltrosService} from "../../api/filtros.service";
import {ProveedorServicioService} from "../../api/proveedor-servicio.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {ActivatedRoute} from "@angular/router";
import { Router } from "@angular/router";
import { AlertController, ModalController } from "@ionic/angular";
/* Modelos */
import {PromocionesModel} from "../../Modelos/PromocionesModel";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {UtilsCls} from "../../utils/UtilsCls";
import { ModalLoguearseComponent } from 'src/app/componentes/modal-loguearse/modal-loguearse.component';

@Component({
    selector: "app-tab2",
    templateUrl: "promociones.page.html",
    styleUrls: ["promociones.page.scss"],
})
export class PromocionesPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    private loaderPrincipal: HTMLIonLoadingElement;
    public lstPromociones: Array<PromocionesModel>;
    public posicionRandom : number=0;
    public rep:number=0;
    public anyFiltros: FiltrosModel;
    public loader: boolean = false;
    public Filtros: FiltrosModel;
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
    public existeSesion: boolean;
    public selectionAP: boolean;
    public plazaAfiliacionNombre : any;
    private modal: any;

    constructor(
        private _promociones: PromocionesService,
        public loadingController: LoadingController,
        private filtrosService: FiltrosService,
        private serviceProveedores: ProveedorServicioService,
        public _notificacionService: ToadNotificacionService,
        private active: ActivatedRoute,
        private platform: Platform,
        private utils : UtilsCls,
        private router: Router,
        public modalController: ModalController,
        public alertController: AlertController
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
        this.existeSesion = utils.existe_sesion();
        this.selectionAP = false;
        this.plazaAfiliacionNombre = "";
    }

    ngOnInit(): void {
        this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;
        // if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
        //     localStorage.setItem("isRedirected", "true");
        //     //location.reload(); **Esto es lo que hace que se vea una pantalla negra
        //     localStorage.removeItem("activedPage");
        // }
        const selected = localStorage.getItem("org");
        if (selected != null) {
        this.plazaAfiliacionNombre = JSON.parse(
            String(localStorage.getItem("org")));
        };
        //this.selectionAP = true;
        this.loader = true;
        this.anyFiltros = new FiltrosModel();
        this.lstPromociones = new Array<PromocionesModel>();
        this.anyFiltros.kilometros = 1;
        this.anyFiltros.idEstado = 29;
        this.lstCatTipoNegocio = new Array<any>();
        this.obtenerPromociones();
        this.mostrarLoguearse();
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

    ionViewWillEnter()
    {
        // if (localStorage.getItem("isRedirected") === "false") {
        //     localStorage.setItem("isRedirected", "true");
        //     location.reload();
        // }

         //En esta funcion se vuelve a inicializar las variables para elimar el reload
        this.posicionRandom = 0;
        this.rep = 0;
        this.cargando = "Cargando";
        this.isIOS = false;
        this.idPersona = null;
        this.Filtros = new FiltrosModel();
        this.Filtros.idEstado = 29;
        this.listaCategorias = [];
        this.blnBtnMapa = true;
        this.blnBtnMap = true;
        this.idGiro = null;
        this.mostrarDetalle = false;
        this.isIOS = this.platform.is('ios');
        this.existeSesion = this.utils.existe_sesion();
        this.selectionAP = false;
        this.plazaAfiliacionNombre = "";
        this.ngOnInit();
    }

    public recargar(event: any) {
        if (event.active) {
            this.obtenerPromociones();
        }
    }
    public aleatorio(a,b) {
        return Math.round(Math.random()*(b-a)+parseInt(a));
    }

    public scroll(){         
        var elem= document.getElementById("imagenCarta")
        var posicion;               
        /*if(elem!=null){
            this.rep++
        }
        if (this.rep<=1){           
            function scrolling() {                 
                console.log("Mostrando elemento random.."+this.posicionRandom)
                elem.scrollIntoView();             
            }   
            setTimeout(scrolling, 1000);                         
        }*/
        if (elem!=null){   
            posicion = elem.getBoundingClientRect();                   
            //elem.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});             
            if(posicion.top != 0 && this.rep == 0){
                this.rep++
                
                setTimeout(() => {
                    this.content.scrollToPoint(0,posicion.top)
                  }, 1000);                                
            }                                                                                                                                                        
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
                        //console.log("lista promos de promos page"+JSON.stringify(this.lstPromociones));
                        this.loader = false;
                        this.posicionRandom= this.aleatorio(0,this.lstPromociones.length-1)                                                
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

    public mostrarLoguearse(){
        if (this.existeSesion) {
        }else{
            if(this.plazaAfiliacion != null){
                
            }else{
                setTimeout(() =>{
                    this. mensajeRegistro();
                  },100)
            }
        }
    }
 
    async mensajeRegistro() {
        const alert = await this.alertController.create({
          header: 'Bitoo!',
          message: "¿Ya tienes una cuenta?",
            buttons: [
                {
                    text: "Iniciar sesión",
                    cssClass: 'text-grey',
                    handler: () => {
                        this.router.navigate(['/tabs/login']);
                    }
                },
                {
                    text: "Registrate",
                    cssClass: 'text-rosa',
                    handler: () => {
                        this.router.navigate(["/tabs/login/sign-up"]);
                    },
                },
            ],
        });
        await alert.present();
      }
}

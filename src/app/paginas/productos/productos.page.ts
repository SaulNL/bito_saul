import { CloseProductDetailModel } from './../../Bitoo/models/query-params-model';
import { ProductInterface } from '../../Bitoo/models/product-model';
import { CreateObjects } from './../../Bitoo/helper/create-object';
import { ProductDetailPage } from './../../Bitoo/Pages/product-detail/product-detail.page';
import { AfiliacionPlazaModel } from '../../Modelos/AfiliacionPlazaModel';
import { Component, EventEmitter, ViewChild } from "@angular/core";
import { ProductoModel } from "../../Modelos/ProductoModel";
import {
    IonContent,
    LoadingController,
    ModalController, Platform,
    ToastController,
} from "@ionic/angular";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BusquedaService } from "../../api/busqueda.service";
import { ProductosService } from "../../api/productos.service";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { FiltroABCModel } from "../../Modelos/FiltroABCModel";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { AnimationController } from "@ionic/angular";
import { ModalProductosComponent } from "../../components/modal-productos/modal-productos.component";
import { UtilsCls } from "../../utils/UtilsCls";
import { PlazasAfiliacionesComponent } from 'src/app/componentes/plazas-afiliaciones/plazas-afiliaciones.component';
import { ValidarPermisoService } from "../../api/validar-permiso.service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { PermisoModel } from "../../Modelos/PermisoModel";

@Component({
    selector: "app-tab1",
    templateUrl: "productos.page.html",
    styleUrls: ["productos.page.scss"],
    providers: [CreateObjects]
})
export class ProductosPage {
    @ViewChild(IonContent) content: IonContent;
    public cordenada: number;
    public anyFiltros: FiltrosModel;
    public lstProductos: Array<ProductoModel>;
    public lstProductosBK: Array<ProductoModel>;
    public loader: boolean;
    public blnBtnMapa: boolean;
    public listaNegocioMap: any;
    public motrarContacto: boolean;
    public loaderLike: boolean;
    public user: any;
    public selectionAP: boolean;
    public filtroABC: Array<FiltroABCModel>;
    public filtroCheckend: number;
    public producto: any;
    public seleccionadoDetalleArray: Array<ProductoModel>;
    public currentModal: HTMLIonModalElement;
    public listaCategorias: any;
    private modal: any;
    public afiliacion: boolean;
    public strBuscar: any;
    alphaScrollItemTemplate: '<ion-item #datos (click)="abrirModal(producto)"><ion-thumbnail slot="start"><img src="https://ecoevents.blob.core.windows.net/comprandoando/img_default/Producto.png"[srcset]="producto.imagen"></ion-thumbnail><ion-label><h2>{{producto.nombre}}</h2><h3>{{(producto.nombre_categoria1 != null)?producto.nombre_categoria1:\'Sin categoría\'}}</h3><div><ion-text>{{(producto.descripcion != null)?producto.descripcion:\'Sin descripción\'}}</ion-text></div><div><ion-text color="success">${{(producto.precio != \'\')?((producto.precio != null)?producto.precio:\'Sin precio\'):\'Sin precio\'}}</ion-text></div><div><ion-badge color="primary">{{producto.tipo}}</ion-badge><ion-badge color="medium">{{(producto.ubicacion != null)?producto.ubicacion.nombre_localidad:\'Sin ubicación\'}}</ion-badge></div></ion-label></ion-item>\n';
    filtroActivo: any;
    public unoProducto: ProductoModel;
    public todosProducto: any;
    public existeSesion: boolean;
    public lstProductosOriginal: any;
    public scroll: boolean;
    public mensaje: any;
    public cargando = 'Cargando';
    private plazaAfiliacion: AfiliacionPlazaModel | null;
    public isIOS: boolean = false;
    public abc: boolean;
    public permisos: Array<PermisoModel> | null;

    constructor(
        public loadingController: LoadingController,
        private _router: Router,
        private toadController: ToastController,
        private principalSercicio: BusquedaService,
        private servicioProductos: ProductosService,
        public modalController: ModalController,
        private notificaciones: ToadNotificacionService,
        private active: ActivatedRoute,
        public animationCtrl: AnimationController,
        private util: UtilsCls,
        private platform: Platform,
        private validarPermiso: ValidarPermisoService,
        private auth0Service: Auth0Service,
        private createObject: CreateObjects
    ) {
        this.afiliacion = false;
        this.abc = false;
        this.user = this.util.getUserData();
        this.existeSesion = util.existe_sesion();
        this.mensaje = "Cargando más productos...";
        this.selectionAP = false;
        this.isIOS = this.platform.is('ios');
    }

    ngOnInit(): void {

        this.active.queryParams.subscribe(
            (params: Params) => {
                if (params.byCloseProduct) {
                    const product: ProductInterface = JSON.parse(params.byCloseProduct);
                    this.updateProduct(product, this.lstProductos);
                }
            }
        );

        if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
            localStorage.setItem("isRedirected", "true");
            location.reload();
        }

        const selected = localStorage.getItem('org');
        if (selected != null) {
            this.selectionAP = true;
        }
        this.mensaje = "Cargando más productos...";
        this.anyFiltros = new FiltrosModel();
        this.anyFiltros.idEstado = 29;
        this.producto = null;
        this.loader = null;
        this.motrarContacto = true;
        this.loaderLike = false;
        this.filtroCheckend = null;
        this.scroll = true;
        this.lstProductos = new Array<ProductoModel>();
        this.lstProductosBK = new Array<ProductoModel>();
        this.seleccionadoDetalleArray = new Array<ProductoModel>();
        this.obtenerProductos();
        this.active.queryParams.subscribe((params) => {
            if (params && params.special) {
                if (params.special) {
                    this.anyFiltros = new FiltrosModel();
                    this.anyFiltros.idEstado = 29;
                    this.producto = null;
                    this.loader = null;
                    this.motrarContacto = true;
                    this.loaderLike = false;
                    this.filtroCheckend = null;
                    this.lstProductos = new Array<ProductoModel>();
                    this.lstProductosBK = new Array<ProductoModel>();
                    this.seleccionadoDetalleArray = new Array<ProductoModel>();
                    this.obtenerProductos();
                }
            }
        });
        this.existeSesion = this.util.existe_sesion();

        if (this.existeSesion) {
            this.permisos = this.auth0Service.getUserPermisos();
            this.afiliacion = this.validarPermiso.isChecked(this.permisos, 'ver_afiliacion');
        }

    }

    /**
     * Scroll
     * @author Omar
     */
    scrollToTop() {
        this.content.scrollToTop(500).then(r => {
        });
    }

    /**
     * Funcion para obtener promociones
     * @author Omar
     */
    public obtenerProductos() {
        this.loader = true;
        this.anyFiltros.user = this.user;
        this.plazaAfiliacion = JSON.parse(localStorage.getItem('org'));
        if (this.plazaAfiliacion != null) {
            this.anyFiltros.organizacion = this.plazaAfiliacion.id_organizacion;
        }
        this.servicioProductos.obtenerProductos(this.anyFiltros).subscribe(
            (response) => {
                this.lstProductos = response.data.lstProductos;
                if (this.lstProductos.length > 0) {
                    this.blnBtnMapa = true;
                    this.listaNegocioMap = this.lstProductos;
                } else {
                    this.blnBtnMapa = false;
                }
                this.lstProductosBK = response.data.lstProductos;
                if (!this.abc) {
                    this.armarFiltroABC();
                } else {
                    const tempLstProduct = response.data.lstProductos;
                    this.lstProductosOriginal = tempLstProduct;
                    this.lstProductos = tempLstProduct.slice(0, 6);
                    this.loader = false;
                }
                if (this.lstProductos.length > 0) {
                    this.blnBtnMapa = true;
                    this.listaNegocioMap = this.lstProductos;
                } else {
                    this.blnBtnMapa = false;
                }
            },
            (error) => {
                this.notificaciones.error("Error, intentelo más tarde");
            }
        );
    }

    /**
     * Funcion para armar filtro de ABC
     * @author Omar
     */
    public armarFiltroABC() {
        this.filtroABC = [];
        const letras =
            "Todos,A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        const arreglo = letras.split(",");
        for (let i = 0; i < 28; i++) {
            this.filtroABC.push({ id: i, letra: arreglo[i], activo: 1 });
        }
        this.filtroABC.forEach((item) => {
            let siHay = this.lstProductos.find((producto) => {
                if (producto.nombre !== null) {
                    return producto.nombre.charAt(0) === item.letra;
                }
            });
            if (siHay !== undefined) {
                item.activo = 1;
            } else {
                item.activo = item.letra != "Todos" ? 0 : 1;
            }
        });
        this.filtrarABCRandom();
    }

    /**
     * funcion seleccionar una letra random
     * @author Omar
     */
    public filtrarABCRandom() {
        let incremento = 0;
        let bandera = true;
        let filtro = new FiltroABCModel();
        const tamanio = this.filtroABC.length;
        while (bandera) {
            incremento++;
            const pos = Math.round(Math.random() * (tamanio - 0) + 0);
            filtro = this.filtroABC[pos];
            if (filtro.activo === 1 && filtro.letra != "Todos") {
                bandera = false;
                setTimeout(() => {
                    this.filtrarABC(filtro);
                }, 500);
            } else {
                bandera = true;
            }
        }
    }

    public filtrarTodos() {
        this.lstProductosOriginal = this.lstProductosBK;
        this.lstProductos = this.lstProductosBK.slice(0, 6);
        this.loader = false;
        /*this.banderaTodos = true;*/
    }

    /**
     * Funcion para filtrar segun letra seleccionada
     * @param filtro
     * @author Omar
     */
    public filtrarABC(filtro: FiltroABCModel) {
        let letra = filtro.letra;
        if (filtro.id === this.filtroCheckend) {
            this.filtroCheckend = null;
            filtro.letra = "";
        } else {
            this.filtroCheckend = filtro.id;
        }
        this.lstProductos = this.lstProductosBK;
        this.scroll = true;
        if (letra === "Todos") {
            this.filtrarTodos();
        } else {
            this.lstProductos = this.lstProductos.filter((element) => {
                if (element.nombre !== null) {
                    if (letra != "Todos") {
                        return (
                            element.nombre
                                .toLowerCase()
                                .charAt(0)
                                .indexOf(filtro.letra.toString().toLowerCase()) > -1
                        );
                    }
                }
            });
            const tempLstProduct = this.lstProductos;
            this.lstProductosOriginal = tempLstProduct;
            this.lstProductos = tempLstProduct.slice(0, 6);
            this.loader = false;
        }
        if (this.lstProductos.length > 0) {
            this.blnBtnMapa = true;
            this.listaNegocioMap = this.lstProductos;
        } else {
            this.blnBtnMapa = false;
        }
        filtro.letra = letra;
    }

    /**
     * @author Juan Antonio Guevara Flores
     * @description Crea un productModel y redirige al page ProductDetailPage
     * @param producto
     */
    public abrirProducto(producto: ProductoModel) {
        const product: ProductInterface = this.createObject.createProduct(producto);
        this._router.navigate(['/tabs/productos/product-detail'], { queryParams: { product: JSON.stringify(product) } });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: ModalProductosComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                seleccionadoDetalleArray: this.seleccionadoDetalleArray,
            },
        });
        this.currentModal = modal;
        return await modal.present();
    }

    /**
     * Funcion para obtener
     * @param event
     */
    buscarToolbar(event) {
        this.anyFiltros.strBuscar = event;
        this.abc = (this.anyFiltros.strBuscar != null);
        this.obtenerProductos();
    }

    abrirFiltros() {
        this.presentModalFiltro();
    }

    async presentModalFiltro() {
        let eventEmitter = new EventEmitter();
        eventEmitter.subscribe((res) => {
            this.modal.dismiss({
                dismissed: true,
            });
            this.anyFiltros = res;
            this.obtenerProductos();
        });
        this.modal = await this.modalController.create({
            component: FiltrosBusquedaComponent,
            componentProps: {
                buscarPorFiltros: eventEmitter,
                filtros: this.anyFiltros,
                isProductPage: true
            },
        });
        return await this.modal.present();
    }

    public borrarFiltros() {
        localStorage.removeItem('byCategorias');
        this.filtroActivo = false;
        this.obtenerProductos();
    }

    public cargarMasProductos(event) {
        setTimeout(() => {
            event.target.complete();
            if (this.lstProductos.length < this.lstProductosOriginal.length) {
                let len = this.lstProductos.length;
                for (let i = len; i <= len + 6; i++) {
                    if (this.lstProductosOriginal[i] === undefined) {
                        this.scroll = false;
                        break;
                    }
                    this.lstProductos.push(this.lstProductosOriginal[i]);
                }
            }
        }, 500);
    }

    public recargar(event: any) {
        if (event.active) {
            this.obtenerProductos();
        }
    }

    public productoImagen(imagen: any) {
        if (Array.isArray(imagen)) {
            return imagen[0];
        }
        return imagen;
    }

    public regresarBitoo() {
        localStorage.removeItem('org');
        location.reload();
    }

    public openPlazasAfiliacionesModal() {
        this.presentModalPlazasAfiliaciones();
    }

    async presentModalPlazasAfiliaciones() {
        let persona = null;
        let permisos = null;
        if (this.util.existSession()) {
            persona = this.util.getIdPersona();
            permisos = this.util.getUserPermisos();
        }
        this.modal = await this.modalController.create(
            {
                component: PlazasAfiliacionesComponent,
                cssClass: 'custom-modal-plazas-afiliaciones',
                componentProps: {
                    idUsuario: persona,
                    permisos: permisos
                }
            }
        );

        return await this.modal.present();
    }
    /**
     * @author Juan Antonio Guevara Flores
     * @description Actualiza el producto desde el perfil si se hiso un cambio con el like
     * @param product
     * @param arrayList
     */
    private updateProduct(product: ProductInterface, arrayList: any) {
        arrayList.forEach(element => {
            if(element.idProducto === product.idProduct) {
                element.likes = product.likes;
                element.usuario_dio_like = (product.like) ? 1 : 0;
            }
        });
    }

}

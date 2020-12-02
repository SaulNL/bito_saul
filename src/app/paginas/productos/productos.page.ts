import { Component, EventEmitter, ViewChild } from "@angular/core";
import { ProductoModel } from "../../Modelos/ProductoModel";
import {
  IonContent,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { BusquedaService } from "../../api/busqueda.service";
import { ProductosService } from "../../api/productos.service";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { FiltroABCModel } from "../../Modelos/FiltroABCModel";
import { ModalProductoPage } from "./modal-producto/modal-producto.page";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { AnimationController } from "@ionic/angular";
import { ModalProductosComponent } from "../../components/modal-productos/modal-productos.component";

@Component({
  selector: "app-tab1",
  templateUrl: "productos.page.html",
  styleUrls: ["productos.page.scss"],
})
export class ProductosPage {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public anyFiltros: FiltrosModel;
  public lstProductos: Array<ProductoModel>;
  public lstProductosBK: Array<ProductoModel>;
  private loader: HTMLIonLoadingElement;
  public blnBtnMapa: boolean;
  public listaNegocioMap: any;
  public motrarContacto: boolean;
  public loaderLike: boolean;
  public user: any;
  public filtroABC: Array<FiltroABCModel>;
  public filtroCheckend: number;
  public producto: any;
  public seleccionadoDetalleArray: Array<ProductoModel>;
  public currentModal: HTMLIonModalElement;
  public listaCategorias: any;
  private modal: any;
  public strBuscar: any;
  alphaScrollItemTemplate: '<ion-item #datos (click)="abrirModal(producto)"><ion-thumbnail slot="start"><img src="https://ecoevents.blob.core.windows.net/comprandoando/img_default/Producto.png"[srcset]="producto.imagen"></ion-thumbnail><ion-label><h2>{{producto.nombre}}</h2><h3>{{(producto.nombre_categoria1 != null)?producto.nombre_categoria1:\'Sin categoría\'}}</h3><div><ion-text>{{(producto.descripcion != null)?producto.descripcion:\'Sin descripción\'}}</ion-text></div><div><ion-text color="success">${{(producto.precio != \'\')?((producto.precio != null)?producto.precio:\'Sin precio\'):\'Sin precio\'}}</ion-text></div><div><ion-badge color="primary">{{producto.tipo}}</ion-badge><ion-badge color="medium">{{(producto.ubicacion != null)?producto.ubicacion.nombre_localidad:\'Sin ubicación\'}}</ion-badge></div></ion-label></ion-item>\n';
  filtroActivo: any;
  public unoProducto: any;
  public todosProducto: any;

  constructor(
    public loadingController: LoadingController,
    private _router: Router,
    private toadController: ToastController,
    private principalSercicio: BusquedaService,
    private servicioProductos: ProductosService,
    public modalController: ModalController,
    private notificaciones: ToadNotificacionService,
    private active: ActivatedRoute,
    public animationCtrl: AnimationController
  ) {}

  ngOnInit(): void {
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
  }
  /**
   * Funcion para obtener promociones
   * @author Omar
   */
  public obtenerProductos() {
    this.presentLoading().then((a) => {});
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
        this.armarFiltroABC();
        //this.loader.onDidDismiss();
      },
      (error) => {
        this.configToad("Error, intentelo más tarde");
        //this.loader.onDidDismiss();
      }
    );
  }
  /**
   * Funcion para obtener promociones
   * @author Omar
   */
  public dobleObtenerProductos() {
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
        this.armarFiltroABC();
        //this.loader.onDidDismiss();
      },
      (error) => {
        this.configToad("Error, intentelo más tarde");
        //this.loader.onDidDismiss();
      }
    );
  }
  /**
   * Funcion para dar like a un producto
   * @param producto
   * @author Omar
   */
  public darLike(producto: ProductoModel) {
    //this.user = this._auth0.getUserData();
    //if(this.user.id_persona !== undefined){
    this.servicioProductos.darLike(producto, this.user).subscribe(
      (response) => {
        if (response.code === 200) {
          producto.likes = response.data;
        }
        this.configToad(response.message);
      },
      (error) => {
        this.configToad("Error, intentelo más tarde");
      }
    );
    //}
  }
  /**
   * Funcion para armar filtro de ABC
   * @author Omar
   */
  public armarFiltroABC() {
    this.filtroABC = [];
    const letras = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z";
    const arreglo = letras.split(",");
    for (let i = 0; i < 27; i++) {
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
        item.activo = 0;
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
      if (filtro.activo === 1) {
        bandera = false;
        setTimeout(() => {
          this.filtrarABC(filtro);
        }, 500);
      } else {
        bandera = true;
      }
    }
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
    this.lstProductos = this.lstProductos.filter((element) => {
      if (element.nombre !== null) {
        return (
          element.nombre
            .toLowerCase()
            .charAt(0)
            .indexOf(filtro.letra.toString().toLowerCase()) > -1
        );
      }
    });
    if (this.lstProductos.length > 0) {
      this.blnBtnMapa = true;
      this.listaNegocioMap = this.lstProductos;
      //this.getNegociosMapa();
    } else {
      this.blnBtnMapa = false;
    }
    filtro.letra = letra;
  }
  /**
   * Funcion para ordenar el arreglo y abrir modal
   * @param modal
   * @param producto
   * @author Omar
   */
  public abrirModal(producto: ProductoModel) {
    this.producto = producto;
    this.lstProductos.forEach((item) => {
      item["select"] = 0;
    });
    producto.select = 1;
    this.lstProductos.sort((a, b) => {
      return b.select - a.select;
    });

    let data = true;
    this.seleccionadoDetalleArray = this.lstProductos;
    if (this.lstProductos.length > 1) {
      this.lstProductos.forEach((element) => {
        if (data) {
          this.unoProducto = element;
        } else {
          this.todosProducto.push(element);
        }
      });
    } else {
      this.unoProducto = this.seleccionadoDetalleArray;
    }

    this.presentModale();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Cargando. . .",
      duration: 5000,
    });
    return await loading.present();
  }

  async configToad(mensaje) {
    const toast = await this.toadController.create({
      color: "black",
      duration: 2000,
      message: mensaje,
    });
    return await toast.present();
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
      console.log(res);
      this.obtenerProductos();
    });
    this.modal = await this.modalController.create({
      component: FiltrosBusquedaComponent,
      componentProps: {
        buscarPorFiltros: eventEmitter,
        filtros: this.anyFiltros,
      },
    });
    return await this.modal.present();
  }
  async presentModale() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector("ion-backdrop")!)
        .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector(".modal-wrapper")!)
        .keyframes([
          { offset: 0, opacity: "0", transform: "scale(0)" },
          { offset: 1, opacity: "0.99", transform: "scale(1)" },
        ]);

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing("ease-out")
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction("reverse");
    };

    const modal = await this.modalController.create({
      component: ModalProductosComponent,
      enterAnimation,
      leaveAnimation,
      swipeToClose: true,
      componentProps: {
        seleccionadoDetalleArray: this.seleccionadoDetalleArray,
        unoProducto: this.unoProducto,
        losDemas: this.todosProducto,
      },
    });
    this.dobleObtenerProductos();
    modal.onDidDismiss().then(data => {
      if (data.data){
console.log(data.data.dismissed);
      }
  });
    return await modal.present();
  }
}

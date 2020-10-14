import { Component } from '@angular/core';
import {ProductoModel} from "../../Modelos/ProductoModel";
import {LoadingController, ModalController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {BusquedaService} from "../../api/busqueda.service";
import {ProductosService} from "../../api/productos.service";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {FiltroABCModel} from "../../Modelos/FiltroABCModel";
import {ModalProductoPage} from "./modal-producto/modal-producto.page";

@Component({
  selector: 'app-tab1',
  templateUrl: 'productos.page.html',
  styleUrls: ['productos.page.scss']
})
export class ProductosPage {
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
  public currentModal:HTMLIonModalElement;

  constructor(
      public loadingController: LoadingController,
      private _router: Router,
      private toadController: ToastController,
      private principalSercicio: BusquedaService,
      private servicioProductos: ProductosService,
      public modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.producto = null;
    this.loader = null;
    this.motrarContacto = true;
    this.loaderLike = false;
    this.filtroCheckend = null;
    this.anyFiltros = new FiltrosModel();
    this.lstProductos = new Array<ProductoModel>();
    this.lstProductosBK = new Array<ProductoModel>();
    this.seleccionadoDetalleArray = new Array<ProductoModel>();
    this.obtenerProductos();
  }
  /**
   * Funcion para obtener promociones
   * @author Omar
   */
  public obtenerProductos() {
    this.presentLoading().then(a => {});
    this.servicioProductos.obtenerProductos(this.anyFiltros).subscribe(
        response => {
          this.lstProductos = response.data.lstProductos;
          if (this.lstProductos.length > 0) {
            this.blnBtnMapa = true;
            this.listaNegocioMap = this.lstProductos;
          } else {
            this.blnBtnMapa = false;
          }
          this.lstProductosBK = response.data.lstProductos;
          this.armarFiltroABC();
          this.loader.onDidDismiss();
        },
        error => {
          this.configToad('Error, intentelo más tarde')
          this.loader.onDidDismiss();
        });
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
          response => {
            if(response.code === 200){
              producto.likes = response.data;
            }
            this.configToad(response.message)
          },
          error => {
            this.configToad('Error, intentelo más tarde')
          });
    //}
  }
  /**
   * Funcion para armar filtro de ABC
   * @author Omar
   */
  public armarFiltroABC() {
    this.filtroABC = [];
    const letras = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    const arreglo = letras.split(',');
    for (let i = 0; i < 27; i++) {
      this.filtroABC.push({ id: i, letra: arreglo[i], activo: 1 });
    }
    this.filtroABC.forEach(item => {
      let siHay = this.lstProductos.find(producto => {
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
  public filtrarABCRandom(){
    let incremento = 0;
    let bandera = true;
    let filtro = new FiltroABCModel();
    const tamanio = this.filtroABC.length;
    while (bandera){
      incremento++;
      const pos = Math.round(Math.random() * (tamanio - 0) + 0);
      filtro = this.filtroABC[pos];
      if(filtro.activo === 1){
        bandera = false;
        setTimeout(() => {
          this.filtrarABC(filtro);
        }, 500);
      }else{
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
      filtro.letra = '';
    } else {
      this.filtroCheckend = filtro.id;
    }
    this.lstProductos = this.lstProductosBK;
    this.lstProductos = this.lstProductos.filter(element => {
      if (element.nombre !== null) {
        return element.nombre.toLowerCase().charAt(0).indexOf(filtro.letra.toString().toLowerCase()) > -1;
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
    this.lstProductos.forEach(item =>{
      item['select'] = 0;
    });
    producto.select = 1;
    this.lstProductos.sort((a,b) => {
      return (b.select - a.select);
    });
    this.seleccionadoDetalleArray = this.lstProductos;
    this.presentModal();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando. . .',
      duration: 5000
    });
    return await loading.present();
  }

  async configToad(mensaje) {
    const toast = await this.toadController.create({
      color: 'black',
      duration: 2000,
      message: mensaje
    });
    return await toast.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalProductoPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        seleccionadoDetalleArray: this.seleccionadoDetalleArray
      }
    });
    this.currentModal = modal;
    return await modal.present();
  }
}

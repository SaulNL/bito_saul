import {Component, OnInit, ViewChild} from '@angular/core';
import {IonContent, ModalController, Platform} from '@ionic/angular';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UtilsCls} from '../../utils/UtilsCls';
import {PersonaService} from "../../api/persona.service";
import {ProductoModel} from "../../Modelos/ProductoModel";
import {ProductInterface} from "../../Bitoo/models/product-model";
import {ProductFavoriteModel} from "../../Bitoo/models/query-params-model";
import {CreateObjects} from "../../Bitoo/helper/create-object";
import {ProductosService} from "../../api/productos.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {MsNegocioModel} from "../../Modelos/busqueda/MsNegocioModel";
import {ProveedorServicioService} from "../../api/busqueda/proveedores/proveedor-servicio.service";

@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.page.html',
  styleUrls: ['./mis-favoritos.page.scss'],
})
export class MisFavoritosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public user: any;
  public segmentModel = 'productos';
  public cordenada: number;

  public loader: boolean;
  public listaProductos: any;
  public msj = 'Cargando';
  public unoProducto: ProductoModel;
  public motrarContacto: boolean;
  public existeSesion: boolean;
  public isIOS: boolean = false;
  public listaNegocios: any;

  constructor(
      public modalController: ModalController,
      private util: UtilsCls,
      private personaService: PersonaService,
      private createObject: CreateObjects,
      private router: Router,
      private servicioProductos: ProductosService,
      private notificaciones: ToadNotificacionService,
      private activatedRoute: ActivatedRoute,
      private platform: Platform,
      private serviceProveedores: ProveedorServicioService,
  ) {
    this.user = this.util.getUserData();
    this.listaProductos = [];
    this.listaNegocios = [];
    this.loader = false;
    this.existeSesion = util.existe_sesion();
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit() {}

  ionViewWillEnter(){
    this.obtenerProductosFavoritos();
    this.existeSesion = this.util.existe_sesion();
    this.motrarContacto = true;
    this.activatedRoute.queryParams.subscribe(
        (params: Params) => {
          if (params.byCloseProduct) {
            const product: ProductInterface = JSON.parse(params.byCloseProduct);
            this.updateProduct(product);
          }
        }
    );
    this.obtenerNegociosFavoritos();
    this.motrarContacto = true;
  }

  /*Sección de productos favoritos*/

  public obtenerProductosFavoritos() {
    this.loader = true;
    if (this.user.id_persona !== undefined) {
      this.personaService
          .obtenerProductosFavoritos(this.user.id_persona)
          .subscribe(
              (response) => {
                if (response.code === 200) {
                  this.listaProductos = response.data.data;
                  localStorage.setItem('lstProductosOriginal', JSON.stringify(this.listaProductos));
                }
                this.loader = false;
              },
              (error) => {
                this.loader = false;
              }
          );
    }
  }

  private updateProduct(product: ProductInterface) {
    if (!product.like) {
      let position: number;
      this.listaProductos.forEach(function (value: any, index: any) {
        if (value.idProducto === product.idProduct) {
          position = index;
        }
      });
      this.listaProductos.splice(position, 1);
    }
  }

  public abrirProducto(producto: ProductoModel) {
    localStorage.setItem('isRedirected', 'true');
    this.unoProducto = producto;
    const product: ProductInterface = this.createObject.createProduct(producto);
    const queryParams: ProductFavoriteModel = new ProductFavoriteModel(JSON.stringify(product));
    this.router.navigate(['/tabs/productos/product-detail'], { queryParams: queryParams });
  }

  public productoImagen(imagen: any) {
    if (Array.isArray(imagen)) {
      return imagen[0];
    }
    return imagen;
  }

  public darDislike(producto: ProductoModel) {
    //this.user = this._auth0.getUserData();
    //if(this.user.id_persona !== undefined){
    this.servicioProductos.darLike(producto, this.user).subscribe(
        (response) => {
          if (response.code === 200) {
            producto.likes = response.data;
            producto.usuario_dio_like = 1;
            this.notificaciones.exito(response.message);
          } else {
            producto.usuario_dio_like = 0;
            producto.likes = response.data;

            let index = this.listaProductos.indexOf(producto);

            if (index > -1) {
              this.listaProductos.splice(index, 1);
            }

            this.notificaciones.alerta(response.message);
          }
        },
        (error) => {
          this.notificaciones.error('Error, intentelo más tarde');
        }
    );
    //}
  }

  /*Sección de negocios favoritos*/

  public obtenerNegociosFavoritos() {
    this.loader = true;
    if (this.user.id_persona !== undefined) {
      this.personaService
          .obtenerNegociosFavoritos(this.user.id_persona)
          .subscribe(
              (response) => {
                this.loader = false;
                if (response.code === 200) {
                  this.listaNegocios = response.data;
                }
              },
              (error) => {
                this.loader = false;
              }
          );
    }
  }

  abrirNegocio(negocioURL) {
    if (negocioURL === '') {
      this.notificaciones.error(
          'Este negocio aún no cumple los requisitos mínimos'
      );
    } else {
      this.router.navigate(['/tabs/negocio/' + negocioURL], {
        queryParams: { route: true },
      });
    }
  }

  public darDislikeNegocio(negocio: MsNegocioModel) {
    this.serviceProveedores.darLike(negocio, this.user).subscribe(
        (response) => {
          if (response.code === 200) {
            negocio.likes = response.data;
            this.notificaciones.exito(response.message);
          } else {
            let index = this.listaNegocios.indexOf(negocio);

            if (index > -1) {
              this.listaNegocios.splice(index, 1);
            }
            this.notificaciones.alerta(response.message);
          }
        },
        (error) => { }
    );
  }

  isTypeColor(type: string) {
    return (type === 'ABIERTO') ? 'success' : 'danger';
  }

}

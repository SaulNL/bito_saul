import { ProductFavoriteModel } from './../../../Bitoo/models/query-params-model';
import { CreateObjects } from './../../../Bitoo/helper/create-object';
import { ProductInterface } from './../../../Bitoo/models/product-model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilsCls } from "../../../utils/UtilsCls";
import { PersonaService } from "../../../api/persona.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ProductoModel } from "../../../Modelos/ProductoModel";
import { AnimationController, IonContent, ModalController } from '@ionic/angular';
import { ProductosService } from "../../../api/productos.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";

@Component({
  selector: "app-productos-favoritos",
  templateUrl: "./productos-favoritos.page.html",
  styleUrls: ["./productos-favoritos.page.scss"],
  providers: [CreateObjects]
})
export class ProductosFavoritosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public user: any;
  public listaProductos: any;
  public unoProducto: ProductoModel;
  public existeSesion: boolean;
  public motrarContacto: boolean;
  public tamanoLista: number;
  public loader: boolean;
  public msj = 'Cargando';

  constructor(
    private util: UtilsCls,
    private personaService: PersonaService,
    private router: Router,
    public animationCtrl: AnimationController,
    public modalController: ModalController,
    private servicioProductos: ProductosService,
    private notificaciones: ToadNotificacionService,
    private createObject: CreateObjects,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.util.getUserData();
    this.existeSesion = util.existe_sesion();
    this.tamanoLista = 0;
  }

  ngOnInit() {
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
              this.tamanoLista = this.listaProductos.length;
            }
            this.loader = false;
          },
          (error) => {
            this.tamanoLista = 0;
            this.loader = false;
          }
        );
    }
  }

  public abrirProducto(producto: ProductoModel) {
    localStorage.setItem('isRedirected', 'true');
    this.unoProducto = producto;
    const product: ProductInterface = this.createObject.createProduct(producto);
    const queryParams: ProductFavoriteModel = new ProductFavoriteModel(JSON.stringify(product));
    this.router.navigate(['/tabs/productos/product-detail'], { queryParams: queryParams });
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
        this.notificaciones.error("Error, intentelo más tarde");
      }
    );
    //}
  }

  regresar() {
    this.router.navigate(["/tabs/mis-favoritos"]);
  }

  public productoImagen(imagen: any) {
    if (Array.isArray(imagen)) {
      return imagen[0];
    }
    return imagen;
  }
}

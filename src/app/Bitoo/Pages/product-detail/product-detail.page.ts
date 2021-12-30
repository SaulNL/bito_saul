import { SliderImagesComponent } from './../../components/slider-images/slider-images.component';
import { ReturnToProductInterface } from './../../models/return-to-model';
import { ProductoBusinessModel } from './../../models/product-business-model';
import { ProductLikeModel } from './../../models/product-like-model';
import { ProductModel } from './../../models/product-model';
import { Platform } from '@ionic/angular';
import { byProductModel } from './../../models/add-To-Product-model';
import { CloseProductDetailModel, ByProductDetailModel } from './../../models/query-params-model';
import { AddToProductInterface, AddToProductModel } from '../../models/add-To-Product-model';
import { AddVisitToProductInterface, AddVisitToProductModel } from '../../models/add-visit-To-model';
import { ProductosService } from './../../../api/productos.service';
import { Router } from '@angular/router';
import { ValidatorData } from './../../helper/validations';
import { Formats } from './../../helper/formats';
import { ProductLikeInterface } from '../../models/product-like-model';
import { CreateObjects } from './../../helper/create-object';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { ProductBusinessInterface } from '../../models/product-business-model';
import { NegocioService } from './../../../api/negocio.service';
import { ProductInterface } from '../../models/product-model';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  providers: [CreateObjects, Formats, ValidatorData]
})
export class ProductDetailPage implements OnInit {
  @ViewChild('loaderProduct', { static: false }) loaderProduct: LoaderComponent;
  @ViewChild('sliderImages', { static: false }) sliderImages: SliderImagesComponent;
  public loader: boolean;
  public product: ProductInterface;
  public business: ProductBusinessInterface;
  public productLike: ProductLikeInterface;
  public purchaseMessage: string;
  public subscribe: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private businessService: NegocioService,
    private toadNotificacionService: ToadNotificacionService,
    private createObject: CreateObjects,
    private format: Formats,
    private validator: ValidatorData,
    private route: Router,
    private productService: ProductosService,
    private platform: Platform
  ) {
    this.inicializeModels();
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params.product) {
          localStorage.setItem('detail', 'product');
          this.inicializeModels();
          const product: ProductInterface = JSON.parse(params.product);
          this.init(product);
        }

        if (params.byProfile) {
          this.inicializeModels();
          const content: ReturnToProductInterface = JSON.parse(params.byProfile);
          this.product = content.product;
          this.productLike = this.createObject.createProductLike(this.product);
          this.business = content.business;
          this.sliderImages.productImages = [];
          this.sliderImages.images = [];
          this.sliderImages.productImages = content.product.images;
          this.sliderImages.images = content.product.images;
        }
        if (params.productByFavorite) {
          localStorage.setItem('detail', 'favorite');
          this.inicializeModels();
          const product: ProductInterface = JSON.parse(params.productByFavorite);
          this.init(product);
        }
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Se activa la suscripcion al boton atras, cuando se termino de cargar la pagina
   */
  ionViewDidEnter() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.closeDetail();
      });
    });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Se activa cuando va a salir del page y se desuscribe del boton atras
   */
  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Actualiza el detalle del producto y redirecciona a los productos
   */
  public closeDetail() {
    const temp: string = localStorage.getItem('detail');
    if (temp !== null && temp === 'product') {
      this.updateLikeProduct();
      this.route.navigate(['/tabs/productos/'], {
        queryParams: new CloseProductDetailModel(JSON.stringify(this.product))
      });
    }
    if (temp !== null && temp === 'favorite') {
      this.updateLikeProduct();
      this.route.navigate(['/tabs/mis-favoritos/'], {
        queryParams: new CloseProductDetailModel(JSON.stringify(this.product))
      });
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Redirecciona al perfil del producto
   */
  public showMore() {
    const content: byProductModel = new byProductModel(this.product);
    const queryParams: ByProductDetailModel = new ByProductDetailModel(JSON.stringify(content));
    this.route.navigate(['/tabs/negocio/' + this.business.url], {
      queryParams: queryParams
    });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Agrega el producto y redireciona al perfil del negocio
   */
  public addProduct() {
    const content: AddToProductInterface = new AddToProductModel(this.product);
    this.route.navigate(['/tabs/negocio/' + this.business.url], {
      queryParams: {
        addProduct: JSON.stringify(content)
      }
    });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Cambia el mensaje al precionar el boton de agregar pero no esta abierto
   */
  public changePurchaseMessage() {
    this.purchaseMessage = 'Este negocio se encuentra cerrado';
    setTimeout(() => {
      this.purchaseMessage = 'Agregar';
    }, 1000);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Actualiza los valores para reenviar el producto
   */
  private updateLikeProduct() {
    this.product.like = this.productLike.like;
    this.product.likes = this.productLike.likes;
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa el prceso de carga de las variables
   * @param product
   */
  private init(product: ProductInterface) {
    this.loaderTurnOff();
    this.purchaseMessage = 'Agregar';
    this.getDetailBusinessProduct(product);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Obtiene el detalle del negocio del producto seleccionado
   * @param product
   */
  private getDetailBusinessProduct(product: ProductInterface) {
    this.loader = true;
    this.businessService.obtenerNegocio(product.idBusiness).subscribe(
      (response) => {
        if (response.code === 200) {
          this.business = this.createObject.createProductBusiness(response.data);
          this.product = product;
          this.proccessProductLike(this.product);
        } else {
          this.errorService();
        }
        this.loaderTurnOff();
        this.loaderProductTurnOff();
      }, () => {
        this.errorService();
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicia el proceso para el Like del producto
   */
  private proccessProductLike(product: ProductInterface) {
    this.productLike = this.createObject.createProductLike(product);
    if (this.productLike.visibility) {
      this.visitToProduct(this.productLike.idPerson, this.productLike.idProduct);
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   *  @description Inicializa los models
   */
  private inicializeModels() {
    this.product = new ProductModel();
    this.business = new ProductoBusinessModel();
    this.productLike = new ProductLikeModel(false);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Registra las visita al producto si esta logeado el usuario
   * @param idPerson
   * @param idProduct
   */
  private visitToProduct(idPerson: number, idProduct: string) {
    const visitProduct: AddVisitToProductInterface = new AddVisitToProductModel(idPerson, idProduct);
    this.productService.quienVioProdu(visitProduct);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna el precio formateado o si no tiene retorna un mensaje
   */
  get price() {
    if (this.product.price > 0) {
      return this.format.formatCurrency(this.product.price);
    }
    return 'Contactar precio con el proveedor';
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna un mensaje dependiendo de si existe o no el producto
   */
  get exist() {
    return (this.product.exist) ? 'Aún en existencia' : 'Sin existencia';
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y retorna si si se debe visualizar optiones para el usuario logeado
   */
  get visibility() {
    return (this.createObject.existSesion());
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y retorna si el precio es mayor a cero
   */
  get existPrice() {
    return this.validator.existPrice(this.product.price);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna la validacion de si el negocio esta abierto y si tiene alun metodo de pago
   */
  get purchase() {
    return this.validator.purchase(this.business, this.product.price);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Apaga el Loader
   */
  private loaderTurnOff() {
    this.loader = false;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Forzar el apagado del loader
   */
  private loaderProductTurnOff() {
    setTimeout(() => {
      this.loaderProduct.loader = false;
    }, 3000);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Se activa cuando el servicio de obtener el negocio no cargo correctamente
   */
  private errorService() {
    this.toadNotificacionService.error('No se pudo cargar su producto');
    this.loaderTurnOff();
  }
}

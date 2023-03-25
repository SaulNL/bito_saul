import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SliderImagesComponent } from 'src/app/Bitoo/components/slider-images/slider-images.component'; 
import { ReturnToProductInterface } from 'src/app/Bitoo/models/return-to-model';
import { ProductoBusinessModel } from 'src/app/Bitoo/models/product-business-model';
import { ProductLikeModel } from 'src/app/Bitoo/models/product-like-model';
import { ProductModel } from 'src/app/Bitoo/models/product-model';
import { Platform } from "@ionic/angular";
import { byProductModel } from 'src/app/Bitoo/models/add-To-Product-model';
import { CloseProductDetailModel, ByProductDetailModel} from 'src/app/Bitoo/models/query-params-model';
import { AddVisitToProductInterface, AddVisitToProductModel } from 'src/app/Bitoo/models/add-visit-To-model';
import { AddToProductInterface, AddToProductModel } from 'src/app/Bitoo/models/add-To-Product-model';
import { ProductosService } from 'src/app/api/productos.service';
import { Router } from "@angular/router";
import { ValidatorData } from 'src/app/Bitoo/helper/validations';
import { Formats } from 'src/app/Bitoo/helper/formats';
import { ProductLikeInterface } from 'src/app/Bitoo/models/product-like-model';
import { CreateObjects } from 'src/app/Bitoo/helper/create-object';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { ProductBusinessInterface } from 'src/app/Bitoo/models/product-business-model';
import { NegocioService } from 'src/app/api/negocio.service';
import { ProductInterface } from 'src/app/Bitoo/models/product-model';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { LoaderComponent } from 'src/app/Bitoo/components/loader/loader.component';
import { ProductoModel } from "src/app/Modelos/ProductoModel";

@Component({
  selector: 'app-modal-detalle-producto',
  templateUrl: './modal-detalle-producto.component.html',
  styleUrls: ['./modal-detalle-producto.component.scss'],
  providers: [CreateObjects, Formats, ValidatorData],
})
export class ModalDetalleProductoComponent implements OnInit {
  @Input() public productObject;
  @Input() public producto;
  @Input() public palabraBuqueda;
  public product: ProductInterface;
  @ViewChild("loaderProduct", { static: false }) loaderProduct: LoaderComponent;
  @ViewChild("sliderImages", { static: false })
  sliderImages: SliderImagesComponent;
  public loader: boolean;
  //public product: ProductInterface;
  public business: ProductBusinessInterface;
  public productLike: ProductLikeInterface;
  public purchaseMessage: string;
  public subscribe: Subscription;
  lstProductos: Array<ProductoModel>;
  prodEnPos: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private businessService: NegocioService,
    private toadNotificacionService: ToadNotificacionService,
    private createObject: CreateObjects,
    private format: Formats,
    private validator: ValidatorData,
    private route: Router,
    private productService: ProductosService,
    private platform: Platform,
    public modalController: ModalController,
  ) {
    this.inicializeModels();
  }
  ngOnInit() {
    if (this.productObject!=null || this.productObject != undefined) {
      localStorage.setItem("detail", "product");
      this.inicializeModels();
      const product: ProductInterface = this.productObject;
      console.log("ProductInterface B: "+JSON.stringify(product))
      console.log("Payload B: "+this.productObject)
      this.init(product);
      if (this.producto) {
        console.log("id_producto Payload B: "+this.producto)
        this.posicionProducto(this.producto);
      }
    }
    
    /*var productTO = this.productObject
    console.log("Payload B: "+JSON.stringify(productTO))
    this.inicializeModels();
    const product: ProductInterface = productTO 
    
    console.log("id_producto Payload B : "+this.producto)
    console.log("init product: : "+JSON.stringify(product))
    this.init(product);
    this.posicionProducto(this.producto);*/
    
    /*this.activatedRoute.queryParams.subscribe((params: Params) => {  
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
        localStorage.setItem("detail", "favorite");
        this.inicializeModels();
        const product: ProductInterface = JSON.parse(params.productByFavorite);
        this.init(product);

        this.posicionProducto(product.idProduct);
      }
    });*/
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
  cerrar() {
    this.modalController.dismiss()
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Se activa cuando va a salir del page y se desuscribe del boton atras
   */
  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  posicionProducto(idProducto) {
    this.lstProductos = JSON.parse(localStorage.getItem('lstProductosOriginal'))
    let productoid = idProducto;

    this.lstProductos.forEach((producto, i) => {
      if(producto.idProducto == productoid) {
          this.prodEnPos=i;
      }
    });
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Actualiza el detalle del producto y redirecciona a los productos
   */
  public closeDetail() {
    const temp: string = localStorage.getItem("detail");
    if (temp !== null && temp === "product") {
      this.updateLikeProduct();
      this.route.navigate(["/tabs/productos/"], {
        queryParams: new CloseProductDetailModel(JSON.stringify(this.product)),
      });
    }
    if (temp !== null && temp === "favorite") {
      this.updateLikeProduct();
      this.route.navigate(["/tabs/mis-favoritos/"], {
        queryParams: new CloseProductDetailModel(JSON.stringify(this.product)),
      });
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Redirecciona al perfil del producto
   */
  public showMore() {
    console.log("showMore business URL: "+JSON.stringify(this.business.url))
    if(this.business.url!="" && this.business.url!=undefined){
      this.modalController.dismiss();
      const content: byProductModel = new byProductModel(this.product);
      const queryParams: ByProductDetailModel = new ByProductDetailModel(
        JSON.stringify(content)
      );
      this.route.navigate(["/tabs/negocio/" + this.business.url], {
        queryParams: {queryParams:queryParams, desdeModal: "true", palabraBuqueda: this.palabraBuqueda},
      });
    }else{

    } 
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Agrega el producto y redireciona al perfil del negocio
   */
  public addProduct() {
    let arr = [];
    this.product.images.forEach((element) => {
      arr.push(element.image);
    });
    this.product.images = arr;
    const content: AddToProductInterface = new AddToProductModel(this.product);
    this.route.navigate(["/tabs/negocio/" + this.business.url], {
      queryParams: {
        addProduct: JSON.stringify(content)
      },
    });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Cambia el mensaje al precionar el boton de agregar pero no esta abierto
   */
  public changePurchaseMessage() {
    this.purchaseMessage = "Este negocio se encuentra cerrado";
    setTimeout(() => {
      this.purchaseMessage = "Agregar";
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
    console.log("init: "+product.idBusiness)
    this.loaderTurnOff();
    this.purchaseMessage = "Agregar";
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
          this.business = this.createObject.createProductBusiness(
            response.data
          );
          this.product = product;
          this.proccessProductLike(this.product);
        } else {
          this.errorService();
        }
        this.loaderTurnOff();
        this.loaderProduct.loader = false;
        //this.loaderProductTurnOff();
      },
      () => {
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
      this.visitToProduct(
        this.productLike.idPerson,
        this.productLike.idProduct
      );
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
    const visitProduct: AddVisitToProductInterface = new AddVisitToProductModel(
      idPerson,
      idProduct
    );
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
    return "Contactar precio con el proveedor";
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Retorna un mensaje dependiendo de si existe o no el producto
   */
  get exist() {
    return this.product.exist ? "Aún en existencia" : "Sin existencia";
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y retorna si si se debe visualizar optiones para el usuario logeado
   */
  get visibility() {
    return this.createObject.existSesion();
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
    this.toadNotificacionService.error("No se pudo cargar su producto");
    this.loaderTurnOff();
  }

  back(){
    if(this.lstProductos.length > 0 && this.prodEnPos >0){
        this.inicializeModels();
        this.prodEnPos--        
        let producto = this.lstProductos[this.prodEnPos] 
        console.log("\nPosicion: "+(this.prodEnPos+1)+" de: "+this.lstProductos.length+"\nProductoTO: "+JSON.stringify(producto))
        const product: ProductInterface = this.createObject.createProduct(producto);
        this.init(product);
    }else{
        console.log("No hay mas promos atras")
    }       
  }

  next() {
    if(this.prodEnPos < this.lstProductos.length-1){
        this.inicializeModels();
        this.prodEnPos++
        console.log("Posicion: "+(this.prodEnPos+1)+" de: "+this.lstProductos.length)
        const product: ProductInterface = this.createObject.createProduct(this.lstProductos[this.prodEnPos]);
        this.product=product
        this.init(product);
    }else{
      console.log("No hay mas productos adelante")
    }          
  }

}

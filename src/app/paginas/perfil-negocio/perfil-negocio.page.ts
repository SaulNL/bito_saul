import {
  ReturnToProductInterface,
  ReturnToProductModel,
} from "./../../Bitoo/models/return-to-model";
import { ProductBusinessInterface } from "./../../Bitoo/models/product-business-model";
import { byProductModel } from "./../../Bitoo/models/add-To-Product-model";
import { CreateObjects } from "./../../Bitoo/helper/create-object";
import {
  BackToProductDetailModel,
  ByProductDetailModel,
} from "./../../Bitoo/models/query-params-model";
import { AddToProductInterface } from "../../Bitoo/models/add-To-Product-model";
import { ProductInterface } from "../../Bitoo/models/product-model";
import { AppSettings } from "./../../AppSettings";
import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  IonSlides,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { NegocioService } from "../../api/negocio.service";
import { BusquedaService } from "src/app/api/busqueda.service";
import { Geolocation, Capacitor } from "@capacitor/core";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Location } from "@angular/common";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { ActionSheetController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { DenunciaNegocioPage } from "./denuncia-negocio/denuncia-negocio.page";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import { CalificarNegocioComponent } from "../../componentes/calificar-negocio/calificar-negocio.component";
import { ProveedorServicioService } from "../../api/busqueda/proveedores/proveedor-servicio.service";
import { DetalleProductoComponent } from "../../componentes/detalle-producto/detalle-producto.component";
import { PedidoNegocioComponent } from "../../componentes/pedido-negocio/pedido-negocio.component";
import { AuthGuardService } from "../../api/auth-guard.service";
import { NavBarServiceService } from "src/app/api/busqueda/nav-bar-service.service";
import { PromocionesModel } from "src/app/Modelos/PromocionesModel";
import { File } from "@ionic-native/File/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import { icon, Map, Marker, marker, tileLayer } from "leaflet";
import { Downloader, DownloadRequest, NotificationVisibility } from "@ionic-native/downloader/ngx";
/* import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx'; */
/* import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx'; */

const { Share } = Plugins;
const haversineCalculator = require("haversine-calculator");
import { ModalPromocionNegocioComponent } from "src/app/componentes/modal-promocion-negocio/modal-promocion-negocio.component";
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ProductosService } from "../../api/productos.service";
import { ComentariosNegocioComponent } from "../../componentes/comentarios-negocio/comentarios-negocio.component";
import { OptionBackLogin } from "src/app/Modelos/OptionBackLoginModel";
import { FiltrosModel } from "src/app/Modelos/FiltrosModel";
/* import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx'; */

@Component({
  selector: "app-perfil-negocio",
  templateUrl: "./perfil-negocio.page.html",
  styleUrls: ["./perfil-negocio.page.scss"],
  providers: [CreateObjects],
})
export class PerfilNegocioPage implements OnInit, AfterViewInit {
  public Filtros: FiltrosModel;
  public listaComentarios: [];
  public mostrarComentarios: boolean;
  public seccion: any;
  private map: Map;
  @ViewChild('mapContainer')  mapContainer: Map;
  public negocio: string;
  public informacionNegocio: any;
  public loader: boolean;
  public miLat: any;
  public miLng: any;
  public permisoUbicacionCancelado: boolean;
  public distanciaNegocio: string;
  public existeSesion: boolean;
  url = `${AppSettings.URL_FRONT}`;
  public url_negocio: string;
  private marker: Marker<any>;
  public urlData: string;
  public estatusCalificacion: boolean;
  public hoy: number;
  public estatus: { tipo: number; mensaje: string };
  public motrarContacto: boolean;
  public backButton = true;
  public subscribe;
  public modal;
  public banderaS: any;
  public banderaP: any;
  public diasArray = [
    { id: 1, dia: "Lunes", horarios: [], hi: null, hf: null },
    { id: 2, dia: "Martes", horarios: [], hi: null, hf: null },
    { id: 3, dia: "Miércoles", horarios: [], hi: null, hf: null },
    { id: 4, dia: "Jueves", horarios: [], hi: null, hf: null },
    { id: 5, dia: "Viernes", horarios: [], hi: null, hf: null },
    { id: 6, dia: "Sábado", horarios: [], hi: null, hf: null },
    { id: 7, dia: "Domingo", horarios: [], hi: null, hf: null },
  ];
  private detalle: any;
  public bolsa: any;
  public negocioSub = true;
  public nameSub;
  public servicioSub = true;
  public namelesSub;
  public cantidadBolda;
  suma: number;
  public ruta;
  public contador: number;
  public navegacion: any;
  public user: any;
  public msj = "Cargando";
  public siEsta: any;
  public arrayLugaresEntrega: any;
  public typeLogin: OptionBackLogin;
  public promociones: any;
  public isIOS: boolean = false;
  private idPersona: number | null;
  public toProductDetail: boolean;
  public idProduct: string;
  private latitudNeg: any;
  private longitudNeg: any;
  private convenio_entrega: any;
  public fotografiasArray:any[];
  public promocionDefault: string;
  public logo:any;
  currentIndex:Number = 0;
  @ViewChild('carrusel')  slides: IonSlides;
  slideOpts = {
    autoHeight: true,
    slidesPerView: 1,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  }
  slideOptsInsignias = {
    autoHeight: false,
    slidesPerView: 8,
    centeredSlides: false,
    loop: false,
    spaceBetween: 0,
  }
  insignias: any;
  showPopUp: boolean;
  insigniaTitle: string;
  insigniaDescrip: string;
  constructor(
    private nativeHTTP: HTTP,
    private file: File,
    private navctrl: NavController,
    private route: ActivatedRoute,
    private toadController: ToastController,
    private negocioService: NegocioService,
    private BusquedaService:BusquedaService,
    private notificacionService: ToadNotificacionService,
    private location: Location,
    private util: UtilsCls,
    private downloader: Downloader,
    private sideBarService: SideBarService,
    public notificaciones: ToadNotificacionService,
    private actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private serviceProveedores: ProveedorServicioService,
    public alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private blockk: AuthGuardService,
    private navBarServiceService: NavBarServiceService,
    private servicioProductos: ProductosService,
    private createObject: CreateObjects /* private document: DocumentViewer, */ /* private transfer: FileTransfer, */ /* private webview: WebView */
  ) {
    this.Filtros = new FiltrosModel();
    this.toProductDetail = false;
    this.motrarContacto = true;
    this.seccion = "productos";
    // this.segmentModel = 'productos';
    this.loader = false;
    this.typeLogin = new OptionBackLogin();
    this.existeSesion = util.existe_sesion();
    this.estatusCalificacion = true;
    this.bolsa = [];
    this.promociones = [];
    this.contador = 0;
    this.idPersona = null;
    this.miLat = null;
    this.miLng = null;
    this.route.queryParams.subscribe((params) => {
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.modal = this.modalController.getTop().then((dato) => {
          if (dato !== undefined) {
            this.modal.dismiss();
          } else {
            if (this.contador === 0) {
              this.contador = this.contador + 1;
              this.salir();
            }
          }
        });
      });
    });
    this.banderaS = null;
    this.banderaP = null;
    this.navegacion = false;
    this.user = this.util.getUserData();
    this.siEsta = true;
    this.isIOS = this.platform.is("ios");
  }

  ngOnInit() {
    
    if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
      localStorage.setItem("isRedirected", "true");
      location.reload();
      // window.location.assign(this.router.url);
    }
    this.route.queryParams.subscribe((params) => {
      if (params.cancel && params) {
        let all = JSON.parse(JSON.stringify(params));
        let objeto = JSON.parse(all.cancel);
        this.ruta = objeto.ruta;
        if (objeto.cancel) {
          this.mensajeRuta();
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params.route && params) {
        this.navegacion = true;
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params.addProduct) {
        this.navegacion = true;
        this.toProductDetail = true;
        const addProduct: AddToProductInterface = JSON.parse(params.addProduct);
        setTimeout(() => {
          this.addProduct(addProduct.product);
        }, 2000);
      }

      if (params.byProductDetail) {
        this.navegacion = true;
        this.toProductDetail = true;
        const content: byProductModel = JSON.parse(params.byProductDetail);
        this.idProduct = content.product.idProduct;
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params && params.carrito) {
        this.navegacion = true;
        const agregarProducto = JSON.parse(params.carrito);
        if (agregarProducto.agregado) {
          setTimeout(() => {
            this.agregarBolsaDeta(agregarProducto.producto);
          }, 2000);
        }
      }
    });

    this.sideBarService.getObservable().subscribe((data) => {
      this.existeSesion = this.util.existe_sesion();
    });

    this.route.params.subscribe((params) => {
      this.negocio = params.negocio;
      if (
        this.negocio !== undefined &&
        this.negocio !== null &&
        this.negocio !== ""
      ) {
        this.obtenerInformacionNegocio();
      } else {
        this.notificacionService.error("Ocurrio un error con este negocio");
        this.location.back();
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params.clickBanner && params) {
        //console.log("Vienes del baner de promociones, el id de esta promo es: "+params.promo)
        this.negocioService.obteneretalleNegocio(this.negocio, this.user.id_persona).subscribe((response) => {
          if (response.data !== null) {
            this.informacionNegocio = response.data;            
            this.promociones = this.informacionNegocio.promociones; 
            //console.log("TAMAÑO DE LISTA PROMOS-----"+this.promociones.length)
            this.promociones.forEach(promo => {
              //console.log("Promo clikeada: "+params.promo+" --> Promo de lista: "+promo.id_promocion)
              if(promo.id_promocion == params.promo){
                //promo.estatus=this.estatus
                //promo.diasArray= this.diasArray
                //console.log("OK Coincidencia --> "+promo.id_promocion)
                setTimeout(() => {
                  this.abrirModalPromocion(promo)
                },1000)                                                                                
              }
            });           
          } else {

          }          
        }
      );
      }
    });

    this.getCurrentPosition();
    this.idPersona = this.existeSesion ? this.user.id_persona : null;
    localStorage.removeItem("negocios");
  }

  ngAfterViewInit(): void {}

  async loadMap() {
    setTimeout((it) => {
      const lat = this.latitudNeg;
      const lng = this.longitudNeg;
      this.map = new Map("mapIdPedido").setView([lat, lng], 14);
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(this.map);
      this.map.on("", (respuesta) => {
        this.getLatLong(respuesta);
      });
      const myIcon = icon({
        iconUrl:
          "https://ecoevents.blob.core.windows.net/comprandoando/marker.png",
        iconSize: [45, 41],
        iconAnchor: [13, 41],
      });
      this.marker = marker([lat, lng], { icon: myIcon, draggable: false }).addTo(
        this.map
      );
      /* this.marker.on("dragend", () => {
        this.getLatLong({ latlng: this.marker.getLatLng() });
      }); */
    }, 500);
  }
  getLatLong(e) {
    this.miLat = e.latlng.lat;
    this.miLng = e.latlng.lng;
    this.map.panTo([this.miLat, this.miLng]);
    this.marker.setLatLng([this.miLat, this.miLng]);
  }

  ionViewWillEnter() {
    this.navBarServiceService.cambio.subscribe((respuesta) => {
      //this.detallePromocion(respuesta);
    });
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition()
      .then((res) => {
        this.miLat = res.coords.latitude;
        this.miLng = res.coords.longitude;
      })
      .catch((error) => {
        this.permisoUbicacionCancelado = true;
      });
  }

  obtenerInformacionNegocio() {
    this.loader = true;
    this.negocioService
      .obteneretalleNegocio(this.negocio, this.user.id_persona)
      .subscribe(
        (response) => {
          if (response.data !== null) {
            this.informacionNegocio = response.data;
            this.logo = this.informacionNegocio.url_logo
            
            this.Filtros.idNegocio=this.informacionNegocio.id_negocio  
            this.Filtros.kilometros=10 
            this.Filtros.limpiarF=false;            
            this.buscarDetalleNegocio(this.Filtros,1)
            this.convenio_entrega=this.informacionNegocio.convenio_entrega;
            this.latitudNeg = this.informacionNegocio.latitud;
            this.longitudNeg = this.informacionNegocio.longitud;
            
            this.promociones = this.informacionNegocio.promociones;
            if (
              this.informacionNegocio.url_negocio !== null &&
              this.informacionNegocio.url_negocio !== "" &&
              this.informacionNegocio.url_negocio !== undefined
            ) {
              this.urlData = this.url + this.informacionNegocio.url_negocio;
            } else {
              this.urlData = this.url;
            }
            if (this.informacionNegocio.lugares_entrega !== null) {
              this.arrayLugaresEntrega =
                this.informacionNegocio.lugares_entrega.split(",");
            } else {
              this.arrayLugaresEntrega = null;
            }
            if (!this.informacionNegocio.activo) {
              this.presentExit();
              this.siEsta = false;
            } else {
              this.informacionNegocio.catProductos = [];
              this.informacionNegocio.catServicos = [];
              // this.obtenerPromociones();
              this.obtenerProductos();
              this.obtenerServicios();
              this.obtenerEstatusCalificacion();
              this.guardarQuienVioNegocio(this.informacionNegocio.id_negocio);
              this.comentariosNegocio(this.informacionNegocio.id_negocio);
              this.horarios(this.informacionNegocio);
              this.calcularDistancia();
            }
          } else {
            this.presentError();
          }
          //this.loader = false;
        },
        () => {
          confirm("Error al cargar");
          this.loader = false;
        }
      );
    // this.loader = false;
  }
  
  async buscarDetalleNegocio(filtro:any, pagina:any){
    
    await this.BusquedaService.getDatosNegocioSinMapearCategoría(filtro,pagina).subscribe(
      response => {
        let negocioTO = response.data;  
        let data = negocioTO.lst_cat_negocios.data[0] 
        this.fotografiasArray= data.fotografias 
        this.insignias=data.distintivos
              
      },
      error => {
      }
    );

    var intentos =0;
    var inter = setInterval(( ) =>{            
        if(this.mapContainer!=null || this.mapContainer!= undefined){
          this.loadMap();
          clearInterval(inter);
        }    
        else{

          intentos++
          if(intentos>5){
            clearInterval(inter);
          }
        }      
    }, 1000);
  }

  obtenerProductos() {
    this.negocioService
      .obtenerDetalleDeNegocio(
        this.informacionNegocio.id_negocio,
        0,
        this.user.id_persona
      )
      .subscribe(
        (response) => {
          if (response.code === 200 && response.agrupados != null) {
            const productos = response.agrupados;
            const cats = [];

            if (productos !== undefined) {
              productos.map((catprod) => {
                if (catprod.activo) {
                  const productos3 = [];
                  catprod.productos.map((pro) => {
                    if (pro.existencia) {
                      productos3.push(pro);
                    }
                  });
                  catprod.productos = productos3;

                  if (productos3.length > 0) {
                    cats.push(catprod);
                  }
                }
              });
              this.informacionNegocio.catProductos = cats;
            }
          }
          if (response.code === 200) {
            if (
              (response.data.productos === undefined ||
                response.data.productos.length === 0) &&
              response.data.servicios !== undefined &&
              response.data.servicios.length > 0
            ) {
              this.seccion = "servicios";
            }else if (
              this.promociones !== undefined &&
              this.promociones.length > 0 && 
              (response.data.productos === undefined || response.data.productos.length === 0) && 
              (response.data.servicios === undefined || response.data.servicios.length === 0)
            ) {
              this.seccion = "anuncios";
            }else if (
              (response.data.productos === undefined ||
                response.data.productos.length === 0) &&
              (response.data.servicios === undefined ||
                response.data.servicios.length === 0 ) && 
              (this.promociones == undefined  || this.promociones.length === 0)
            ) {
              this.seccion = "ubicacion";
            }

            this.informacionNegocio.cartaProducto = response.data.cartaProducto;
            this.informacionNegocio.cartaServicio = response.data.cartaServicio;
            this.informacionNegocio.tagsProductos = response.data.productoTags;
            this.informacionNegocio.tagsServicios = response.data.serviciosTags;
          }
        },
        (error) => {
          confirm("Error al o¿btener los productos");
        }
      );
  }

  obtenerServicios() {
    this.negocioService
      .obtenerDetalleDeNegocio(
        this.informacionNegocio.id_negocio,
        1,
        this.user.id_persona
      )
      .subscribe(
        (response) => {
          if (response.code === 200 && response.agrupados != null) {
            const servicios = response.agrupados;
            const cats = [];

            if (servicios !== undefined) {
              servicios.map((catprod) => {
                if (catprod.activo) {
                  const servicios3 = [];
                  catprod.servicios.map((ser) => {
                    if (ser.existencia) {
                      servicios3.push(ser);
                    }
                  });
                  catprod.servicios = servicios3;

                  if (servicios3.length > 0) {
                    cats.push(catprod);
                  }
                }
              });
              this.informacionNegocio.catServicos = cats;
            }
          }
        },
        (error) => {
          confirm("Error al o¿btener los servicios");
        }
      );
  }

  // loadMap() {
  //   if (this.informacionNegocio.det_domicilio.latitud !== '0' && this.informacionNegocio.det_domicilio.longitud !== '0') {
  //     const lat = this.informacionNegocio.det_domicilio.latitud;
  //     const lng = this.informacionNegocio.det_domicilio.longitud;
  //     this.map = new Map("mapId").setView([lat, lng], 16);
  //     tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       attribution: "",
  //     }).addTo(this.map);

  //     var myIcon = icon({
  //       iconUrl:
  //         "https://ecoevents.blob.core.windows.net/comprandoando/marker.png",
  //       iconSize: [45, 41],
  //       iconAnchor: [13, 41],
  //     });

  //     marker([lat, lng], { icon: myIcon }).addTo(this.map);
  //   }

  // }

  async configToad(mensaje) {
    const toast = await this.toadController.create({
      color: "red",
      duration: 2000,
      message: mensaje,
    });
    return await toast.present();
  }

  // cambio() {
  // if (this.seccion === "ubicacion") {
  // setTimeout((it) => {
  // this.loadMap();
  // }, 100);
  // }
  // }

  irAlDetalle(producto: any) {
    this.detalle = producto;
    this.abrirModaldetalle();
  }

  enviarWhasapp(celular: any) {
    this.abrirVentana("https://api.whatsapp.com/send?phone=+52" + celular);
  }

  llamar(telefono) {
    this.abrirVentana("tel:" + telefono);
  }

  descargarCarta(ruta) {
    let nombreArchivo = ruta.split('/');
    nombreArchivo = nombreArchivo.slice(-1)

    let extencion = nombreArchivo.toString().split('.');
    extencion = extencion.slice(-1);

    let nombre = this.informacionNegocio.nombre_comercial;
    this.msj = 'Descargando archivo....';
    this.loader = true;

    if (this.isIOS) {
      setTimeout(() => {
        const options: any = {
          method: "get",
          responseType: "blob",
          headers: {
            accept: this.getMimetype(extencion),
          },
        };
        this.nativeHTTP.sendRequest(ruta, options)
          .then((response) => {
            let blob: Blob = response.data;
            this.file
              .writeFile(
                this.file.documentsDirectory,
                'carta_' + nombre + '.' + extencion, blob, { replace: true, append: false })
              .then((response) => {
                Share.share({
                  title: 'carta_' + nombre,
                  url: response.nativeURL,
                }).then((resShare) => {
  
                });
              })
              .catch((error) => this.notificaciones.error(error));
          })
          .catch((error) => this.notificaciones.error(error))
          .finally(() => this.loadMap());
        this.loader = false;
      }, 700);

    } else {
      var request: DownloadRequest = {
        uri: ruta,
        title: 'carta_' + nombre,
        description: "",
        mimeType: "",
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalFilesDir: {
          dirType: "",
          subPath: FilesystemDirectory.Documents + "/" + 'carta_' + nombre + '.' + extencion
        }
      };
      this.downloader.download(request).then((location: string) => {
        this.notificaciones.exito("El Archivo se descargo con exito");
        this.loader = false;
      }).catch((error: any) => {
        this.loader = false;
        this.notificaciones.error(error)
      })
      .finally(() => this.loadMap());
    }
  }

  getMimetype(name) {
    if (name.indexOf("pdf") >= 0) {

      return "application/pdf";
    } else if (name.indexOf("png") >= 0) {

      return "image/png";
    } else if (name.indexOf("jpeg") >= 0) {

      return "image/jpeg";
    } else if (name.indexOf("jpg") >= 0) {

      return "image/jpg";
    }
  }

  abrirVentana(ruta) {
    window.open(
      ruta,
      "_blank",
      "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=400,height=400"
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Negocio",
      buttons: [
        {
          text: "Denunciar",
          icon: "receipt-outline",
          handler: () => {
            this.abrirModalDenuncia();
          },
        },
        {
          text: "Cancelar",
          icon: "close",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  async abrirModalDenuncia() {
    const modal = await this.modalController.create({
      component: DenunciaNegocioPage,
      componentProps: {
        idNegocio: this.informacionNegocio.id_negocio,
        negocioNombre: this.informacionNegocio.nombre_comercial,
      },
    });
    await modal.present();
  }

  async abrirModaldetalle() {
    const modal = await this.modalController.create({
      component: DetalleProductoComponent,
      componentProps: {
        datos: this.detalle,
        _entregaDomicilio: this.informacionNegocio.entrega_domicilio,
        _entregaSitio: this.informacionNegocio.entrega_sitio,
        _consumoSitio: this.informacionNegocio.consumo_sitio,
        _costoEntrega: this.informacionNegocio.costo_entrega,
        _abierto: this.informacionNegocio.abierto,
        bolsa: this.bolsa,
        user: this.user,
        url: this.informacionNegocio.url_negocio,
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((r) => {
      if (r.data.data != undefined && r.data.data !== null) {
        this.llenarBolsa(r.data.data);
      }
      if (r.data.goLogin != undefined) {
        localStorage.setItem("isRedirected", "false");
        const body = JSON.stringify(r.data.goLogin);
        this.router.navigate(["/tabs/login"], {
          queryParams: { perfil: body },
        });
      }
    });
  }

  async abrirModalpedido() {
    
    const modal = await this.modalController.create({
      component: PedidoNegocioComponent,
      componentProps: {
        idNegocio: this.informacionNegocio.id_negocio,
        lista: this.bolsa,
        _entregaDomicilio: this.informacionNegocio.entrega_domicilio,
        _entregaSitio: this.informacionNegocio.entrega_sitio,
        _consumoSitio: this.informacionNegocio.consumo_sitio,
        _costoEntrega: this.informacionNegocio.costo_entrega,
        negocioNombre: this.informacionNegocio.nombre_comercial,
        latNegocio:this.latitudNeg,
        logNegocio: this.longitudNeg,
        convenio:this.convenio_entrega
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((r) => {
      if (r.data.data !== undefined) {
        this.bolsa = r.data.data;
      }
    });
  }

  async compartir() {
    this.url_negocio = this.url + this.informacionNegocio.url_negocio;
    await Share.share({
      title: "Ver cosas interesantes",
      text:
        "Te recomiendo este negocio " +
        this.informacionNegocio.nombre_comercial,
      url: this.url_negocio,
      dialogTitle: "Compartir con Amigos",
    })
      .then()
      .catch((error) => this.notificacionService.error(error));
  }

  async abrirModalCalifica() {
    const modal = await this.modalController.create({
      component: CalificarNegocioComponent,
      componentProps: {
        actualTO: this.informacionNegocio,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      this.informacionNegocio.numCalificaciones = data.numCalificaciones;
      this.informacionNegocio.promedio = data.promedio;
      this.obtenerEstatusCalificacion();
      this.mostrarComentarios = true;
    }
  }

  async abrirModalComentarios() {
    const modal = await this.modalController.create({
      component: ComentariosNegocioComponent,
      componentProps: {
        idNegocio: this.informacionNegocio.id_negocio,
      },
    });
    await modal.present();
    /*const { data } = await modal.onDidDismiss();
        if (data !== undefined) {
          this.informacionNegocio.numCalificaciones = data.numCalificaciones;
          this.informacionNegocio.promedio = data.promedio;
          this.obtenerEstatusCalificacion();

        }*/
  }

  /**
   * funcion para obtener el estatus de la calificacion
   * @author Omar
   */
  obtenerEstatusCalificacion() {
    //  this.loaderEstatusCalifi = true;
    if (this.existeSesion) {
      this.serviceProveedores
        .obtenerEstatusCalificacionUsuario(this.informacionNegocio)
        .subscribe(
          (response) => {
            if (response.code === 200) {
              this.estatusCalificacion = true;
              this.valorEstrellas();
            } else {
              this.estatusCalificacion = false;
              this.valorEstrellas();
            }
          },
          (error) => {
            //      this.loaderEstatusCalifi = false;
          },
          () => {
            //     this.loaderEstatusCalifi = false;
          }
        );
    } else {
      this.estatusCalificacion = false;
      //   this.loaderEstatusCalifi = false;
    }
  }

  valorEstrellas() {
    setTimeout((it) => {
      let numeroEstrella = this.informacionNegocio.promedio.toString();
      let estrellas = <any>document.getElementsByName("estrellas");
      for (let i = 0; i < estrellas.length; i++) {
        if (estrellas[i].value === numeroEstrella) {
          let estrellaValor = estrellas[i];
          estrellaValor.setAttribute("checked", true);
        }
      }
    }, 500);
  }

  private horarios(negocio: any) {
    this.estatus = { tipo: 0, mensaje: "No abre hoy" };

    const hros = negocio.horarios;
    let hoy: any;
    hoy = new Date();
    this.hoy = hoy.getDay() !== 0 ? hoy.getDay() : 7;
    const diasArray = JSON.parse(JSON.stringify(this.diasArray));
    if (hros !== undefined) {
      hros.forEach((horarioTmp) => {
        diasArray.map((dia) => {
          if (
            horarioTmp.dias.includes(dia.dia) &&
            horarioTmp.hora_inicio !== undefined &&
            horarioTmp.hora_fin !== undefined
          ) {
            const dato = {
              texto: horarioTmp.hora_inicio + " a " + horarioTmp.hora_fin,
              hi: horarioTmp.hora_inicio,
              hf: horarioTmp.hora_fin,
            };
            dia.horarios.push(dato);
          }
        });
      });

      diasArray.map((dia) => {
        if (dia.id === this.hoy) {
          const now = new Date(
            1995,
            11,
            18,
            hoy.getHours(),
            hoy.getMinutes(),
            0,
            0
          );
          let abieto = null;
          let index = null;
          const listaAux = [];
          if (dia.horarios.length !== 0) {
            dia.horarios.map((item, i) => {
              const inicio = item.hi.split(":");
              // tslint:disable-next-line:radix
              const fi = new Date(
                1995,
                11,
                18,
                parseInt(inicio[0]),
                parseInt(inicio[1]),
                0,
                0
              );
              const fin = item.hf.split(":");
              let aux = 18;
              // tslint:disable-next-line:radix
              if (parseInt(inicio[0]) > parseInt(fin[0])) {
                aux = 19;
              }
              // tslint:disable-next-line:radix
              const ff = new Date(
                1995,
                11,
                aux,
                parseInt(fin[0]),
                parseInt(fin[1]),
                0,
                0
              );
              listaAux.push({
                valor: (fi.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                index: i,
              });
              if (now >= fi && now <= ff) {
                abieto = true;
                index = i;
              }
            });
            if (abieto) {
              this.estatus = {
                tipo: 1,
                mensaje: "Cierra a las " + dia.horarios[index].hf,
              };
            } else {
              let listaValores: Array<number> = [];
              let siHay = false;
              listaAux.map((item) => {
                listaValores.push(item.valor);
                if (item.valor > 0) {
                  siHay = true;
                }
              });
              if (siHay) {
                listaValores = listaValores.filter((item) => {
                  return item >= 0;
                });
              }
              const valor = Math.min.apply(null, listaValores);
              const valorMax = Math.max.apply(null, listaValores);
              if (valor > 0) {
                listaAux.map((item) => {
                  if (item.valor === valor) {
                    index = item.index;
                  }
                });
                this.estatus = {
                  tipo: 0,
                  mensaje: "Abre a las " + dia.horarios[index].hi,
                };
              } else {
                listaAux.map((item) => {
                  if (item.valor === valorMax) {
                    index = item.index;
                  }
                });
                this.estatus = {
                  tipo: 0,
                  mensaje: "Cerró a las " + dia.horarios[index].hf,
                };
              }
            }
          } else {
            this.estatus = { tipo: 0, mensaje: "No abre hoy" };
          }
        }
      });
      this.diasArray = diasArray;
    }
  }

  public llenarBolsa(dato) {
    let existe = false;
    this.bolsa.map((it) => {
      if (it.idProducto === dato.idProducto) {
        existe = true;
        // if (dato.cantidad > 1) {
        it.cantidad = dato.cantidad;
        // } else {
        // it.cantidad++;
        // }
      }
    });
    if (!existe) {
      this.bolsa.push(dato);
    }
    this.blockk.tf = false;
    this.blockk.url = this.negocio;
  }

  salir() {
    this.msj = "Cargando";
    localStorage.setItem("loaderNegocio", "true");
    if (this.bolsa.length > 0) {
      this.mensajeBolsa();
    } else {
      this.blockk.tf = true;
      if (this.navegacion) {
        this.goBackTo();
        this.navegacion = false;
        
      } else {
        // this.router.navigate(['/tabs/inicio']);
       
        this.router.navigateByUrl("/tabs/inicio");
        //this.router.navigate(['/tabs/inicio'], { queryParams: { special: true } });
        this.contador = 0;
      }
    }
    if(!this.isIOS){
      this.platform.backButton.subscribeWithPriority(10, () => {
        const byCategorias = localStorage.getItem("byCategorias");
        if(byCategorias!=null){
          localStorage.setItem("filtroActivo", "true");
        }
      });
    }
    
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  async mensajeRuta() {
    const alert = await this.alertController.create({
      header: "Advertencia",
      message:
        "Message <strong>¿Estas seguro de salir?... tu bolsa se perderá </strong>!!!",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            this.blockk.tf = false;
            this.router.navigate(["/tabs/negocio/" + this.negocio]);
          },
        },
        {
          text: "Salir",
          handler: () => {
            this.blockk.tf = true;
            this.bolsa = [];
            if (this.ruta === "/tabs/home/perfil") {
              this.router.navigate(["/tabs/home/perfil"], {
                queryParams: { special: true },
              });
            } else {
              this.router.navigate([this.ruta]);
            }
            // this.subscribe.unsubscribe();
            // this.router.navigate(['/tabs/inicio'],{ queryParams: {special: true}  });
          },
        },
      ],
    });

    await alert.present();
  }

  async avisoNegocioCerrado() {
    const alert = await this.alertController.create({
      header: "Aviso",
      message:
        "Este negocio está cerrado, revisa sus horarios para hacer un pedido cuando se encuentre abierto",
      buttons: ["OK"],
    });

    await alert.present();
  }

  async mensajeBolsa() {
    const alert = await this.alertController.create({
      header: "Advertencia",
      message:
        "Message <strong>¿Estas seguro de salir?... tu bolsa se perderá </strong>!!!",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            this.blockk.tf = false;
            this.contador = 0;
          },
        },
        {
          text: "Salir",
          handler: () => {
            this.bolsa = [];
            this.blockk.tf = true;
            if (this.navegacion) {
              this.goBackTo();
            } else {
              this.router.navigate(["/tabs/inicio"]);
            }

            // this.subscribe.unsubscribe();
            // this.router.navigate(['/tabs/inicio'],{ queryParams: {special: true}  });
          },
        },
      ],
    });

    await alert.present();
  }

  calcularDistancia() {
    setTimeout(() => {
      const start = {
        latitude: this.miLat,
        longitude: this.miLng,
      };
      const end = {
        latitude: this.informacionNegocio.latitud,
        longitude: this.informacionNegocio.longitud,
      };
      const dis = haversineCalculator(start, end);
      this.distanciaNegocio = dis.toFixed(2);
      this.loader = false;
    }, 1500);
  }

  agregarBolsaDeta(pro) {
    if (this.existeSesion) {
      let producto = {
        idProducto: pro.idProducto,
        precio: pro.precio,
        imagen: pro.imagen,
        cantidad: 1,
        idNegocio: pro.negocio.idNegocio,
        nombre: pro.nombre,
        descripcion: pro.descripcion,
      };
      let existe = false;
      this.bolsa.map((it) => {
        if (it.idProducto === producto.idProducto) {
          existe = true;
          if (producto.cantidad > 1) {
            it.cantidad = producto.cantidad;
          } else {
            it.cantidad++;
          }
        }
      });
      if (!existe) {
        this.bolsa.push(producto);
      }
      this.blockk.tf = false;
      this.blockk.url = this.negocio;
    } else {
      this.typeLogin.type = "perfil";
      this.typeLogin.url = this.negocio;
      localStorage.setItem("isRedirected", "false");
      const body = JSON.stringify(this.typeLogin);
      this.router.navigate(["/tabs/login"], {
        queryParams: { perfil: body },
      });
    }
  }

  private addProduct(product: ProductInterface) {
    this.idProduct = product.idProduct;
    const productoTemporal = {
      idProducto: product.idProduct,
      precio: product.price,
      imagen: product.images,
      negocio: {
        idNegocio: product.idBusiness,
      },
      nombre: product.name,
      descripcion: product.description,
    };
    this.agregarBolsaDeta(productoTemporal);
  }

  loginGo() {
    localStorage.setItem("isRedirected", "false");
    this.typeLogin.type = "perfil";
    this.typeLogin.url = this.negocio;
    const body = JSON.stringify(this.typeLogin);
    this.router.navigate(["/tabs/login"], {
      queryParams: { perfil: body },
    });
  }

  irRedSocial(palabra: string) {
    if (
      palabra.substring(0, 7) !== "http://" &&
      palabra.substring(0, 8) !== "https://"
    ) {
      palabra = "https://" + palabra;
    }
    this.abrirVentana(palabra);
  }

  mostrarBoton(precio) {
    return (
      (this.informacionNegocio.entrega_domicilio === 1 ||
        this.informacionNegocio.entrega_sitio === 1 ||
        this.informacionNegocio.consumo_sitio === 1) &&
      parseInt(precio) > 0
    ); // && parseInt(precio) > 0
  }

  aumentarDismuir(cantidad: number, index: number, operacion: number) {
    let valor = this.bolsa[index].cantidad;
    if (operacion === 1 && cantidad >= 1) {
      this.bolsa[index].cantidad = ++valor;
    }
    if (operacion === 2 && cantidad > 1) {
      this.bolsa[index].cantidad = --valor;
    }
  }

  mostrarOcultar() {
    this.motrarContacto = !this.motrarContacto;
  }

  mostrarProducto(nombreCat: any) {
    if (!this.negocioSub) {
      if (this.banderaP === nombreCat) {
        this.negocioSub = !this.negocioSub;
        this.nameSub = nombreCat;
      } else {
        this.nameSub = nombreCat;
        this.banderaP = nombreCat;
      }
    } else {
      this.negocioSub = !this.negocioSub;
      this.nameSub = nombreCat;
      this.banderaP = nombreCat;
    }
  }

  mostrarServicio(nombreCat) {
    this.motrarContacto = true;
    if (!this.servicioSub) {
      if (this.banderaS === nombreCat) {
        this.servicioSub = !this.servicioSub;
        this.namelesSub = nombreCat;
      } else {
        this.namelesSub = nombreCat;
        this.banderaS = nombreCat;
      }
    } else {
      this.servicioSub = !this.servicioSub;
      this.namelesSub = nombreCat;
      this.banderaS = nombreCat;
    }
  }

  eliminar(inde) {
    for (let index = 0; index < this.bolsa.length; index++) {
      const element = this.bolsa[index];
      if (element.idProducto === inde.idProducto) {
        this.bolsa.splice(index, 1);
      }
    }
    if (Object.keys(this.bolsa).length === 0) {
      this.blockk.tf = true;
    }
  }

  async detallePromocion(promocion: PromocionesModel) {
    if (promocion !== new PromocionesModel()) {
      setTimeout(async () => {
        await this.abrirModalPromocion(promocion);
      }, 200);
    }
  }

  async abrirModalPromocion(promo: any) {  //aQUI SE ABRE MODAL DE PROMO
    const modal = await this.modalController.create({
      component: ModalPromocionNegocioComponent,
      componentProps: {
        promocionTO: promo,
        idPersona: this.idPersona,
        latitud: this.miLat,
        longitud: this.miLng,
        celular:promo.celular,
        descripcion:promo.descripcion,
        
      },
    });
    modal.present();
  }

  public darLike(producto: ProductoModel) {
    this.servicioProductos.darLike(producto, this.user).subscribe(
      (response) => {
        if (response.code === 200) {
          producto.likes = response.data;
          this.notificacionService.exito(response.message);
        } else {
          this.notificacionService.alerta(response.message);
        }
      },
      (error) => {
        this.notificacionService.error("Error, intentelo más tarde");
      }
    );
    //}
  }

  async presentError() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "",
      mode: "ios",
      backdropDismiss: true,
      message: "<strong>La Url del negocio no existe</strong>!!!",
      buttons: [
        {
          text: "Salir",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.router.navigate(["/"]);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentExit() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "",
      mode: "ios",
      backdropDismiss: true,
      message:
        "<strong>Este negocio está deshabilitado o ya no existe</strong>!!!",
      buttons: [
        {
          text: "Salir",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.router.navigate(["/"]);
          },
        },
      ],
    });

    await alert.present();
  }

  guardarQuienVioNegocio(id_negocio: number) {
    this.negocioService.visteMiNegocio(id_negocio).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  comentariosNegocio(idNegocio: number) {
    this.negocioService.obtenerComentariosNegocio(idNegocio).subscribe(
      (response) => {
        if (response.data !== null && response.data != undefined) {
          this.listaComentarios = response.data;
          if (this.listaComentarios.length > 0) {
            this.mostrarComentarios = true;
          }
        }
      },
      () => {}
    );
  }

  public productoImagen(imagen: any) {
    if (Array.isArray(imagen)) {
      return imagen[0];
    }
    return imagen;
  }

  public loading(pc: any, pr: any) {
    return pc === true || pr === false;
  }

  public ifPromocion(promociones: any) {
    return (
      promociones !== undefined &&
      promociones !== null &&
      promociones.length > 0
    );
  }

  public segmentChanged(event) {
    this.motrarContacto = true;
    this.servicioSub = true;
    this.negocioSub = true;
    this.seccion = event.detail.value;
    this.motrarContacto = true;
    this.servicioSub = true;
    this.negocioSub = true;
  }
  public costoMayorA(costo) {
    if (!isNaN(Number(costo)) && Number(costo) === 0) {
      return false;
    }
    return true;
  }

  private goBackTo() {
    if (this.toProductDetail) {
      this.sendToProduct();
    } else {
      this.location.back();
    }
    this.toProductDetail = false;
  }
  private sendToProduct() {
    const content: ReturnToProductInterface = new ReturnToProductModel(
      this.createObject.createProduct(
        this.updateProductToProductDetail(this.idProduct)
      ),
      this.createObject.createProductBusiness(this.informacionNegocio)
    );
    const queryParams: BackToProductDetailModel = new BackToProductDetailModel(
      JSON.stringify(content)
    );
    this.router.navigate(["/tabs/productos/product-detail"], {
      queryParams: queryParams,
    });
  }
  private updateProductToProductDetail(idProduct: string) {
    const products: Array<any> = this.informacionNegocio.catProductos;
    const services: Array<any> = this.informacionNegocio.catServicos;
    let existProduct: any = null;
    let existService: any = null;
    if (products.length > 0) {
      this.informacionNegocio.catProductos.forEach((element) => {
        if (element.productos.length > 0) {
          element.productos.forEach((product) => {
            if (product.idProducto === idProduct) {
              existProduct = product;
            }
          });
        }
      });
    }
    if (services.length > 0) {
      this.informacionNegocio.catServicos.forEach((element) => {
        if (element.servicios.length > 0) {
          element.servicios.forEach((service) => {
            if (service.idProducto === idProduct) {
              existService = service;
            }
          });
        }
      });
    }
    return existProduct !== null ? existProduct : existService;
  }
  back(){
    this.slides.slidePrev();    
  }
  next(){
    this.slides.slideNext();    
  }  
SlideChanges(slide: IonSlides) {
  slide.getActiveIndex().then((index: number) => {
   this.currentIndex= index;
   
      if (this.currentIndex == 0){

      }
      if(this.currentIndex == 3){

      }
  });
} 
clickDistintivo(tag:string, object:any){

  this.showPopUp=true;
  this.insigniaTitle=tag
  this.insigniaDescrip=object
}
closePopUp(){

  this.showPopUp=false;
}
}

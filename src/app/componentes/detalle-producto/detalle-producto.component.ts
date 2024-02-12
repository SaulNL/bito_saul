import { OptionBackLogin } from './../../Modelos/OptionBackLoginModel';
import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { UtilsCls } from "../../utils/UtilsCls";
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ProductosService } from "../../api/productos.service";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PedidoNegocioComponent } from '../pedido-negocio/pedido-negocio.component';
import { NegocioService } from 'src/app/api/negocio.service';

@Component({
    selector: 'app-detalle-producto',
    templateUrl: './detalle-producto.component.html',
    styleUrls: ['./detalle-producto.component.scss'],
    providers: [
        UtilsCls
    ]
})
export class DetalleProductoComponent implements OnInit {

    @Input() datosInfoNegocio: any;
    @Input() public _entregaDomicilio: any;
    @Input() public _entregaSitio: any;
    @Input() public _consumoSitio: any;
    @Input() public _abierto: any;
    @Input() datos: any;
    @Output() llenarLista: EventEmitter<any> = new EventEmitter();
    @Input() bolsa: any;
    @Input() user: any;
    @Input() url: string;
    @Input() isContenido: boolean;
    public subscribe;
    public modal;
    public existeSesion: boolean;
    public cantidad: number;
    public activeSelectedProduct: boolean;
    public typeLogin: OptionBackLogin;
    public isAlert: boolean = false;
    showFullDescription: boolean = false;
    descripcionTruncada: string;
    maxLength: number = 100;

    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
        private platform: Platform,
        private router: Router,
        private servicioProductos: ProductosService,
        public alertController: AlertController,
        private iab: InAppBrowser,
        private negocioService: NegocioService
    ) {
        this.typeLogin = new OptionBackLogin();
        this.existeSesion = utilsCls.existe_sesion();
        this.subscribe = this.platform.backButton.subscribe(() => {
            this.cerrarModal();
        });
        this.cantidad = 1;
        this.activeSelectedProduct = false;
    }

    ngOnInit() {
        if (this.bolsa.length > 0) {
            this.bolsa.forEach(element => {
                if (element.idProducto === this.datos.idProducto) {
                    this.cantidad = element.cantidad;
                    this.activeSelectedProduct = true;
                }
            });
        }
        if (this.existeSesion) {
            if ( this.isContenido){
                this.vistasContenido(this.datos);
            }else{
                this.loVio(this.datos);

            }
        }
        this.truncarDescripcion();
    }

    cerrarModal() {
        if(this.activeSelectedProduct){
            this.agragarproducto();
        } else {
            this.modalController.dismiss({
            'data': null,
        });
        }

    }

    ionViewDidLeave() {
        this.subscribe.unsubscribe();
    }

    get opciones() {
        return (this.option() && this.existeSesion);
    }
    get estaAbierto() {
        return this._abierto === 'ABIERTO';
    }
    private option() {
        return ((this._entregaDomicilio === 1 || this._entregaSitio === 1 || this._consumoSitio === 1) && parseInt(this.datos.precio) > 0);
    }
    aumentar() {
        this.cantidad = this.cantidad + 1;
    }
    disminuir() {
        if (this.cantidad > 1) {
            this.cantidad = this.cantidad - 1;
        }
    }
    agragarproducto() {
        if (this.existeSesion) {
            const producto = {
                infoNegocio: this.datosInfoNegocio,
                productoInfo:  [{
                    idProducto: this.datos.idProducto,
                    precio: this.datos.precio,
                    imagen: this.datos.imagen,
                    cantidad: 1,
                    idNegocio: this.datos.negocio.idNegocio,
                    nombre: this.datos.nombre,
                    descripcion: this.datos.descripcion,
                }]
            };
            this.modalController.dismiss({
                'data': producto
            });
        } else {
            this.typeLogin.type = 'perfil';
            this.typeLogin.url = this.url;
            this.modalController.dismiss({
                'goLogin': this.typeLogin
            });
        }
    }

    agregarContenido() {
        if (this.existeSesion) {
          const producto = {
            infoNegocio: this.datosInfoNegocio,
            productoInfo: [
              {
                idProducto: this.datos.id_contenido,
                precio: this.datos.precio,
                imagen: this.datos.fotografias[0].url_imagen,
                cantidad: 1,
                idNegocio: this.datosInfoNegocio.idNegocio,
                nombre: this.datos.titulo_contenido,
                descripcion: this.datos.descripcion_contenido,
              },
            ],
          };
          this.modalController.dismiss({
            data: producto,
          });
        } else {
          this.typeLogin.type = "perfil";
          this.typeLogin.url = this.url;
          this.modalController.dismiss({
            goLogin: this.typeLogin,
          });
        }
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

    public loVio(producto) {
        let objectoVio = {
            "id_persona": this.user.id_persona, //usuario
            "id_producto": producto.idProducto //idProducto
        };
        this.servicioProductos.quienVioProdu(objectoVio).subscribe(
            response => { if (response.code === 200) { } }, error => { });
    }

    public vistasContenido(contenido) {
        let objectoVio = {
          id_persona: this.user.id_persona, //usuario
          id_contenido: contenido.id_contenido, //contenido
        };
        this.servicioProductos.quienVioContenido(objectoVio).subscribe(
          (response) => {
            if (response.code === 200) {
              console.log(response);
            }
          },
          (error) => {}
        );
      }

    async avisoNegocioCerrado() {
        const alert = await this.alertController.create({
            header: 'Aviso',
            message: 'Este negocio está cerrado, revisa sus horarios para hacer un pedido cuando se encuentre abierto',
            buttons: ['OK']
        });

        await alert.present();
    }
    public login() {
        this.typeLogin.type = 'perfil';
        this.typeLogin.url = this.url;
        this.modalController.dismiss({
            'goLogin': this.typeLogin
        });
    }

    cerrarAlert(isAlert: boolean){
        this.isAlert = isAlert;
    }

    abrirAlert(isAlert: boolean){
        this.isAlert = isAlert;
    }

    verContenido(ruta) {
        this.iab.create('https://docs.google.com/viewer?url=' + ruta);
    }

    truncarDescripcion() {
        if (this.datos.descripcion_contenido.length > this.maxLength) {
            this.descripcionTruncada = this.datos.descripcion_contenido.slice(0, this.maxLength) + '... ';
        } else {
            this.descripcionTruncada = this.datos.descripcion_contenido;
        }
    }

    toggleDescription() {
        if (this.showFullDescription)
        {
            this.showFullDescription = false
        }else{
            this.showFullDescription = true;
        }
    }

    async finalizarCompra(){
        const infoNegocio = this.obtenerInfoNegocio();
        const productoInfo = this.obtenerProductoInfo();
        let listaProductos: any[] = [];
        listaProductos.push(productoInfo);
        this.negocioService.setSelectedObj(this.datosInfoNegocio);
        const modal = await this.modalController.create({
          component: PedidoNegocioComponent,
          componentProps: {
            idNegocio: this.datosInfoNegocio.id_negocio,
            lista: {infoNegocio: infoNegocio, productoInfo: listaProductos },
            _entregaDomicilio: this.datosInfoNegocio.entrega_domicilio,
            _entregaSitio: this.datosInfoNegocio.entrega_sitio,
            _consumoSitio: this.datosInfoNegocio.consumo_sitio,
            _costoEntrega: this.datosInfoNegocio.costo_entrega,
            negocioNombre: this.datosInfoNegocio.nombre_comercial,
            latNegocio: this.datosInfoNegocio.latitud,
            logNegocio: this.datosInfoNegocio.longitud,
            convenio: this.datosInfoNegocio.convenio_entrega,
            contenidoCompleto : this.datos.url_contenido_completo
          },
        });
        await modal.present();
      }

      obtenerInfoNegocio() {
        return this.datosInfoNegocio;
    }
    
    obtenerProductoInfo() {
        return {
            cantidad: 1,
            cantidad_disponibles: null,
            descripcion: this.datos.descripcion_contenido,
            idNegocio: this.datosInfoNegocio.id_negocio,
            idProducto: this.datos.id_contenido,
            imagen: this.datos.fotografias[0].url_imagen,
            nombre: this.datos.titulo_contenido,
            precio: this.datos.precio ? this.datos.precio : 0,
            tipoPoS: 2
        };
    }
}

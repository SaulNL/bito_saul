import { OptionBackLogin } from './../../Modelos/OptionBackLoginModel';
import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { UtilsCls } from "../../utils/UtilsCls";
import { ProductoModel } from "../../Modelos/ProductoModel";
import { ProductosService } from "../../api/productos.service";

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
    public subscribe;
    public modal;
    public existeSesion: boolean;
    public cantidad: number;
    public activeSelectedProduct: boolean;
    public typeLogin: OptionBackLogin;
    public isAlert: boolean = false;
    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
        private platform: Platform,
        private router: Router,
        private servicioProductos: ProductosService,
        public alertController: AlertController
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
            this.loVio(this.datos);
        }
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
}

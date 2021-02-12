import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {ToadNotificacionService} from 'src/app/api/toad-notificacion.service';
import {UtilsCls} from "../../utils/UtilsCls";

@Component({
    selector: 'app-detalle-producto',
    templateUrl: './detalle-producto.component.html',
    styleUrls: ['./detalle-producto.component.scss'],
    providers: [
        UtilsCls
    ]
})
export class DetalleProductoComponent implements OnInit {

    @Input() public _entregaDomicilio: any;
    @Input() public _entregaSitio: any;
    @Input() public _consumoSitio: any;
    @Input() public _abierto: any;
    @Input() datos: any;
    @Output() llenarLista: EventEmitter<any> = new EventEmitter();
    @Input() bolsa: any;
    public subscribe;
    public modal;
    public existeSesion: boolean;
    public cantidad : number;

    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
        private platform: Platform,
        private router: Router,
        public alertController: AlertController
    ) {
        this.existeSesion = utilsCls.existe_sesion();
        this.subscribe = this.platform.backButton.subscribe(() => {
            this.cerrarModal();
        });
        this.cantidad = 1;
    }

    ngOnInit() {
        if (this.bolsa.length > 0) {
            this.bolsa.forEach(element => {
                if (element.idProducto === this.datos.idProducto) {
                    this.cantidad= element.cantidad;
                }
            });
        }
    }

    cerrarModal() {
        this.modalController.dismiss({
            'data': null,
        });
    }

    ionViewDidLeave() {
        this.subscribe.unsubscribe();
    }

    get mostrarComponente() {
        return (this._entregaDomicilio === 1 || this._entregaSitio === 1 || this._consumoSitio === 1) && this.utilsCls.existe_sesion() && parseInt(this.datos.precio) > 0 && this._abierto === 'ABIERTO';
    }

    aumentar(){
        this.cantidad = this.cantidad+1;
    }
    disminuir(){
        if( this.cantidad > 1){
            this.cantidad = this.cantidad-1;
        }
    }
    agragarproducto() {
        //console.log(this.cantidad);
        if (this.existeSesion) {
            const producto = {
                idProducto: this.datos.idProducto,
                precio: this.datos.precio,
                imagen: this.datos.imagen,
                cantidad: this.cantidad,
                idNegocio: this.datos.negocio.idNegocio,
                nombre: this.datos.nombre,
                descripcion: this.datos.descripcion
            };
            this.modalController.dismiss({
                'data': producto,
            });
        } else {
            this.router.navigate(['/tabs/login'])
        }
    }
    async avisoNegocioCerrado() {
        const alert = await this.alertController.create({
          header: 'Aviso',
          message: 'Este negocio está cerrado, revisa sus horarios para hacer un pedido cuando se encuentre abierto',
          buttons: ['OK']
        });
    
        await alert.present();
      }
}

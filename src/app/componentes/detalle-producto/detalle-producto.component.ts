import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, Platform} from "@ionic/angular";
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
    public subscribe;
    public modal;
    public existeSesion: boolean;
    @Input() public pedidos: any;
    @Input() public indexProducto: number;
     public cantidadProducto: number;
    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
        private platform: Platform,
        private router: Router,
    ) {
        this.existeSesion = utilsCls.existe_sesion();
        this.subscribe = this.platform.backButton.subscribe(() => {
            this.cerrarModal();
        });
        this.cantidadProducto = 0;
    }

    ngOnInit() {
        this.buscarProducto();
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

    agragarproducto() {
        if (this.existeSesion) {
            const producto = {
                idProducto: this.datos.idProducto,
                precio: this.datos.precio,
                imagen: this.datos.imagen,
                cantidad: this.cantidadProducto,
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
     buscarProducto(){
   for (let index = 0; index < this.pedidos.length; index++) {
    if(this.datos.idProducto === this.pedidos[index].idProducto){
        this.cantidadProducto =  this.pedidos[index].cantidad;
     }      
   }
     }
     aumentarDismuir( operacion: number) {
        if (operacion === 1 && this.cantidadProducto >= 0) {
             ++this.cantidadProducto;
        }
        if (operacion === 2 && this.cantidadProducto > 1) {
               --this.cantidadProducto;
        }
      }  
}

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
    @Input() public _entregaSitio: boolean;
    @Input() public _consumoSitio: boolean;
    @Input() datos: any;
    @Output() llenarLista: EventEmitter<any> = new EventEmitter();
    public subscribe;
    public modal;
    public existeSesion: boolean;

    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
        private platform: Platform,
        private router: Router,
    ) {
        this.existeSesion = utilsCls.existe_sesion();
        console.log(this.datos);
        this.subscribe = this.platform.backButton.subscribe(() => {
            this.cerrarModal();
        });
    }

    ngOnInit() {
        console.log(this.datos)
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
        return (this._entregaDomicilio === 1 || this._entregaSitio === true || this._consumoSitio === true) && this.utilsCls.existe_sesion() && parseInt(this.datos.precio) > 0;
    }

    agragarproducto() {
        if (this.existeSesion) {
            const producto = {
                idProducto: this.datos.idProducto,
                precio: this.datos.precio,
                imagen: this.datos.imagen,
                cantidad: 1,
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
}

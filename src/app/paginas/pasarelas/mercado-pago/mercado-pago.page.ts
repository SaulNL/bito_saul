import {Component, OnInit} from '@angular/core';
import {BrokersPage} from '../brokers/brokers.page';
import {PasarelasService} from '../../../api/pasarelas/pasarelas.service';
import {INegocioBrokerAT} from '../../../interfaces/pasarelas/INegocioBrokerAT';
import {ITokenNegocio} from '../../../interfaces/pasarelas/ITokenNegocio';
import {ActivatedRoute} from '@angular/router';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';

@Component({
    selector: 'app-mercado-pago',
    templateUrl: './mercado-pago.page.html',
    styleUrls: ['./mercado-pago.page.scss'],
})
export class MercadoPagoPage implements OnInit {

    public idNegocio: string;
    public accessToken: string;
    public loaderGuardar: boolean;

    public datosGuardados = {idNegocioBrokers: null} as INegocioBrokerAT;
    public tokenGuardado = false;
    public respuesta: any;
    public loader: boolean;

    constructor(
        private pasarelaServices: PasarelasService,
        private route: ActivatedRoute,
        private notificacionService: ToadNotificacionService,
    ) {
        this.accessToken = null;
        this.loaderGuardar = false;
        this.loader = false;
    }

    ngOnInit(): void {
        this.route.queryParams
            .subscribe(params => {
                    this.idNegocio = params.idNegocio;
                }
            );
        this.obtenerAT();
    }

    guardarToken() {
        const parametro = new ITokenNegocio();
        parametro.id_negocio = this.idNegocio;
        parametro.accesstoken = this.accessToken;

        this.loaderGuardar = true;
        this.pasarelaServices.guardar(parametro).subscribe(
            res => {
                if (res.code === 200) {
                    this.tokenGuardado = true;
                    this.notificacionService.exito('Token guardado exitosamente');
                } else {
                    this.notificacionService.error(res.message);
                }
            },
            error => {
                console.error(error);
                this.notificacionService.error(error);
            },
            () => {
                this.loaderGuardar = false;
            }
        );
    }

    obtenerAT() {
        const parametro = new ITokenNegocio();
        parametro.id_negocio = this.idNegocio;
        this.loader = true;
        this.pasarelaServices.obtenerAT(parametro).subscribe(
            res => {
                const datos = {} as INegocioBrokerAT;
                if (res.data !== null && res.data !== undefined) {
                    datos.idNegocioBrokers = res.data.negocio_broker.id_negocio_brokers;
                    datos.accessToken = res.data.negocio_broker.access_token;
                    datos.idBroker = res.data.negocio_broker.id_broker;
                    datos.idNegocio = res.data.negocio_broker.id_negocio;
                }
                this.datosGuardados = datos;
                if (this.datosGuardados.idNegocioBrokers !== null) {
                    this.tokenGuardado = true;
                }
                this.loader = false;
            },
            error => {
                {
                    console.error(error);
                    this.notificacionService.error(error);
                }
            },
            () => {
                this.loader = false;
            }
        );
    }

}

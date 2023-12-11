import {Component, Input, OnInit} from '@angular/core';
import {BrokersPage} from '../brokers/brokers.page';
import {PasarelasService} from '../../../api/pasarelas/pasarelas.service';
import {INegocioBrokerAT} from '../../../interfaces/pasarelas/INegocioBrokerAT';
import {ITokenNegocio} from '../../../interfaces/pasarelas/ITokenNegocio';
import {ActivatedRoute} from '@angular/router';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';
import {AppSettings} from '../../../AppSettings';

@Component({
    selector: 'app-mercado-pago',
    templateUrl: './mercado-pago.page.html',
    styleUrls: ['./mercado-pago.page.scss'],
})
export class MercadoPagoPage implements OnInit {

    @Input() public idNegocio: string | null = null;
    public accessToken: string;
    public loaderGuardar: boolean;

    public datosGuardados = {idNegocioBrokers: null} as INegocioBrokerAT;
    public tokenGuardado = false;
    public respuesta: any;
    public loader: boolean;
    public mensaje = '';
    public showPassword: boolean;
    public urlBlob: string = AppSettings.URL_BLOB;

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
        this.obtenerAT();
    }

    guardarToken() {
        const parametro = new ITokenNegocio();
        parametro.id_negocio = this.idNegocio;
        parametro.accesstoken = this.accessToken;

        this.loaderGuardar = true;
        this.pasarelaServices.guardar(parametro).subscribe(
            (res) => {
                const code = res.code;
                this.mensaje = JSON.stringify(code);
                if (res.code === 200) {
                    this.tokenGuardado = true;
                    this.notificacionService.exito('Token guardado exitosamente');
                } else {
                    this.mensaje = typeof res.code;
                    res.message.forEach(i => {
                        this.notificacionService.error(i);
                    });
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
                console.log('res', res);
                const datos = {} as INegocioBrokerAT;
                this.mensaje = "siiiiiiiiiiiiiiiii"
                if (res.data !== null && res.data !== undefined) {
                    datos.idNegocioBrokers = res.data.negocio_broker.id_negocio_brokers;
                    datos.accessToken = res.data.negocio_broker.access_token;
                    datos.idBroker = res.data.negocio_broker.id_broker;
                    datos.idNegocio = res.data.negocio_broker.id_negocio;
                    this.tokenGuardado = true;
                }
                this.datosGuardados = datos;
                // if (this.datosGuardados.idNegocioBrokers !== null) {
                //
                // }
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

    descargarPdf(){
        window.open(this.urlBlob + 'documentos/Manual%20MercadoPago%20Bituyú.pdf', '_blank');
    }

}

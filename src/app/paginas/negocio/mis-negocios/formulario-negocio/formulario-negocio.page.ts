import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Component, OnInit} from '@angular/core';
import {NegocioModel} from '../../../../Modelos/NegocioModel';
import {NegocioService} from '../../../../api/negocio.service';
import {ArchivoComunModel} from '../../../../Modelos/ArchivoComunModel';
import {CatOrganizacionesModel} from '../../../../Modelos/CatOrganizacionesModel';

@Component({
    selector: 'app-formulario-negocio',
    templateUrl: './formulario-negocio.page.html',
    styleUrls: ['./formulario-negocio.page.scss'],
})
export class FormularioNegocioPage implements OnInit {
    public segmentModel = 'informacion';
    public negocioTO: any;
    public negocioGuardar: any;
    public blnActivaEntregas: boolean;
    public blnActivaNegocioFisico: boolean;
    public listTipoNegocio: any;
    public tipoNegoAux: any;
    public lstOrganizaciones: Array<CatOrganizacionesModel>;
    public tipoOrgAux: any;
    public listCategorias: any;
    public tipoGiroAux: any;
    public listaSubCategorias: any;
    public tipoSubAux: any;

    public metodosPago = [
        { id: 1, metodo: "Transferencia Electrónica", value: null },
        { id: 2, metodo: "Tajeta de Crédito", value: null },
        { id: 3, metodo: "Tajeta de Débito", value: null },
        { id: 4, metodo: "Efectivo", value: null }
    ];
    public copyPago = [];


    constructor(
        private alertController: AlertController,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private negocioServicio: NegocioService,
    ) {
        this.negocioGuardar = new NegocioModel();
        this.listCategorias = [];
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.special) {
                let datos = JSON.parse(params.special);
                this.negocioTO = datos.info;
                this.negocioGuardar = datos.pys;
                this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
                this.blnActivaNegocioFisico = this.negocioTO.tipo_negocio;
            }
        });

        this.buscarNegocio(this.negocioTO.id_negocio);
        this.metodosPago = [
            { id: 1, metodo: "Transferencia Electrónica", value: this.negocioTO.tipo_pago_transferencia },
            { id: 2, metodo: "Tajeta de Crédito", value: this.negocioTO.tipo_pago_tarjeta_credito },
            { id: 3, metodo: "Tajeta de Débito", value: this.negocioTO.tipo_pago_tarjeta_debito },
            { id: 4, metodo: "Efectivo", value: this.negocioTO.tipo_pago_efectivo }
        ];
        this.setarPago();
    }


    public buscarNegocio(id) {

        if (this.negocioTO.id_negocio === null || this.negocioTO.id_negocio === undefined) {
            //this.negocioTO = new NegocioModel();
            //this.negocioTO.tags = "";
            // this.categoriaPrincipal({ value: 0 });
            // this.subcategorias({ value: 0 });
        } else {
            this.negocioServicio.buscarNegocio(id).subscribe(
                response => {
                    this.negocioTO = response.data;
                    this.obtenerTipoNegocio();
                    this.obtenerCatOrganizaciones();
                    console.log(this.negocioTO);
                    const archivo = new ArchivoComunModel();
                    archivo.archivo_64 = this.negocioTO.url_logo;
                    archivo.nombre_archivo = this.negocioTO.id_negocio.toString();
                    this.negocioTO.logo = archivo;
                    this.negocioTO.local = archivo;
                    this.categoriaPrincipal({ value: this.negocioTO.id_tipo_negocio });
                    this.subcategorias({ value: this.negocioTO.id_giro });
                },
                error => {
                }
            );
        }
    }

    public obtenerTipoNegocio() {
        this.negocioServicio.obtnerTipoNegocio().subscribe(
            response => {
                this.listTipoNegocio = response.data;
                if (this.negocioTO.id_negocio != null) {
                    this.listTipoNegocio.forEach(element => {
                        if (element.id_tipo_negocio == this.negocioTO.id_tipo_negocio) {
                            this.tipoNegoAux = element.nombre;
                        }
                    });
                }
            },
            error => {
                this.listTipoNegocio = [];
            }
        );
    }

    public obtenerCatOrganizaciones() {
        this.negocioServicio.obtenerCatOrganizaciones().subscribe((response) => {
            this.lstOrganizaciones = Object.values(response.data);
            if (this.negocioTO.id_negocio != null) {
                this.lstOrganizaciones.forEach((element) => {
                    this.negocioTO.organizaciones.forEach((elements) => {
                        if (element.id_organizacion == elements) {
                            this.tipoOrgAux = element.nombre;
                        }
                    });
                });
            }
        });
    }

    categoriaPrincipal(evento) {
        let idE;
        if (evento.type === 'ionChange') {
            this.negocioTO.id_giro = [];
            idE = evento.detail.value;

        } else {
            idE = evento.value;
        }
        this.negocioServicio.categoriaPrincipal(idE).subscribe(
            respuesta => {
                this.listCategorias = respuesta.data;
                if (this.negocioTO.id_negocio != null) {
                    this.listCategorias.forEach(element => {
                        if (element.id_giro == this.negocioTO.id_giro) {
                            this.tipoGiroAux = element.nombre;
                        }
                    });
                }
            }
        );
    }

    subcategorias(evento) {
        let idE;
        if (evento.type === 'ionChange') {
            this.negocioTO.id_categoria_negocio = [];
            idE = evento.detail.value;
        } else {
            idE = evento.value;
        }
        this.negocioServicio.obtenerCategorias(idE).subscribe(
            respuesta => {
                this.listaSubCategorias = Array();
                if (respuesta.code === 200) {
                    this.listaSubCategorias = respuesta.data;
                    this.listaSubCategorias.forEach(element => {
                        if (element.id_categoria == this.negocioTO.id_categoria_negocio) {
                            this.tipoSubAux = element.nombre;

                        }
                    });
                }
            }
        );
    }

    setarPago() {
        this.metodosPago.forEach(i => {
            if (i.value === 1) {
                this.copyPago.push(i);
            }
        });
    }


    async cancelar() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '¿Estas seguro?',
            message: 'Se cancelara todo el proceso?',
            buttons: [
                {
                    text: 'Cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Confirmar',
                    handler: () => {
                        this.router.navigate(['/tabs/home/negocio'], {queryParams: {special: true}});
                    }
                }
            ]
        });

        await alert.present();
    }

    segmentChanged(event) {

    }

}

import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {PromocionesModel} from "../../Modelos/PromocionesModel";
import {PromocionesService} from "../../api/promociones.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {AlertController, IonContent, Platform} from "@ionic/angular";
import {PublicacionesModel} from "../../Modelos/PublicacionesModel";
import {ModalController} from "@ionic/angular";
import {ModalPublicarComponent} from "src/app/components/modal-publicar/modal-publicar.component";
import {QuienVioModel} from "../../Modelos/QuienVioModel";
import {ModalInfoPromoComponent} from "../../components/modal-info-promo/modal-info-promo.component";
import {Router, ActivatedRoute} from "@angular/router";
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { PromocionesSolicitadasModel } from '../../Modelos/PromocionesSolicitadasModel'

@Component({
    selector: "app-mispromociones",
    templateUrl: "./mispromociones.page.html",
    styleUrls: ["./mispromociones.page.scss"],
})
export class MispromocionesPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    public cordenada: number;
    public seleccionTO: PromocionesModel;
    public agregarPromocion: boolean;
    public seleccionaPromocion: boolean;
    public accionFormulario: string;
    public usuario: any;
    public id_proveedor: any;
    public lstPromocionesPublicadas: Array<PromocionesModel>;
    public promocion: PromocionesModel;
    public loaderAnuncios = false;
    public btnBlockedNuevo = false;
    public listaPromoOriginal: Array<PromocionesModel> = [];
    public listaPromociones: Array<PromocionesModel> = [];
    public mostrarNegocios: any = 5;
    public publicacionesHechas: number;
    public publicacionesPermitidas: number;
    public lstPromocionesPublicadasBK: Array<PromocionesModel>;
    public lstAnunciosBK: Array<PromocionesModel>;
    public lstPromoPublicadasBK: Array<PromocionesModel>;
    public blnActivarFormularioEdicion: boolean;
    public filtro: any;
    public filtroAnuncio: any;
    public btnDetallePromocion: boolean;
    public mensajePublicacion = false;
    public blnSelectFecha = false;
    public publicacion: PublicacionesModel;
    public fechas: string;
    public fi: Date;
    public ff: Date;
    public cadena = "";
    public lstQuienVioPublicacionActiva: false;
    public btnLoaderModal = false;
    public lstQuienVioPublicacion: Array<QuienVioModel>;
    public lstPromocionesSolicitadas: Array<PromocionesSolicitadasModel>;
    public numeroVisto: number;
    public blnActivaPromocion: boolean;
    public mostrarListaPromocionesPublicadas = false;
    public mostrarListaAnunciosPublicadas = false;
    public msj = 'Cargando';
    public id: any;
    lstAnuncios: any;
    lstPromo: any;
    lstTipoPromo: any;
    decode: string;
    encode: string;
    json_cupon: any;
    id_persona: any;
    isIOS = false;
    public loaderModal: boolean=true;
    public idPromo: number;

    constructor(
        private _promociones_service: PromocionesService,
        public _notificacionService: ToadNotificacionService,
        private alertController: AlertController,
        public modalController: ModalController,
        private _router: Router,
        private active: ActivatedRoute,
        private barcodeScanner: BarcodeScanner,
        private platform: Platform
    ) {
        this.blnActivaPromocion = true;
    }

    ngOnInit() {
        this.isIOS = this.platform.is("ios");
        this.usuario = JSON.parse(localStorage.getItem("u_data"));
        this.id_persona = this.usuario.id_persona
        this.id_proveedor = this.usuario.proveedor.id_proveedor;
        this.publicacionesHechas = 0;
        this.publicacionesPermitidas = 0;
        this.lstPromocionesPublicadas = new Array<PromocionesModel>();
        this.lstQuienVioPublicacion = new Array<QuienVioModel>();
        this.lstPromocionesSolicitadas = new Array<PromocionesSolicitadasModel>();
        this.lstQuienVioPublicacionActiva = false;
        this.seleccionTO = new PromocionesModel();
        this.promocion = new PromocionesModel();
        this.blnActivarFormularioEdicion = false;
        this.buscar();
        this.active.queryParams.subscribe((params) => {
            if (params && params.special) {
                if (params.special) {
                    this.buscar();
                }
            }
        });
    }
    /**
   * funcion para escanear cupon
   * @author Bere
   */
    public escanearQR(){
        this.barcodeScanner.scan().then(barcodeData => {
            
            this.encode =barcodeData.text;
            
            this.decode = atob(this.encode);

            this.json_cupon= JSON.parse(this.decode);
           
            let cupon = {
                "id_promocion": this.json_cupon.idPromo,
                "id_persona": this.json_cupon.idPer,
                "id_cupon_promocion":this.json_cupon.idCupon,
                "id_persona_aplica":this.id_persona,
            };
              this._promociones_service.validarCupon(cupon).subscribe(

                    (response) => {

                        if (response.data.exito === true) {
                            
                            this._notificacionService.exito("Se valido cupón correctamente");
                          }
                          if (response.data.exito === false) {
                                this._notificacionService.error(response.data.mensaje);
                          }
                    },
                    (error) => {
                        this._notificacionService.error(error);
                        
                    }
                );
           }).catch(err => {
               console.log('Error', err);
           });
    }

    agregar() {
        this.seleccionTO = new PromocionesModel();
        let navigationExtras = JSON.stringify(this.seleccionTO);
        this._router.navigate(["/tabs/home/promociones/agregar-promocion"], {
            queryParams: {special: navigationExtras},
        });
    }

    buscar() {
        this.loaderAnuncios = true;
        this.seleccionaPromocion = false;
        this.btnDetallePromocion = false;
        this.agregarPromocion = false;
        this.cancelarEdicion();
        this.seleccionTO.id_proveedor = this.usuario.proveedor.id_proveedor;
        this._promociones_service.buscar(this.seleccionTO).subscribe(
            (response) => {
                this.listaPromoOriginal = response.data;
                //this.listaPromociones = this.listaPromoOriginal.slice(0, 15);
                this.filtro = "";
                this.filtroAnuncio="";                
                this.obtenerNumeroPublicacionesPromocion();
                this.obtenerPromocionesPublicadas();
            },
            (error) => {
                this._notificacionService.error(error);
            }
        );
    }

    public cancelarEdicion() {
        this.agregarPromocion = false;
        this.seleccionaPromocion = false;
        this.btnBlockedNuevo = false;
        this.btnDetallePromocion = false;
    }

    obtenerNumeroPublicacionesPromocion() {
        this._promociones_service
            .obtenerNumeroPublicacionesPromocion(this.id_proveedor)
            .subscribe(
                (response) => {
                    this.publicacionesHechas = response.data.numPublicacionesPromo;
                    this.publicacionesPermitidas = response.data.numPubliPromoPermitidas;
                },
                (error) => {
                    this._notificacionService.error(error);
                }
            );
    }

    public obtenerPromocionesPublicadas() {
        this._promociones_service
            .obtenerPromocinesPublicadas(this.seleccionTO)
            .subscribe(
                (response) => {
                    this.lstPromocionesPublicadas = response.data;

                    this.lstAnuncios = response.data;
                    this.lstAnuncios = this.lstAnuncios.filter(publicacion => publicacion.id_tipo_promocion === 1);
                    
                    this.lstPromo = response.data;
                    this.lstPromo =  this.lstPromo.filter(publicacion => publicacion.id_tipo_promocion === 2);

                    this.lstPromoPublicadasBK = this.lstPromo.filter(publicacion => publicacion.id_tipo_promocion === 2);
                    this.lstAnunciosBK = this.lstAnuncios.filter(publicacion => publicacion.id_tipo_promocion === 1);
                    this.lstPromocionesPublicadasBK = response.data;
                },
                (error) => {
                    this._notificacionService.error(error);
                }
            );
        this.loaderAnuncios = false;
    }

    public seleccionarPromocion(promocion: PromocionesModel) {
        this.promocion = promocion;
        let navigation = JSON.stringify(this.promocion);
        this._router.navigate(["/tabs/home/promociones/publicar-promocion"], {
            queryParams: {especial: navigation},
        });
    }

    btnBuscar() {
        this.lstPromocionesPublicadas = this.lstPromocionesPublicadasBK;
        this.lstPromocionesPublicadas = this.lstPromocionesPublicadas.filter(
            (element) => {
                return (
                    element.nombre_comercial
                        .toLowerCase()
                        .indexOf(this.filtro.toString().toLowerCase()) > -1 ||
                    element.promocion
                        .toLowerCase()
                        .indexOf(this.filtro.toString().toLowerCase()) > -1
                );
            }
        );
    }
    btnBuscarPromciones() {
        this.lstPromo = this.lstPromoPublicadasBK;
        this.lstPromo = this.lstPromo.filter(
            (element) => {
                return (
                    element.nombre_comercial
                        .toLowerCase()
                        .indexOf(this.filtro.toString().toLowerCase()) > -1 ||
                    element.promocion
                        .toLowerCase()
                        .indexOf(this.filtro.toString().toLowerCase()) > -1
                );
            }
        );
    }

    btnBuscarAnuncios() {
        this.lstAnuncios = this.lstAnunciosBK;
        this.lstAnuncios =this.lstAnuncios.filter(
            (element) => {
                return (
                    element.nombre_comercial
                        .toLowerCase()
                        .indexOf(this.filtroAnuncio.toString().toLowerCase()) > -1 ||
                    element.promocion
                        .toLowerCase()
                        .indexOf(this.filtroAnuncio.toString().toLowerCase()) > -1
                );
            }
        );
    }

    public modificar(seleccionTO: PromocionesModel) {
        this.btnBlockedNuevo = true;
        this.agregarPromocion = true;
        this.btnDetallePromocion = false;
        this.seleccionaPromocion = true;
        this.seleccionTO = seleccionTO;
        this.accionFormulario = "Modificar Promocion";
    }

    public preguntaEliminar(variable: PromocionesModel) {
        this.seleccionTO = variable;
        this.seleccionTO.id_promocion = variable.id_promocion;
        this.alerta();
    }

    async alerta() {
        const alert = await this.alertController.create({
            header: "Esta apunto de eliminar la promoción",
            message: "¿Desea continuar?",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel",
                    handler: () => {
                    },
                },
                {
                    text: "Eliminar",
                    handler: (data) => {
                        this.eliminar();
                    },
                },
            ],
        });

        await alert.present();
    }

    public eliminar() {
        this._promociones_service.eliminar(this.seleccionTO).subscribe(
            (response) => {
                this.buscar();
            },
            (error) => {
                this._notificacionService.error(error);
            }
        );
    }

    public abrirModal(Promocion: PromocionesModel) {
        if (this.publicacionesHechas >= this.publicacionesPermitidas) {
            this.mensajePublicacion = true;
        }

        this.blnSelectFecha = false;
        this.publicacion = new PublicacionesModel();
        this.publicacion.id_promocion = Promocion.id_promocion;
        this.publicacion.id_negocio = Promocion.id_negocio;
        this.fechas = "";
        this.fi = null;
        this.ff = null;
        this.publicarPromocion();
    }

    async publicarPromocion() {
        const modal = await this.modalController.create({
            component: ModalPublicarComponent,
            cssClass: "my-custom-class",
            componentProps: {
                publicacion: this.publicacion,
                mensajePublicacion: this.mensajePublicacion,
                publicacionesPermitidas: this.publicacionesPermitidas,
            },
        });
        await modal.present();
        const {data} = await modal.onDidDismiss();
        if (
            data.data.id_proveedor !== undefined &&
            data.data.id_proveedor !== null
        ) {
            this.buscar();
        }
    }

    dejar(publicada: any, evento, i) {
        if (evento.detail.checked === false) {
            this.presentAlert(i);
        }
        this.seleccionTO = publicada;
    }

    async presentAlert(i: number) {
        const alert = await this.alertController.create({
            cssClass: "my-custom-class",
            header: "Dejar de publicar",
            subHeader: "!Precaución! esta acción no podrá ser revertida",
            message: `¿Desea dejar de publicar esta publicación de la promoción: ${this.seleccionTO.promocion}?`,
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        this.validaRadio(i);
                    },
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.quitarPublicacionPromocion();
                    },
                },
            ],
        });

        await alert.present();
    }

    quitarPublicacionPromocion() {
        this._promociones_service
            .quitarPublicacionPromocion(this.seleccionTO)
            .subscribe(
                (response) => {
                    this.buscar();
                },
                (error) => {
                    this._notificacionService.error(error);
                }
            );
    }

    public abrirModalDetalle(id_promocion, estatus) {
        this.lstQuienVioPublicacionActiva = estatus;

        this.quienVioPublicacion(id_promocion);
        this.listaPromocionesSolicitadas(id_promocion);
        this.loaderModal=false;
        this.idPromo=id_promocion;
    }

    quienVioPublicacion(id_promocion) {
        this.btnLoaderModal = true;

        this._promociones_service.obtenerQuienVioPublicacion(id_promocion).subscribe(
                (response) => {
                    this.lstQuienVioPublicacion = response.data;
                    this.quienNumeroVioPublicacion(id_promocion);
                },
                (error) => {
                }
            );
    }

    listaPromocionesSolicitadas(id_promocion){
        this.btnLoaderModal = true;
        this.id = id_promocion;
        this._promociones_service.obtenerListaPromocionesSolicitadas(id_promocion).subscribe(
            (response) => {
                this.lstPromocionesSolicitadas = response.data;
            },
            (error) => {
            }
        );
        
    }

    quienNumeroVioPublicacion(id_promocion) {
        this._promociones_service
            .obtenerNumeroQuienVioPublicacion(id_promocion)
            .subscribe(
                (response) => {
                    this.numeroVisto = response.data;
                    this.btnLoaderModal = false;
                    this.loaderModal=true;
                    this.infoPromocion();
                },
                (error) => {
                }
            );
    }

    async infoPromocion() {
        
        const modal = await this.modalController.create({
            component: ModalInfoPromoComponent,
            cssClass: "my-custom-class",
            componentProps: {
                lstPromocionesSolicitadas:  this.lstPromocionesSolicitadas,
                id: this.id,
                lstQuienVioPublicacion: this.lstQuienVioPublicacion,
                lstQuienVioPublicacionActiva: this.lstQuienVioPublicacionActiva,
                btnLoaderModal: this.btnLoaderModal,
                numeroVisto: this.numeroVisto,
            },
        });
        return await modal.present();
    }

    regresar() {
        this._router.navigateByUrl("tabs/home/perfil");
    }

    validaRadio(i) {
        let radiobuttons = document.getElementsByTagName("ion-toggle");
        for (let j = 0; j < radiobuttons.length; j++) {
            if (parseInt(radiobuttons[j].value) === i) {

                radiobuttons[j].setAttribute('checked', 'true');
            }
        }
    }


    public recargar(event: any) {
        setTimeout(() => {
          event.target.complete();
          this.ngOnInit();
         
        }, 2000);
    }
}

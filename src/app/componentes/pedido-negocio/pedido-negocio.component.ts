import { ReactiveFormsModule } from '@angular/forms';
import { PedidoNegocioModel } from '../../Modelos/PedidoNegocioModel';
import { Component, Input, OnInit } from '@angular/core';
import { UtilsCls } from "../../utils/UtilsCls";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { icon, Map, Marker, marker, tileLayer } from "leaflet";
import { NegocioService } from "../../api/negocio.service";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { AuthGuardService } from "../../api/auth-guard.service";
/* import { Geolocation } from '@ionic-native/geolocation/ngx'; */
import { IPago } from 'src/app/interfaces/IPago';
import HttpStatusCode from '../../utils/https-status-code';
import { error } from 'protractor';
import { HttpParams } from '@angular/common/http';
import { UbicacionMapa } from '../../api/ubicacion-mapa.service';
import { Plugins } from "@capacitor/core";
import { CatEstadoModel } from 'src/app/Modelos/CatEstadoModel';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { CatMunicipioModel } from 'src/app/Modelos/CatMunicipioModel';
import { MsPersonaModel } from 'src/app/Modelos/MsPersonaModel';
import { CatLocalidadModel } from 'src/app/Modelos/CatLocalidadModel';
import { PersonaService } from '../../api/persona.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { PasarelasService } from "../../api/pasarelas/pasarelas.service";
import Swal from "sweetalert2";
import { IResponse } from "../../interfaces/pasarelas/IResponse";


const { Geolocation } = Plugins;
declare var google: any;
@Component({
    selector: 'app-pedido-negocio',
    templateUrl: './pedido-negocio.component.html',
    styleUrls: ['./pedido-negocio.component.scss'],
    providers: [UtilsCls]
})
export class PedidoNegocioComponent implements OnInit {
    @Input() public idNegocio: number;
    @Input() public _entregaDomicilio: any;
    @Input() public _entregaSitio: any;
    @Input() public _consumoSitio: any;
    @Input() public _costoEntrega: any;
    @Input() lista: any;
    @Input() negocioNombre: string;
    @Input() public latNegocio: number;
    @Input() public logNegocio: number;
    @Input() public convenio: number;
    compraForm: FormGroup;
    features: boolean = false;
    public static readonly TIPO_DE_PAGO_INVALIDO = -1; // Puede ser cualquier numero menor a 0;
    tipoEnvio: any;
    private map: Map;
    public lat: any;
    public lng: any;
    proveedorTO: MsPersonaModel;
    public pagoSeleccion = true;
    public blnUbicacion: boolean;
    public estasUbicacion: any;
    private marker: Marker<any>;
    suma: number;
    sumaTotal: number;
    cantidad: number;
    costoEntrega: number;
    detalle: string;
    public estaAux: any;
    blnCosto: boolean;
    blnCostoLetra: boolean;
    public subscribe;
    public modal;
    public btnEstado: boolean;
    public btnMuncipio: boolean;
    public loader: any;
    public calle: String;
    public numeroInt: String;
    public numeroExt: String;
    public colonia: string;
    public cp: string;
    public msj = 'Realizando pedido';
    public numeroMesa: number;
    private pedido: PedidoNegocioModel;
    public content: string;
    public heading: string;
    public address: string;
    public locaAux: any;
    public pagos: Array<IPago>;
    public idTipoDePago: number;
    public IdEstado: any;
    public IdMunicipio: any;
    public IdLocalidad: any;
    primeraVez: boolean;
    public select_municipio: boolean;
    public list_cat_localidad: Array<CatLocalidadModel>;
    public list_cat_estado: Array<CatEstadoModel>;
    public list_cat_municipio: Array<CatMunicipioModel>;
    public muniAux: any;
    public blnBuscadoLocalidades: boolean;
    public direccionUser: any;
    negocioTO: any;
    distancia: any;
    tiempo: any;
    kilometros: number;
    minutos: number;
    convenioEntrega: number;
    costoDeEnvio: number;
    origen: any;
    destino: any;
    dstn: number;
    tmp: number;
    infoNegocio: any;
    constructor(
        private utilsCls: UtilsCls,
        private modalController: ModalController,
        private negocioService: NegocioService,
        private mesajes: ToadNotificacionService,
        public alertController: AlertController,
        private platform: Platform,
        private guard: AuthGuardService,
        private servicioPersona: PersonaService,
        private _general_service: GeneralServicesService,
        /* private geolocation: Geolocation, */
        private _utils_cls: UtilsCls,
        public getCoordinatesMap: UbicacionMapa,
        public formBuilder: FormBuilder,
        private pasarelaServicies: PasarelasService

    ) {
        this.lat = 19.31905;
        this.numeroMesa = 0;
        this.address = '';
        this.lng = -98.19982;
        this.subscribe = this.platform.backButton.subscribe(() => {
            this.cerrarModal();
            this.loader = false;
        });
        this.idTipoDePago = PedidoNegocioComponent.TIPO_DE_PAGO_INVALIDO;
        this.list_cat_estado = [];
        this.btnEstado = false;
        this.calle = "";
        this.numeroInt = "";
        this.numeroExt = "";
        this.colonia = "";
        this.cp = "";
    }

    ngOnInit() {
        this.infoNegocio = this.negocioService.getSelectedObj();
        this.ObtenerDireccionPersonal();
        this.validarCosto();
        if (this._entregaDomicilio === 1) {
            this.tipoEnvio = 2;
        } else {
            this.tipoEnvio = null;
        }
        this.primeraVez = true;
        this.loadMap();
        this.sumarLista();
        this.cargarTipoDePagos();
        this.obtenerFeatures();
    }
    async obtenerFeatures() {
        await this._general_service.features(this.idNegocio).subscribe(
            response => {
                //console.log("FEATURES del id_negocio " + this.idNegocio + ", " + JSON.stringify(response))
                if (response.data.lenght != 0) {
                    response.data.forEach(feature => {
                        if (feature.id_caracteristica == 2) {
                            this.features = true;
                        }
                    });
                } else {
                    this.features = false;
                }
            },
            error => {
                console.log("error" + error)
            }
        );
    }
    cargarTipoDePagos() {
        this.negocioService.obtenerTiposDePagosPorNegocio(this.idNegocio)
            .subscribe((respuesta) => {
                if (respuesta.code === HttpStatusCode.OK as number) {
                    this.pagos = respuesta.data.list_cat_tipo_pago as Array<IPago>;
                    this.pagos.push({ id_tipo_pago: 99, nombre: 'Mercado pago', activo: true });
                } else {
                    this.pagos = new Array<IPago>();
                }
            }, error => {
                this.pagos = new Array<IPago>();
            });
        this.load_cat_estados();
    }
    contienTipoDePagos() {
        return this.pagos.length > 0;
    }

    loadMap() {
        setTimeout(it => {
            const lat = this.lat;
            const lng = this.lng;
            this.map = new Map("mapIdPedidoBolsa").setView([lat, lng], 14);
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
            this.map.on('click', respuesta => {
                this.getLatLong(respuesta);
            });
            const myIcon = icon({
                iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
                iconSize: [45, 41],
                iconAnchor: [13, 41],
            });
            this.marker = marker([lat, lng], { icon: myIcon, draggable: true }).addTo(this.map);
            this.marker.on("dragend", () => {

                this.getLatLong({ latlng: this.marker.getLatLng() });
            });
        }, 500);
    }

    cerrarModal() {
        this.modalController.dismiss({
            data: this.lista
        });
    }

    ionViewDidLeave() {
        this.subscribe.unsubscribe();
    }

    eliminar(index) {
        this.lista.pop(index);
        this.sumarLista();
        if (this.suma === 0) {
            this.lista = [];
            this.cerrarModal();
            this.guard.tf = true;
        }
    }

    ObtenerDireccionPersonal() {
        const id = this.utilsCls.getIdPersona();
        this.servicioPersona.datosUsuario(id).subscribe(
            respuesta => {
                var dato = respuesta.data.persona.domicilio;
                this.direccionUser = respuesta.data.persona.domicilio;
                this.calle = dato.calle;
                this.numeroInt = dato.numero_int == null ? "" : dato.numero_int;
                this.numeroExt = dato.numero_ext == null ? "" : dato.numero_ext;
                this.colonia = dato.colonia;
                this.cp = dato.codigo_postal;
                this.load_cat_estados();
            },
            error => {

            }
        );
    }

    private load_cat_estados() {
        this._general_service.getEstadosWS().subscribe(
            response => {
                if (this._utils_cls.is_success_response(response.code)) {
                    this.list_cat_estado = response.data.list_cat_estado;
                    this.list_cat_estado.forEach(element => {
                        if (element.id_estado === this.direccionUser.id_estado) {
                            this.IdEstado = element;
                            this.get_list_cat_municipio_personal(element);
                        }
                    });
                }
            },
            error => {
                this.mesajes.error(error);
            }
        );
    }
    public get_list_cat_municipio(event) {
        let idE;

        if (event !== undefined) {

            if (!this.primeraVez) {
                this.btnEstado = false;
                this.list_cat_municipio = [];
                this.proveedorTO.det_domicilio.id_municipio = undefined;
                this.proveedorTO.det_domicilio.id_localidad = undefined;
            }
            if (event.type === 'ionChange') {
                idE = event.detail.value.id_estado;
            } else {
                idE = event.value.id_estado;
            }
            this.btnEstado = false;
            this._general_service.getMunicipiosAll(idE).subscribe(
                response => {
                    if (this._utils_cls.is_success_response(response.code)) {
                        this.list_cat_municipio = response.data.list_cat_municipio;
                        this.btnEstado = true;
                    }
                },
                error => {
                    this.mesajes.error(error);

                }
            );
        } else {
            this.btnEstado = false;
            this.list_cat_municipio = [];
            this.proveedorTO.det_domicilio.id_municipio = undefined;
            this.proveedorTO.det_domicilio.id_localidad = undefined;
        }
    }
    public get_list_cat_municipio_personal(event) {
        if (event !== undefined) {
            if (!this.primeraVez) {
                this.btnEstado = false;
                this.list_cat_municipio = [];
                this.proveedorTO.det_domicilio.id_municipio = undefined;
                this.proveedorTO.det_domicilio.id_localidad = undefined;
            }
            this.btnEstado = false;
            this._general_service.getMunicipiosAll(event.id_estado).subscribe(
                response => {
                    if (this._utils_cls.is_success_response(response.code)) {
                        this.list_cat_municipio = response.data.list_cat_municipio;
                        this.list_cat_municipio.forEach(element2 => {
                            if (element2.id_municipio === this.direccionUser.id_municipio) {
                                this.IdMunicipio = element2;
                                this.get_list_cat_localidad_personal(element2);
                            }
                        });
                        this.btnEstado = true;
                    }
                },
                error => {
                    this.mesajes.error(error);
                }
            );
        } else {
            this.btnEstado = false;
            this.list_cat_municipio = [];
            this.proveedorTO.det_domicilio.id_municipio = undefined;
            this.proveedorTO.det_domicilio.id_localidad = undefined;
        }
    }
    public get_list_cat_localidad(event, reset: boolean = false) {
        let id;
        if (event !== undefined) {
            if (!this.primeraVez) {

                this.list_cat_localidad = [];
            }
            if (event.type === 'ionChange') {
                id = event.detail.value.id_municipio;
            } else {
                id = event.value.id_municipio;
            }
            this._general_service.getLocalidadAll(id).subscribe(
                response => {
                    if (this._utils_cls.is_success_response(response.code)) {
                        this.list_cat_localidad = response.data.list_cat_localidad;
                        this.primeraVez = false;
                    }
                },
                error => {
                    this.mesajes.error(error);
                    this.primeraVez = false;
                }
            );
        } else {

            this.list_cat_localidad = [];
        }
    }

    public get_list_cat_localidad_personal(event, reset: boolean = false) {
        this._general_service.getLocalidadAll(event.id_municipio).subscribe(
            response => {
                if (this._utils_cls.is_success_response(response.code)) {
                    this.list_cat_localidad = response.data.list_cat_localidad;
                    this.primeraVez = false;
                    this.list_cat_localidad.forEach(element => {
                        if (element.id_localidad === this.direccionUser.id_localidad) {
                            this.IdLocalidad = element.nombre;
                        }
                    });
                }
            },
            error => {
                this.mesajes.error(error);
                this.primeraVez = false;
            }
        );
    }

    public geocodeLatLng() {
        const geocoder = new google.maps.Geocoder;
        let latlong = {
            lat: parseFloat(String(this.lat)),
            lng: parseFloat(String(this.lng))
        };

        geocoder.geocode({ location: latlong }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.estasUbicacion = results[0].formatted_address;
                } else {
                }
            } else {
            }
        });
    }
    public geocodeLatLng2() {
        const geocoder = new google.maps.Geocoder;
        let latlong = {
            lat: parseFloat(String(this.lat)),
            lng: parseFloat(String(this.lng))
        };

        geocoder.geocode({
            location: latlong
        }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.estasUbicacion = results[0].formatted_address;
                } else { }
            } else { }
        });
    }
    private enviarSms(telephone: number, idNegocio: number) {
        this.negocioService.enviarMensajePedido(telephone, idNegocio).subscribe(
            respuesta => {
                if (respuesta.code === 500) {
                    this.mesajes.error(respuesta.message);
                }
                this.loader = false;
                this.guard.tf = true;
                this.mesajes.exito('Pedido realizado con éxito');
                this.lista = [];
                this.cerrarModal();
            }, () => {
                this.loader = false;
                this.mesajes.error('Ocurrió un error al generar el pedido');
            }
        );
    }

    private registrarPedido(pedido: PedidoNegocioModel) {
        const datos = JSON.parse(localStorage.getItem('u_data'));
        const telephoneUsuario = datos.celular;

        const auxPedido = Object.assign({}, pedido);

        if (pedido.idTipoPago === 99) {
            pedido.idTipoPago = 1;
        }

        let banderaMP = true;

        if (auxPedido.idTipoPago === 99) {
            pedido.pedido.forEach(function (value) {
                if (value.tipoPoS === 1 && value.cantidad_disponibles === null) {
                    banderaMP = false;
                } else if (value.tipoPoS === 1 && value.cantidad_disponibles !== null) {
                    banderaMP = true;
                } else if (value.tipoPoS === 2 && value.cantidad_disponibles === null) {
                    banderaMP = true;
                }
            });
        }

        if (banderaMP) {
            this.negocioService.registrarPedido(pedido).subscribe(
                (response) => {
                    if (response.code === 200) {
                        if (auxPedido.idTipoPago === 99) {
                            this.pedidoOrdenMP(response.data);
                        } else {
                            // Validar que el usuario ya haya regisrado su informacion(se queda CARGANDO)
                            this.enviarSms(telephoneUsuario, this.lista[0].idNegocio);
                            this.loader = false;
                        }
                    } else if (response.code === 302) {
                        this.loader = false;
                        this.mesajes.error(response.message);
                    }
                    else {
                        this.mesajes.error('Ocurrió un error al generar el pedido');
                    }
                }, () => {
                    this.loader = false;
                    this.mesajes.error('Ocurrió un error al generar el pedido');
                }
            );
        } else {
            this.loader = false;
            this.mesajes.error('Para pagar con mercado pago el producto debe definir disponibilidad');
        }
    }

    pedidoOrdenMP(data) {
        data.type_request = 'mobile';
        data.type_mobile = this.platform.is('ios') ? 'ios' : 'android';
        this.pasarelaServicies.pedidoOrdenMP(data).subscribe(
            response => {
                this.cerrarModal();
                window.open(JSON.parse(response).data.init_point);
            }
        );
    }

    public realizarPedido() {
        this.loader = true;
        this.pedido = new PedidoNegocioModel(this.lista[0].idNegocio, this.utilsCls.getIdPersona(), this.tipoEnvio, this.lista, this.idTipoDePago);
        this.pedido.detalle = this.detalle;
        if (this.tipoEnvio !== null) {
            switch (this.tipoEnvio) {
                case 1:
                    this.pedido.numeroMesa = this.numeroMesa;
                    this.registrarPedido(this.pedido);
                    break;
                case 2:
                    this.pedido.direccion = this.estasUbicacion;
                    this.pedido.latitud = this.lat;
                    this.pedido.longitud = this.lng;
                    // this.pedido.direccion = this.address;

                    if (this.convenio === 1) {
                        this.pedido.costo_envio = this.costoEntrega;
                        this.pedido.kilometros = parseFloat(this.distancia);
                        this.pedido.minutos = parseFloat(this.tiempo);

                    } else if (this.convenio === 0) {
                        this.pedido.costo_envio = this.infoNegocio.costo_entrega;
                    }
                    this.registrarPedido(this.pedido);
                    break;
                case 3:
                    this.registrarPedido(this.pedido);
                    break;
            }
        } else {
            this.loader = false;
            this.presentAlert("Debe seleccionar el Tipo de Entrega");
        }
    }

    private sumarLista() {
        this.suma = 0
        this.sumaTotal = 0
        this.lista.map(it => {
            this.suma = this.suma + (it.precio * it.cantidad)
        })
        this.sumaTotal = this.suma

        if (this.tipoEnvio === 2) {
            if (this.blnCosto === false) {
                this.costoEntrega = 0;
            }
            this.sumaTotal = this.sumaTotal + this.costoEntrega;
        }

    }

    cambiarTipo(evento) {
        this.tipoEnvio = parseInt(evento.detail.value);

        this.sumarLista();
        if (this.tipoEnvio === 2) {
            setTimeout(it => {
                this.loadMap();
            }, 300);
        }
    }

    /**
     * Funcion para obtener la ubicacion actual
     */
    async localizacionTiempo() {
        await Geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.map.panTo([this.lat, this.lng]);
            this.marker.setLatLng([this.lat, this.lng]);
            this.geocodeLatLng();

        }).catch((error) => {

        });
    }

    getLatLong(e) {
        this.lat = e.latlng.lat;
        this.lng = e.latlng.lng;
        this.map.panTo([this.lat, this.lng]);
        this.marker.setLatLng([this.lat, this.lng]);
        this.geocodeLatLng();
    }

    aumentarDismuir(cantidad: number, index: number, operacion: number) {
        let valor = this.lista[index].cantidad;
        if (operacion === 1 && cantidad >= 1) {
            this.lista[index].cantidad = ++valor;
            this.sumarLista();
        }
        if (operacion === 2 && cantidad > 1) {
            this.lista[index].cantidad = --valor;
            this.sumarLista();
        }
    }

    async presentAlertConfirm(i) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '¿Esta seguro que desea Eliminar?',
            message: 'Recuerde que la acción es ireversible',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    role: 'destructive',
                    text: 'Confirmar',
                    handler: () => {
                        this.eliminar(i);
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentAlert(texto: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Aviso',
            message: texto,
            buttons: ['OK']
        });

        await alert.present();
    }

    validarCosto() {
        if (this.convenio != 0) {

        } else {
            if (parseInt(this._costoEntrega) >= 0) {
                this.costoEntrega = parseInt(this._costoEntrega);
                this.blnCosto = true;
                this.blnCostoLetra = false;
            } else {
                this.blnCosto = false;
                this.blnCostoLetra = true;
            }

        }

    }

    async presentAlertCancelar() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '¿Esta seguro que desea cancelar tu pedido ?',
            message: 'Recuerde que la acción es ireversible',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    role: 'destructive',
                    text: 'Confirmar',
                    handler: () => {
                        this.cancelarPedido();
                    }
                }
            ]
        });
        await alert.present();
    }

    cancelarPedido() {
        this.lista = [];
        this.guard.tf = true;
        this.cerrarModal();
    }

    public productoImagen(imagen: any) {
        if (Array.isArray(imagen)) {
            return imagen[0];
        }
        return imagen;
    }

    public numeroMesaMas() {
        this.numeroMesa = this.numeroMesa + 1;
    }

    public numeroMesaMenos() {
        if (this.numeroMesa > 1) {
            this.numeroMesa = this.numeroMesa - 1;
        }
    }

    public rTantidad(cantidad: number) {
        return cantidad === 0;
    }
    public seleccionarTipoPago(event: any) {
        this.idTipoDePago = event.target.value;
        this.pagoSeleccion = false;
    }

    async getCoordinates() {
        this.address = "";
        if (this.calle != "") {
            this.address += this.calle + ", ";
        }
        if (this.numeroExt != "") {
            this.address += this.numeroExt + ", ";
        }
        if (this.colonia != "") {
            this.address += this.colonia + ", ";
        }
        if (this.IdLocalidad != "") {
            this.address += this.IdLocalidad + ", ";
        }
        if (this.cp != "") {
            this.address += this.cp + ", ";
        }
        if (this.IdMunicipio.nombre != "") {
            this.address += this.IdMunicipio.nombre + ", ";
        }
        if (this.IdEstado.nombre != "") {
            this.address += this.IdEstado.nombre + ", México";
        }
        this.getCoordinatesMap.getPosts(this.address)
            .then(async data => {
                let arrayPosts: any = data;
                let latitud = arrayPosts.results[0].geometry.location.lat;
                let longitud = arrayPosts.results[0].geometry.location.lng;

                this.lat = latitud;
                this.lng = longitud;
                this.map.panTo([latitud, longitud]);
                this.marker.setLatLng([latitud, longitud]);
                this.geocodeLatLng2();
            }).catch((error) => {
                this.mesajes.error("Ocurrió un error al consultar la dirección, intente de nuevo más tarde ");
            })
    }

    async activar() {

        this.origen = this.latNegocio + ',' + this.logNegocio
        this.address = "";
        if (this.calle != "") {
            this.address += this.calle + ", ";
        }
        if (this.numeroExt != "") {
            this.address += this.numeroExt + ", ";
        }
        if (this.colonia != "") {
            this.address += this.colonia + ", ";
        }
        if (this.IdLocalidad != "") {
            this.address += this.IdLocalidad + ", ";
        }
        if (this.cp != "") {
            this.address += this.cp + ", ";
        }
        if (this.IdMunicipio.nombre != "") {
            this.address += this.IdMunicipio.nombre + ", ";
        }
        if (this.IdEstado.nombre != "") {
            this.address += this.IdEstado.nombre + ", México";
        }
        this.getCoordinatesMap.getPosts(this.address)
            .then(async data => {
                let arrayPosts: any = data;

                let latitud = arrayPosts.results[0].geometry.location.lat;
                let longitud = arrayPosts.results[0].geometry.location.lng;

                this.lat = latitud;
                this.lng = longitud;

                //this.geocodeLatLng2();

            }).catch((error) => {
                this.mesajes.error("Ocurrió un error al consultar la dirección, intente de nuevo más tarde ");
            })

        this.destino = this.lat + ',' + this.lng;
        var responseDistKm = await this.getCoordinatesMap.getDistanciaKmTiempo(this.origen, this.destino).toPromise();

        if (responseDistKm.status == "OK") {


            this.distancia = responseDistKm.routes[0].legs[0].distance.text;
            this.tiempo = responseDistKm.routes[0].legs[0].duration.text;

            this.dstn = parseFloat(this.distancia);

            this.tmp = parseFloat(this.tiempo);

            var response = await this.negocioService.calcularCostoDeEnvio(this.tmp, this.dstn).toPromise();
            if (this.convenio === 1) {
                this.costoDeEnvio = response.data.total;
                this.costoEntrega = this.costoDeEnvio;
            } else if (this.convenio === 0) {
                this.costoDeEnvio = parseInt(this.infoNegocio.costo_entrega);
                this.costoEntrega = this.costoDeEnvio;
            }
            this.sumarLista();


        } else {
            this.distancia = "";
            this.tiempo = "";
        }

    }
    compraValidacion() {
        this.compraForm = new FormGroup({

        })
    }

}

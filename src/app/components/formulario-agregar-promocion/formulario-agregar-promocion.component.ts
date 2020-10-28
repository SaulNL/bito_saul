import {Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PromocionesModel} from '../../Modelos/PromocionesModel';
import {NegocioModel} from '../../Modelos/NegocioModel';
import {NegocioService} from '../../api/negocio.service';
import {ToadNotificacionService} from '../../api/toad-notificacion.service';
import {UtilsCls} from '../../utils/UtilsCls';
import {ArchivoComunModel} from '../../Modelos/ArchivoComunModel';
import {RecorteImagenComponent} from '../../components/recorte-imagen/recorte-imagen.component';
import {ModalController} from '@ionic/angular';
import {PromocionesService} from '../../api/promociones.service';
import {PublicacionesModel} from '../../Modelos/PublicacionesModel';
import {log} from "util";


@Component({
    selector: 'app-formulario-agregar-promocion',
    templateUrl: './formulario-agregar-promocion.component.html',
    styleUrls: ['./formulario-agregar-promocion.component.scss'],
    providers: [
        UtilsCls
    ]
})
export class FormularioAgregarPromocionComponent implements OnInit {

    @Input() public actualTo: PromocionesModel;
    public lstNegocios: Array<NegocioModel>;
    public loaderNegocios = false;
    public usuario: any;
    public btnCambiarImagen: boolean;
    public blnImgCuadrada: boolean;
    public procesando_img: boolean;
    public maintainAspectRatio: boolean = false;
    public resizeToWidth: number = 0;
    public resizeToHeight: number = 0;
    public tipoImagen: number = 0;
    public imageChangedEvent: any = '';
    public blnImgRectangulo: boolean;
    public blnImgPoster: boolean;
    public publicacion: PublicacionesModel;
    public blnDescripcion = false;
    public descripcionString: string;
    @ViewChild('inputTarjeta') inputTar: ElementRef;
    @ViewChild('inputBanner') inputBanner: ElementRef;
    public loader = false;
    @Output() public _buscar = new EventEmitter();
    @Output() public _cancelarEdicion = new EventEmitter();
    public tags = [];

    constructor(
        private _negocio_service: NegocioService,
        public _notificacionService: ToadNotificacionService,
        private _utils_cls: UtilsCls,
        public modalController: ModalController,
        private _promociones_service: PromocionesService
    ) {
    }

    ngOnInit() {
        if (this.actualTo.id_promocion === 0) {
            this.actualTo.id_promocion = null;
        }
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
        this.btnCambiarImagen = true;
        this.blnImgCuadrada = true;
        this.blnImgCuadrada = !(this.actualTo.url_imagen !== '');
        this.blnImgRectangulo = !(this.actualTo.url_imagen_banner !== '');
        this.blnImgPoster = !(this.actualTo.url_imagen_poster !== '');
        this.buscarNegocios();
        console.log(this.actualTo);
    }

    buscarNegocios() {
        this.loaderNegocios = true;
        this._negocio_service.misNegocios(this.usuario.proveedor.id_proveedor).subscribe(
            response => {
                this.lstNegocios = response.data;
                this.loaderNegocios = false;
                window.scrollTo({top: 0, behavior: 'smooth'});
            },
            error => {
                this._notificacionService.error(error);
            }
        );
    }

    agregarTags(tags: string[]) {
        this.tags = tags;
    }

    public subir_imagen_cuadrada(event) {
        if (event.target.files && event.target.files.length) {
            let height;
            let width;
            for (const archivo of event.target.files) {
                const reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload = () => {
                    const img = new Image();
                    img.src = reader.result as string;
                    img.onload = () => {
                        height = img.naturalHeight;
                        width = img.naturalWidth;
                        if (width === 400 && height === 400) {
                            this.procesando_img = true;
                            const file_name = archivo.name;
                            const file = archivo;
                            if (file.size < 3145728) {
                                let file_64: any;
                                const utl = new UtilsCls();
                                utl.getBase64(file).then(
                                    data => {
                                        file_64 = data;
                                        const imagen = new ArchivoComunModel();
                                        imagen.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                                        imagen.archivo_64 = file_64;
                                        this.actualTo.imagen = imagen;
                                        this.procesando_img = false;
                                        this.blnImgCuadrada = false;
                                    }
                                );
                            } else {
                                this._notificacionService.alerta('archivo pesado');
                            }
                        } else {
                            this.resizeToWidth = 400;
                            this.resizeToHeight = 400;
                            this.fileChangeEvent(event);
                            this.abrirModalImagen(event, this.resizeToWidth, this.resizeToHeight).then(r => {

                                this.actualTo.imagen = {
                                    nombre_archivo : r.nombre_archivo,
                                    archivo_64: r.data
                                }
                                this.blnImgCuadrada = false;
                                }
                            );
                        }
                    };
                };
            }
        }
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    async abrirModalImagen(evento, width, heigh) {
        const modal = await this.modalController.create({
            component: RecorteImagenComponent,
            cssClass: 'my-custom-class',
            componentProps: {
                imageChangedEvent: evento,
                resizeToWidth: width,
                resizeToHeight: heigh,
            }
        });
        await modal.present();
        const {data} = await modal.onDidDismiss().then(r => {
           return r
            }
        );
        return data;
        // if (data != null) {
        //     return data;
        //     // this.actualTo = data.data;
        //     // this.actualTo.imagen = {
        //     //     archivo_64: data.data,
        //     //     nombre_archivo: data.nombre_archivo
        //     // }
        // }
    }

    public subir_imagen_rectangulo(event) {
        if (event.target.files && event.target.files.length) {
            let height;
            let width;
            for (const archivo of event.target.files) {
                const reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload = () => {
                    const img = new Image();
                    img.src = reader.result as string;
                    img.onload = () => {
                        height = img.naturalHeight;
                        width = img.naturalWidth;

                        if (width === 1500 && height === 300) {
                            this.procesando_img = true;
                            const file_name = archivo.name;
                            const file = archivo;
                            if (file.size < 3145728) {
                                let file_64: any;
                                const utl = new UtilsCls();
                                utl.getBase64(file).then(
                                    data => {
                                        file_64 = data;
                                        const imagen = new ArchivoComunModel();
                                        imagen.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                                        imagen.archivo_64 = file_64;
                                        this.actualTo.imagenBanner = imagen;
                                        this.procesando_img = false;
                                        this.blnImgRectangulo = false;
                                    }
                                );
                            } else {
                                this._notificacionService.alerta('error de imagen');
                            }
                        } else {
                            this.abrirModalImagen(event, 1500, 300).then(r=>{
                                this.actualTo.imagenBanner = {
                                    nombre_archivo : r.nombre_archivo,
                                    archivo_64: r.data
                                }
                                this.blnImgRectangulo = false;
                            });
                        }
                    };
                };
            }
        }
    }

    decripcionSelect() {
        if (this.publicacion.id_negocio.toString() !== 'undefined') {
            this.lstNegocios.map(valor => {
                if (valor.id_negocio === Number(this.publicacion.id_negocio)) {
                    this.blnDescripcion = true;
                    this.descripcionString = valor.descripcion;
                }
            });
        } else {
            this.blnDescripcion = false;
            this.descripcionString = undefined;
        }
    }

    public guardar(form: NgForm) {
        if ((this.actualTo.imagen === undefined || this.actualTo.imagen === null)
            && (this.actualTo.url_imagen === undefined || this.actualTo.url_imagen === '')) {
            this._notificacionService.error('La imagen para tarjeta de la promoción es requerida');
            this.inputTar.nativeElement.focus();
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }

        if ((this.actualTo.imagenBanner === undefined || this.actualTo.imagenBanner === null)
            && (this.actualTo.url_imagen_banner === undefined || this.actualTo.url_imagen_banner === '')) {
            this._notificacionService.error('La imagen del banner de la promoción es requerida');
            this.inputBanner.nativeElement.focus();
            window.scrollTo({top: 200, behavior: 'smooth'});
            return;
        }

        if (form.valid) {
            this.loader = true;
            this.actualTo.id_proveedor = this.usuario.proveedor.id_proveedor;
            this.actualTo.tags = this.tags;
            this._promociones_service.guardar(this.actualTo).subscribe(
                response => {
                    if (this._utils_cls.is_success_response(response.code)) {
                        this.loader = false;
                        form.resetForm();
                        this._buscar.emit();
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    }
                    if (response.code === 402) {
                        this._notificacionService.alerta(response.message);
                        this.loader = false;
                        form.resetForm();
                        this._buscar.emit();
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    }
                    this._notificacionService.configToad(response.message, response.code);
                },
                error => {
                    this._notificacionService.error(error);
                }
            );
        } else {
            this._notificacionService.error('Es requerido que llenes todos los campos obligatorios');
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    cancelarEdicion() {
        this._cancelarEdicion.emit()
    }

}

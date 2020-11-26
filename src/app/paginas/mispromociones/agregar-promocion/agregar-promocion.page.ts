import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromocionesModel } from '../../../Modelos/PromocionesModel';
import { NegocioModel } from '../../../Modelos/NegocioModel';
import { NgForm } from '@angular/forms';
import { NegocioService } from '../../../api/negocio.service';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import { PublicacionesModel } from '../../../Modelos/PublicacionesModel';
import { UtilsCls } from '../../../utils/UtilsCls';
import { ArchivoComunModel } from '../../../Modelos/ArchivoComunModel';
import { RecorteImagenComponent } from '../../../components/recorte-imagen/recorte-imagen.component';
import { ModalController } from '@ionic/angular';
import { PromocionesService } from '../../../api/promociones.service';

@Component({
  selector: 'app-agregar-promocion',
  templateUrl: './agregar-promocion.page.html',
  styleUrls: ['./agregar-promocion.page.scss'],
  providers: [
    UtilsCls
  ]
})
export class AgregarPromocionPage implements OnInit {
  
  public seleccionTo: PromocionesModel;
  public tags = [];
  public lstNegocios: Array<NegocioModel>;
  public loaderNegocios = false;
  public usuario: any;
  public publicacion: PublicacionesModel;
  public descripcionString: string;
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
  @ViewChild('inputTarjeta') inputTar: ElementRef;
  @ViewChild('inputBanner') inputBanner: ElementRef;

  constructor( private route: ActivatedRoute,
               private _negocio_service: NegocioService,
               public _notificacionService: ToadNotificacionService,
               private _utils_cls: UtilsCls,
               public modalController: ModalController,
               private _router: Router,
               private _promociones_service: PromocionesService
             ) { 
    this.seleccionTo = new PromocionesModel();
    this.publicacion = new PublicacionesModel();
  }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
      if (params && params.special) {
        this.seleccionTo = JSON.parse( params.special );
      }
    });
    if (this.seleccionTo.id_promocion === 0 ) {
      this.seleccionTo.id_promocion = null;
    }
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.btnCambiarImagen = true;
    this.blnImgCuadrada = true;
    this.blnImgCuadrada = !(this.seleccionTo.url_imagen !== '');
    this.blnImgRectangulo = !(this.seleccionTo.url_imagen_banner !== '');
    this.blnImgPoster = !(this.seleccionTo.url_imagen_poster !== '');
    this.buscarNegocios();
  }

  public agregarTags( event ) {
    this.tags = event;
  }

  buscarNegocios() {
    this.loaderNegocios = true;
    this._negocio_service.misNegocios(this.usuario.proveedor.id_proveedor).subscribe(
      response => {
        this.lstNegocios = response.data;
        this.loaderNegocios = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  decripcionSelect() {
    if (this.publicacion.id_negocio.toString() !== 'undefined') {
      this.lstNegocios.map(valor => {
        if (valor.id_negocio === Number(this.publicacion.id_negocio)) {
          this.descripcionString = valor.descripcion;
        }
      });
    } else {
      this.descripcionString = undefined;
    }
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
            if (width === 400 &&  height === 400) {
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
                    this.seleccionTo.imagen = imagen;
                    this.procesando_img = false;
                    this.blnImgCuadrada = false;
                  }
                );
              } else {
                this._notificacionService.alerta('archivo pesado');
              }
            }else{
              this.maintainAspectRatio = true;
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.tipoImagen = 1;
              this.fileChangeEvent(event);
              this.abrirModalImagen();
            }
          };
        };
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async abrirModalImagen() {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'actualTo': this.seleccionTo,
        'imageChangedEvent': this.imageChangedEvent,
        'maintainAspectRatio': this.maintainAspectRatio,
        'resizeToWidth': this.resizeToWidth,
        'resizeToHeight': this.resizeToHeight,
        'tipoImagen': this.tipoImagen,
         'blnImgCuadrada': this.blnImgCuadrada,
        'blnImgRectangulo' : this.blnImgRectangulo,
        'blnImgPoster': this.blnImgPoster,
        'procesando_img': this.procesando_img
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
	const imagen = new ArchivoComunModel();
        imagen.nombre_archivo = data.nombre_archivo;
        imagen.archivo_64 = data.data;
	if(this.tipoImagen === 1) {
            this.seleccionTo.imagen = imagen;
	    this.blnImgCuadrada = false;
	}
	if(this.tipoImagen === 2) {
            this.seleccionTo.imagenBanner = imagen;
	    this.blnImgRectangulo = false;
	}
    }
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

            if (width === 1500  && height === 300) {
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
                    this.seleccionTo.imagenBanner = imagen;
                    this.procesando_img = false;
                    this.blnImgRectangulo = false;
                  }
                );
              } else {
                this._notificacionService.alerta('error de imagen');
              }
            }else{
              this.maintainAspectRatio = true;
              this.resizeToWidth = 1500;
              this.resizeToHeight = 300;
              this.tipoImagen = 2;
              this.fileChangeEvent(event);
              this.abrirModalImagen();
            }
          };
        };
      }
    }
  }

  public guardar(form: NgForm) {

    if ((this.seleccionTo.imagen === undefined || this.seleccionTo.imagen === null)
      && (this.seleccionTo.url_imagen === undefined || this.seleccionTo.url_imagen === '')) {
      this._notificacionService.error('La imagen para tarjeta de la promoción es requerida');
      this.inputTar.nativeElement.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if ((this.seleccionTo.imagenBanner === undefined || this.seleccionTo.imagenBanner === null)
      && (this.seleccionTo.url_imagen_banner === undefined || this.seleccionTo.url_imagen_banner === '')) {
      this._notificacionService.error('La imagen del banner de la promoción es requerida');
      this.inputBanner.nativeElement.focus();
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    if (form.valid) {
      this.seleccionTo.id_proveedor = this.usuario.proveedor.id_proveedor;
      this.seleccionTo.tags = this.tags;
      if(this.seleccionTo.tags.length === 0){
        this.seleccionTo.tags = [];
      }
      this._promociones_service.guardar(this.seleccionTo).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            form.resetForm();
            this._router.navigate(['/tabs/home/promociones'], { queryParams: {special: true}  });
            this._notificacionService.exito('se guardo correctamente');
          }
        },
        error => {
          this._notificacionService.error(error);
        }
      );
    }else {
      this._notificacionService.error('Es requerido que llenes todos los campos obligatorios');
    }

  }

  cancelarEdicion() {
    this._router.navigate(['/tabs/home/promociones']);
  }

}

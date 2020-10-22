import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { UtilsCls } from './../../utils/UtilsCls';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { ModalRecorteimagenPage } from '../datos-basicos/modal-recorteimagen/modal-recorteimagen.page';
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {Router} from "@angular/router";





@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;
  public loader: any;
  public minDate: any;
  public maxDate: any;
  private file_img_galeria: FileList;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  resizeToWidth: number = 0;
  resizeToHeight: number = 0;
  maintainAspectRatio: boolean = false;


  constructor(
    private servicioPersona: PersonaService,
    public loadingController: LoadingController,
    private utilsCls: UtilsCls,
    public modalController: ModalController,
    private notificaciones: ToadNotificacionService,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 0);
    this.maxDate = new Date(currentYear - 18, 0, 0);
    this.minDate = moment.parseZone(this.minDate).format("YYYY-MM-DD");
    this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");
  }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
    this.actualizarUsuario();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  private actualizarUsuario() {
    this.usuarioSistema = JSON.parse(localStorage.getItem('u_data'));
    this.usuarioSistema.fecha_nacimiento = this.usuarioSistema.fecha_nacimiento !== null ? new Date(this.usuarioSistema.fecha_nacimiento) : null;
  }
  actualizarDatos(formBasicos: NgForm) {
    this.presentLoading();
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.usuarioSistema).subscribe(
        data => {
          if (data.code === 200) {
            this.loader.dismiss();
            this.notificaciones.alerta(data.data.mensaje);
          }
          //const resultado = this.sesionUtl.actualizarSesion();
          this.router.navigate(['/tabs/ajustes']);
          this.loader.dismiss();
          this.notificaciones.exito(data.data.mensaje);
          //resolve(resultado);

        },
        error => {
          this.loader.dismiss();
          this.notificaciones.error(error);
          // this.lstPrincipal = new Array();

        });
    });
    miPrimeraPromise.then((successMessage) => {
    });
  }
  convercionFechaNac(event) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms);
    this.usuarioSistema.fecha_nacimiento = fecha;
  }

  public subir_imagen_cuadrado(event) {
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
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                  data => {
                    const archivo = new ArchivoComunModel();
                    if (file_name != null) {
                      archivo.nombre_archivo = this.utilsCls.convertir_nombre(file_name);
                      archivo.archivo_64 = data;
                    }
                    this.usuarioSistema.selfie = archivo;
                  }
                );
              } else {
                this.notificaciones.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
                // this.notificacionService.pushAlert('comun.file_sobrepeso');
              }
            } else {
              this.abrirModal(event);
            }
          };
        };
      }
    }
  }
  async abrirModal(event) {
    const modal = await this.modalController.create({
      component: ModalRecorteimagenPage,
      cssClass: 'my-custom-class',
      componentProps: {
        eventoImagen: event,
        width: 200,
        height: 200,
        IdInput: 'selfie'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.guardarImagenRecortada(data.data, data.nombre_archivo);
    }
  }
  guardarImagenRecortada(data, nombre_archivo) {
    const file_name = nombre_archivo;
    const file = data;
    const archivo = new ArchivoComunModel();
    if (file_name != null) {
      archivo.nombre_archivo = file_name,
        archivo.archivo_64 = file;
    }
    this.usuarioSistema.selfie = archivo;
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { UtilsCls } from './../../utils/UtilsCls';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Router } from "@angular/router";
import { RecorteImagenComponent } from 'src/app/components/recorte-imagen/recorte-imagen.component';
import {SessionUtil} from './../../utils/sessionUtil';




@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
  providers: [
    SessionUtil,
  ]
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;
  public loader: boolean;
  public minDate: any;
  public maxDate: any;
  private file_img_galeria: FileList;
public msj = 'Cargando';
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
    private router: Router,
    private sesionUtl: SessionUtil
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 0);
    this.maxDate = new Date(currentYear - 18, 0, 0);
    this.minDate = moment.parseZone(this.minDate).format("YYYY-MM-DD");
    this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");
    this.loader = false;
  }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
    this.actualizarUsuario();
  }

  private actualizarUsuario() {
    this.usuarioSistema = JSON.parse(localStorage.getItem('u_data'));
    this.usuarioSistema.fecha_nacimiento = this.usuarioSistema.fecha_nacimiento !== null ? new Date(this.usuarioSistema.fecha_nacimiento) : null;
  }
  actualizarDatos(formBasicos: NgForm) {
    this.loader = true;
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.usuarioSistema).subscribe(
        data => {
          if (data.code === 200) {
            const resultado = this.sesionUtl.actualizarSesion();
            this.router.navigate(['/tabs/home/perfil']);
            this.loader = false;
            this.notificaciones.exito(data.data.mensaje);
            resolve(resultado);
            setTimeout(() => {
              this.router.navigate(['/tabs/home/perfil']);
              }, 1500);
          }
        },
        error => {
          this.loader = false;
          this.notificaciones.error(error);
          // this.lstPrincipal = new Array();

        });
    });
    miPrimeraPromise.then((successMessage) => {
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/perfil']);
  }
  convercionFechaNac(event) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms);
    this.usuarioSistema.fecha_nacimiento = fecha;
  }
  public subir_imagen_cuadrado(event) {
    let nombre_archivo;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this.utilsCls.getFileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          nombre_archivo = archivo.name;
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
              this.resizeToWidth = 200;
              this.resizeToHeight = 200;
              this.abrirModal(img.src, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = nombre_archivo;
                  archivo.archivo_64 = r.data;
                  this.usuarioSistema.selfie = archivo;
                }
              }
              );
            }
          };
        };
      }
    }
  }
  async abrirModal(evento, width, heigh) {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        imageChangedEvent: evento,
        resizeToWidth: width,
        resizeToHeight: heigh,
        IdInput: 'selfie'
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss().then(r => {
      return r;
    }
    );
    return data;
  }
}

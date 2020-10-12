import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { UtilsCls } from './../../utils/UtilsCls';
import * as moment from 'moment';




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


  constructor(
    private servicioPersona: PersonaService,
    public loadingController: LoadingController,
    private utilsCls: UtilsCls
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
            //this.notificacionService.pushAlert(data.message); 
          }
          //const resultado = this.sesionUtl.actualizarSesion();
          //this.router.navigate(['/home/mi/cuenta/inicio']);
          this.loader.dismiss();
          //this.notificacionService.pushInfo(data.data.mensaje);
          // resolve(resultado);

        },
        error => {
          this.loader.dismiss();
          //  this.notificacionService.pushError(error);
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

  public subir_imagen_cuadrada(event) {
    this.file_img_galeria = event.target.files;
    const file_name = this.file_img_galeria[0].name;
    const file = this.file_img_galeria[0];
    let file_64: any;
    const utl = new UtilsCls();
    utl.getBase64(file).then(
      data => {
        file_64 = data;
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = this.utilsCls.convertir_nombre(file_name);
        archivo.archivo_64 = file_64;
        this.usuarioSistema.selfie = archivo;
      }
    );
  }
}

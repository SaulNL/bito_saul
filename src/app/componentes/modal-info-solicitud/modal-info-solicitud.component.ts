import { Component, OnInit, Input } from '@angular/core';
import { SolicitudesService } from '../../api/solicitudes.service';
import { NgForm } from '@angular/forms';
import { PostulacionModel } from '../../Modelos/PostulacionModel';
import { FormGroup } from '@angular/forms';
import { UtilsCls } from '../../utils/UtilsCls';
import { ModalController, Platform } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { Auth0Service } from '../../api/auth0.service';
import { SolicitudesModel } from '../../Modelos/SolicitudesModel';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import {FilePicker} from "@capawesome/capacitor-file-picker";


@Component({
  selector: 'app-modal-info-solicitud',
  templateUrl: './modal-info-solicitud.component.html',
  styleUrls: ['./modal-info-solicitud.component.scss'],
  providers: [
    UtilsCls,
    Auth0Service
  ]
})
export class ModalInfoSolicitudComponent implements OnInit {

  @Input() public solicitud: any;
  public numeroVistas: number;
  public static readonly PESO_MAXIMO = (1024 * 1024) * 2; //el tamaño se lee en bytes, se pide máximo 2 MB
  public static readonly EXTENSIONES_ACEPTADAS: Array<string> = ["jpg", "pdf"];
  public btnPostular: boolean = false;
  public postulacionModel = new PostulacionModel();
  public loaderPostular: boolean = false;
  public uploadedFiles: File;
  public user: any;
  public seleccionTO: SolicitudesModel;
  public nombreArchivo = '';
  public pesado: boolean = false;
  public isIos: boolean;
  public type: any;
  public data: any;
  constructor(
    public modalController: ModalController,
    private servicioSolicitudes: SolicitudesService,
    private _utils_cls: UtilsCls,
    private _auth0: Auth0Service,
    private _notificacionService: ToadNotificacionService,
    private platform: Platform
  ) {
    this.isIos = this.platform.is('ios');
  }

  ngOnInit() {
    if (this._utils_cls.existe_sesion()) {
      this.user = this._auth0.getUserData();
    }
    this.numeroVistas = 0;
    this.quienNumeroVioPublicacion(this.solicitud.id_solicitud);
    this.btnPostular = false;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  quienNumeroVioPublicacion(id_solicitud) {
    this.servicioSolicitudes.obtenerNumeroQuienVioPublicacion(id_solicitud).subscribe(
      response => {
        this.numeroVistas = response.data;
      },
      error => {
      }
    );
  }

  postularme() {
    this.btnPostular = !this.btnPostular;
    this.loaderPostular = false;
    this.postulacionModel.descripcion = '';
  }

  /*
  public guardar(form: NgForm) {
    if (form.invalid) {
      return Object.values(form.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      if (this.uploadedFiles !== undefined) {
        const fileName = this.uploadedFiles.name;
        const file = this.uploadedFiles;
        let file64: any;
        const utl = new UtilsCls();
        utl.getBase64(file).then(
            data => {
              file64 = data;
              const archivo = new ArchivoComunModel();
              archivo.nombre_archivo = this._utils_cls.convertir_nombre(fileName);
              archivo.archivo_64 = file64;
              this.postulacionModel.archivo = archivo;
              this.enviar();
            }
        );
      } else {
        this.enviar();
      }
    }
  }
   */

  public guardar(form: NgForm) {
    if (form.invalid) {
      return Object.values(form.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      if (this.uploadedFiles !== undefined) {
        const fileName = this.uploadedFiles.name;
        const archivo = new ArchivoComunModel();
        if (this.type === 'image/jpeg'){
          archivo.archivo_64 = `data:image/jpeg;base64,${this.data}`
        } else if ( this.type === 'application/pdf') {
          archivo.archivo_64 = `data:application/pdf;base64,${this.data}`
        }
        archivo.nombre_archivo = fileName;
        this.postulacionModel.archivo = archivo;
        this.enviar();
      } else {
        this.enviar();
      }
    }
  }

  public enviar() {
    this.loaderPostular = true;
    this.seleccionTO = this.solicitud;
    this.postulacionModel.idPersona = this.user.id_persona;
    this.postulacionModel.idSolicitud = this.seleccionTO.id_solicitud;
    this.servicioSolicitudes.enviarPostulacion(this.postulacionModel).subscribe(
      response => {
        this._notificacionService.exito(response.message);
        this.loaderP();
        this.dismiss();
      },
      error => {
      },
      () => {
        this.loaderPostular = false;
      }
    );
  }

  private loaderP() {
    this.loaderPostular = false;
  }
  regresarPostulacion() {
    this.btnPostular = false;
    this.loaderPostular = false;
  }
  esExtensionValida(nombreDelArchivo: string): boolean{
    const extension = nombreDelArchivo.split(".").pop();
    return ModalInfoSolicitudComponent.EXTENSIONES_ACEPTADAS.includes(extension);
  }
  esValidoElPeso(file: any): boolean{
    return file.size < ModalInfoSolicitudComponent.PESO_MAXIMO;

  }

  /*
  subir_archivo($event) {
    const file: any = $event.target.files[0];
    if (this.esValidoElPeso(file) && this.esExtensionValida(file.name)) {
      this.uploadedFiles = file;
      this.pesado = false;
      this.nombreArchivo = file.name;
    } else {
      this.uploadedFiles = undefined;
      this.nombreArchivo = '';
      this.pesado = true;
    }
  }

   */

  async subir_archivo(){
    const result = await FilePicker.pickFiles({
      multiple: false,
      readData: true
    });

    const file: any = result.files[0];
    this.type = result.files[0].mimeType;
    this.data = result.files[0].data;
    if (this.esValidoElPeso(file) && this.esExtensionValida(file.name)) {
      this.uploadedFiles = file;
      this.pesado = false;
      this.nombreArchivo = file.name;
    } else {
      this.uploadedFiles = undefined;
      this.nombreArchivo = '';
      this.pesado = true;
    }
  }

}

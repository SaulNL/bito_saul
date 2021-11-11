import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SolicitudesService } from '../../api/solicitudes.service';
import { NgForm } from '@angular/forms';
import { PostulacionModel } from '../../Modelos/PostulacionModel';
import { FormGroup } from '@angular/forms';
import { UtilsCls } from '../../utils/UtilsCls';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { Auth0Service } from '../../api/auth0.service';
import { SolicitudesModel } from '../../Modelos/SolicitudesModel';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';


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
  public btnPostular: boolean = false;
  public postulacionModel = new PostulacionModel();
  public loaderPostular: boolean = false;
  public uploadedFiles: File;
  public user: any;
  public seleccionTO: SolicitudesModel;
  public nombreArchivo = '';
  public pesado: boolean = false;

  constructor(
    public modalController: ModalController,
    private servicioSolicitudes: SolicitudesService,
    private _utils_cls: UtilsCls,
    private _auth0: Auth0Service,
    private _notificacionService: ToadNotificacionService,
  ) { }

  ngOnInit() {
    if(this._utils_cls.existe_sesion()){
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

  postularme(){
    this.btnPostular = !this.btnPostular;
    this.loaderPostular = false;
    this.postulacionModel.descripcion = '';
  }

  public guardar(form: NgForm) {
    if ( form.invalid ) {
      return Object.values( form.controls ).forEach( control => {
        if (control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }else {
      if( this.uploadedFiles !== undefined) {
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

  public enviar(){
    this.loaderPostular = true;
    this.seleccionTO = this.solicitud;
    this.postulacionModel.idPersona = this.user.id_persona;
    this.postulacionModel.idSolicitud = this.seleccionTO.id_solicitud;
    this.servicioSolicitudes.enviarPostulacion(this.postulacionModel).subscribe(
      response => {
        this._notificacionService.exito(response.message);
        this.dismiss();
        this.loaderPostular = false;
      },
      error => {
      },
      () =>{
        this.loaderPostular = false;
      }
    );
  }

  regresarPostulacion(){
    this.btnPostular = false;
    this.loaderPostular = false;
  }

  subir_archivo($event) {
    if ( $event.target.files[0].size < 100000) {
      this.uploadedFiles = $event.target.files[0];
      this.pesado = false;
      this.nombreArchivo = $event.target.files[0].name;
    } else {
      this.uploadedFiles = undefined;
      this.nombreArchivo = '';
      this.pesado = true;
    }
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SolicitudesModel } from '../../../../Modelos/SolicitudesModel';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '../../../../api/solicitudes.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
import { PublicacionesModel } from 'src/app/Modelos/PublicacionesModel';


@Component({
  selector: 'app-modal-publicar-solicitud',
  templateUrl: './modal-publicar-solicitud.page.html',
  styleUrls: ['./modal-publicar-solicitud.page.scss'],
})
export class ModalPublicarSolicitudPage implements OnInit {
  @Input() solicituPublicada: SolicitudesModel;
  public fechaini: any;
  public fechafin: any;
  public publicacionesHechas: number;
  public publicacionesPermitidas: number;
  public mensaje: any;
  public maxDate: any;
  public diasPermitidos: number;
  public blnSelectFecha: boolean;
  public mensajePublicacion = false;
  public mensajeValidacion = false;
  public loader: any;
  public publicacion: PublicacionesModel;
  constructor(
    private router: Router,
    private solicitudesService: SolicitudesService,
    private activatedRoute: ActivatedRoute,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - -30, 0, 0);
    this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");
    this.mensaje = 'Cargando';
    this.loader = false;
  }

  ngOnInit() {
    this.publicacionesHechas = 0;
    this.publicacionesPermitidas = 0;
    this.diasPermitidos = 0;
    this.blnSelectFecha = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicituPublicada = JSON.parse(params.special);
      }
    });
    this.obtenerNumeroPublicacionesSolicitud();
    this.obtenerDiasPublicacionesSolicitud();
    this.publicacion = new PublicacionesModel();
  }

  regresar() {
    this.solicituPublicada =  JSON.parse(JSON.stringify(this.solicituPublicada));
    let navigationExtras = JSON.stringify(this.solicituPublicada);
    this.router.navigate(['/tabs/home/solicitudes/card-solicitud/'], { queryParams: { special: navigationExtras } });
    this.blnSelectFecha = false;
  }
  obtenerDiasPublicacionesSolicitud() {
    this.solicitudesService.obtenerDiasPublicacionesSolicitud(this.solicituPublicada.id_persona).subscribe(
      response => {
        this.diasPermitidos = response.data.numDiasPromoPublicacion;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }

 obtenerNumeroPublicacionesSolicitud() {
   this.loader = true;
  this.solicitudesService.obtenerNumeroPublicacionesSolicitud(this.solicituPublicada.id_persona).subscribe(
    response => {
      this.publicacionesHechas = response.data.numPublicacionesSoli;
      this.publicacionesPermitidas = response.data.numPubliSoliPermitidas;
      this.loader = false;
    },
    error => {
      this.notificaciones.error(error);
      this.loader = false;
    }
  );
}
  verificacionPublicaciones() {
    if (this.publicacionesHechas >= this.publicacionesPermitidas) {
      return false;
    } else {
      return true;
    }
  }
  calcularRangoFechas() {
    let ini = moment(this.fechaini);
    let fin = moment(this.fechafin);
    let diff = fin.diff(ini, 'days');
    if (diff < this.diasPermitidos) {
      this.blnSelectFecha = false;
    } else {
      this.blnSelectFecha = true;
    }
  }

  guardarPublicacion(form: NgForm) {
    this.mensaje = 'Guardando';
    this.loader = true;
    let fechaInicio = Date.parse(this.fechaini);
    this.fechaini = new Date(fechaInicio);
    let fechaFinal = Date.parse(this.fechafin);
    this.fechafin = new Date(fechaFinal);
    if (form.valid && this.blnSelectFecha === false) {
      this.mensajeValidacion = false;
      if (this.verificacionPublicaciones()) {
        this.mensajePublicacion = false;
        //   this.loaderBtn = true;
        this.publicacion.fecha_inicio = this.fechaini;
        this.publicacion.fecha_fin = this.fechafin;
        this.publicacion.id_proveedor = this.solicituPublicada.id_proveedor;
        this.publicacion.id_persona = this.solicituPublicada.id_persona;
        this.publicacion.id_solicitud = this.solicituPublicada.id_solicitud;
        this.solicitudesService.guardarPublicacion(this.publicacion).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.loader = false;
              this.notificaciones.exito('Se público correctamente la solicitud');
              this.router.navigate(['/tabs/home/solicitudes']);
              form.resetForm();
            //  this.buscar();
            } else {
              this.loader = false;
              this.notificaciones.alerta(response.message);
            }

            // this.loaderBtn = false;
          },
          error => {
            this.loader = false;
            this.notificaciones.error(error);
          }
        );
      } else {
        this.mensajePublicacion = true;
      }
    } else {
      this.mensajeValidacion = true;
    }
  }

}

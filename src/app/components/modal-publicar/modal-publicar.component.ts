import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PublicacionesModel } from '../../Modelos/PublicacionesModel';
import { NegocioModel } from '../../Modelos/NegocioModel';
import { NegocioService } from '../../api/negocio.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { SolicitudesService } from './../../api/solicitudes.service';
import { PromocionesModel } from '../../Modelos/PromocionesModel';
import { PromocionesService } from '../../api/promociones.service';


@Component({
  selector: 'app-modal-publicar',
  templateUrl: './modal-publicar.component.html',
  styleUrls: ['./modal-publicar.component.scss'],
})
export class ModalPublicarComponent implements OnInit {

  @Input() public publicacion: PublicacionesModel;
  @Input() public mensajePublicacion: PublicacionesModel;
  @Input() public publicacionesPermitidas: number;

  public lstNegocios: Array<NegocioModel>;
  public loaderNegocios = false;
  public usuario: any;
  public blnDescripcion = false;
  public descripcionString: string;
  public minDate: any;
  public maxDate: any;
  public fechaini: any;
  public fechafin: any;
  public diasPermitidos: number;
  public blnSelectFecha = false;
  public mensajeValidacion = false;
  public mensajePublicacion2 = false;
  public modalPublicacion: boolean;
  public seleccionaSolicitud: boolean;
  public id_persona: any;
  public publicacionesHechas: number;
  public loaderBtn =  false;
  public seleccionTO: PromocionesModel;


  constructor( public modalController: ModalController,
               private _negocio_service: NegocioService,
               private _notificacionService: ToadNotificacionService,
               private solicitudesService: SolicitudesService,
               private _promociones_service: PromocionesService
              ) {
                const currentYear = new Date().getFullYear(); 
                this.minDate = new Date();
                this.maxDate = new Date(currentYear - -30, 0, 0);
                this.minDate = moment.parseZone(this.minDate).format("YYYY-MM-DD");
                this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");

              }

  ngOnInit() {
    this.lstNegocios = new Array<NegocioModel>();
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_persona = this.usuario.id_persona;
    this.diasPermitidos = 0;
    this.publicacionesHechas = 0;
    this.seleccionTO = new PromocionesModel();
    this.seleccionTO.id_proveedor =  this.usuario.proveedor.id_proveedor;
    this.obtenerDiasPublicacionesSolicitud();
    this.buscarNegocios();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      'data': this.publicacion
    });
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
          this.blnDescripcion = true;
          this.descripcionString = valor.descripcion;
        }
      });
    } else {
      this.blnDescripcion = false;
      this.descripcionString = undefined;
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

  cancelarPublicacion() {
    this.mensajeValidacion = false;
    this.mensajePublicacion2 = false;
    this.modalPublicacion = false;
    this.seleccionaSolicitud = true;
    this.dismiss();
  }

  obtenerDiasPublicacionesSolicitud() {
    this.solicitudesService.obtenerDiasPublicacionesSolicitud(this.id_persona).subscribe(
      response => {
        this.diasPermitidos = response.data.numDiasPromoPublicacion;
      },
      error => {
        // this._notificacionService.pushError(error);
      }
    );
  }


  guardarPublicacion(form: NgForm) {
    let fechaInicio = Date.parse(this.fechaini);
    this.fechaini = new Date(fechaInicio);
    let fechaFinal = Date.parse(this.fechafin);
    this.fechafin = new Date(fechaFinal);
    if(form.valid && this.blnSelectFecha === false ) {
      this.mensajeValidacion = false;
      if (this.verificacionPublicaciones()) {
        this.mensajePublicacion2 = false;
        this.loaderBtn = true;
        this.publicacion.fecha_inicio = this.fechaini;
        this.publicacion.fecha_fin = this.fechafin;
        this.publicacion.id_proveedor = this.seleccionTO.id_proveedor;
        this._promociones_service.guardarPublicacion(this.publicacion).subscribe(
          response => {
            if (response.code === 200) {
              form.resetForm();
              this.dismiss();
            } else {
              this._notificacionService.configToad(response.message, 500);
            }

            this.loaderBtn = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          error => {
            console.error(error);
            this._notificacionService.error(error);
          }
        );
      } else {
        this.mensajePublicacion2 = true;
      }
    }else{
      this.mensajeValidacion = true;
    }
  }

  verificacionPublicaciones(){
    if(this.publicacionesHechas >= this.publicacionesPermitidas){
      return false;
    }else{
      return true;
    }
  }

}
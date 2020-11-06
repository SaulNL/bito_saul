import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioSistemaModel } from 'src/app/Modelos/UsuarioSistemaModel';
import { GeneralServicesService } from '../../../../api/general-services.service';
import * as moment from 'moment';
import { UsuarioService } from '../../../../api/busqueda/login/usuario.service';
import { AppSettings } from 'src/app/AppSettings';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { LoginService } from 'src/app/api/login.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
import {Location} from "@angular/common";

import {NavController} from "@ionic/angular";
import {SideBarService} from "../../../../api/busqueda/side-bar-service";

@Component({
  selector: 'app-confirma-registro',
  templateUrl: './confirma-registro.page.html',
  styleUrls: ['./confirma-registro.page.scss'],
})
export class ConfirmaRegistroPage implements OnInit {
  public usuario_sistema: UsuarioSistemaModel;
  public numeroCelular: string;


  public tiempoTemporizador: number;
  public timer: any;
  public blnEnviarSms = false;
  public timerBtn: any;
  public blnGuardar = false;
  public nuevasFunciones: boolean;
  public loader: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _general_service: GeneralServicesService,
    private _usuario_service: UsuarioService,
    private _utils_cls: UtilsCls,
    private _sLogin: LoginService,
    private notificaciones: ToadNotificacionService,
    private loadingController: LoadingController,
    private location: Location,
    private sideBarService: SideBarService,
    private navctrl: NavController
  ) {
    this.nuevasFunciones = AppSettings.NUEVAS_FUNCIONES;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.usuario_sistema = JSON.parse(params.special);
      }
    });
    this.obtenerTiempoTemporizador();
    this.numeroCelular = this.usuario_sistema.ms_persona.telefono_celular;
    this.obtenerCodigoSMS();
  }

  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }

  /*
   * Funcion para obtener el codigo (envio sms) y obtener el el id
   * 
  */
  public obtenerCodigoSMS() {
    this.blnEnviarSms = true;
    if (this.numeroCelular.length === 10 && this.numeroCelular !== undefined) {
       this._usuario_service.obtenerCodigoSMS(this.numeroCelular).subscribe(response => {
       this.usuario_sistema.idCode = response.data;
       this.IniciaTemporizador();
       });
    } else {
      //  this._notificacionService.pushError('Número incorrecto');
    }
  }
  regresarRegistro() {
    this.detenerTemeporizador();
    this.router.navigate(['/tabs/registro-persona']);
  }

  /**
   * Funcion para obtener el tiempo de espera para envio sms
   * el tiempo en segundos
   */
  public obtenerTiempoTemporizador() {
    this._general_service.obtenerTiempoTemporizador().subscribe(
      response => {
        this.tiempoTemporizador = response.data;
      },
      error => {
      }
    );
  }
  /**
 * Funcion para inicializar el temporizador
 * @constructor
 */
  IniciaTemporizador() {
    let min;
    let sec;
    let duration = moment.duration({
      minutes: 0,
      seconds: this.tiempoTemporizador + 2

    });

    let timestamp = new Date(0, 0, 0, 2, 10, 30);
    const interval = 1;
    this.timer = setInterval(function () {
      timestamp = new Date(timestamp.getTime() + interval * 1000);

      duration = moment.duration(duration.asSeconds() - interval, 'seconds');
      min = duration.minutes();
      sec = duration.seconds();

      sec -= 1;
      if (min < 0) {
        return clearInterval(this.timer)
      }
      if (min < 10 && min.length !== 2) {
        min = '0' + min;
      }
      if (sec < 0 && min !== 0) {
        min -= 1;
        sec = 59;
      } else if (sec < 10 && sec.length !== 2) {
        sec = '0' + sec;
      }
      const parrafo = document.getElementById('temporizador');
      parrafo.innerText = min + ':' + sec;

      if (min == 0 && sec == 0) {
        clearInterval(this.timer);
        clearInterval(this.timerBtn);
        document.getElementById("temporizador").innerHTML = '';
      }
    }, 1000);
    // ActivaryDesactivarIcono
    this.blnEnviarSms = true;
    this.timerBtn = setTimeout(() => {
      this.detenerTemeporizador();
      this.blnEnviarSms = false;
    }, (this.tiempoTemporizador + 1) * 1000);
  }

  detenerTemeporizador() {
    clearInterval(this.timer);
    clearInterval(this.timerBtn);
    document.getElementById("temporizador").innerHTML = '';
    this.blnEnviarSms = false;
  }
  validarInputCodigo() {
    if (this.usuario_sistema.codigo !== null && this.usuario_sistema.codigo !== '' && this.usuario_sistema.codigo.length === 5) {
      return true;
    } else {
      return false;
    }
  }
  setBlnInput() {
    this.blnGuardar = this.validarInputCodigo();
  }
  public crear_cuenta_admin() {
    this.presentLoading();
    this._usuario_service.create_account_admin_salon(this.usuario_sistema).subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          const usuarioLogin = {
            usuario: this.usuario_sistema.ms_persona.telefono_celular,
            password: this.usuario_sistema.password
          };

          this._sLogin.validateLogin(usuarioLogin).subscribe(data => {
            this.notificaciones.alerta(data.message);
            if (data.code === 200) {
              AppSettings.setTokenUser(data);
              this.loader.dismiss();
              this.notificaciones.exito('Bienvenido a Bitoo');
              this.router.navigate(['/tabs/inicio']);
              setTimeout(() => {
                 location.reload();
               }, 1300);
            } else {
              this.loader.dismiss();
              this.notificaciones.alerta(data.message);
            }
          }, error => {
            this.loader.dismiss();
            this.notificaciones.error(error);
          });
        } else {
          this.loader.dismiss();
          this.notificaciones.alerta(response.message);
        }
        // this.procesando = false;
        // this.btnloader = false;
      },
      error => {
        this.loader.dismiss();
        this.notificaciones.error(error);
        //  this.status_save = 'error';
        //  this._notificacionService.pushError(error);
        //   this.procesando = false;
        //   this.btnloader = false;
      }
    );
  }
}

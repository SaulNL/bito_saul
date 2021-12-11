import { ConfigGlobal } from './../../config/config-global';
import { LoginService } from './../../../api/login.service';
import { UserSignInInterface } from './../../models/user-sign-in';
import { UsuarioService } from './../../../api/busqueda/login/usuario.service';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { NgForm } from '@angular/forms';
import { ShippingMethod } from './../../types/shipping-method-type';
import { ModalController } from '@ionic/angular';
import { ToSend } from './../../types/to-send-type';
import { MessageTo } from './../../types/message-to-type';
import { UserSignUpModel, UserSignUpInterface } from './../../models/user-sign-up-model';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-confirm-sign-up',
  templateUrl: './modal-confirm-sign-up.component.html',
  styleUrls: ['./modal-confirm-sign-up.component.scss']
})

export class ModalConfirmSignUpComponent implements OnInit {

  @Input() public formSignUp: UserSignUpModel;
  @Input() public messageTo: MessageTo;
  @Input() public toSend: ToSend;
  @Input() public shippingMethod: ShippingMethod;
  public retryCode: boolean;
  public successProccess: boolean;
  public timeTimer: number;
  public timer: NodeJS.Timeout;
  public disableTimer: NodeJS.Timeout;
  public loaderCreateAccount: boolean;

  constructor(
    private modalCrl: ModalController,
    private generalService: GeneralServicesService,
    private toadNotificationService: ToadNotificacionService,
    private usuarioService: UsuarioService,
    private loginService: LoginService
  ) {
    this.retryCode = false;
    this.successProccess = false;
    this.timeTimer = 0;
  }

  ngOnInit() {
    this.initSentToPhone();
  }

  public initSentToPhone() {
    if (this.isSendToMovil) {
      this.getTimeTimer();
      this.getCodeSms();
    }
  }

  public responseCloseHeader() {
    this.closeModal();
  }
  public closeModal() {
    this.deactivateTimer();
    this.modalCrl.dismiss();
  }

  get isSendToMovil() {
    return (this.shippingMethod === 1);
  }

  public getCodeSms() {
    this.retryCode = true;
    this.usuarioService.getCode(this.formSignUp.ms_persona.telefono_celular, this.formSignUp.ms_persona.correo, this.shippingMethod).subscribe(
      (response) => {
        this.formSignUp.idCode = response.data;
        this.initTimer();
      }, () => {
        this.failProcees();
      }
    );
  }
  public initTimer() {
    let min: any;
    let sec: any;
    let duration: moment.Duration = moment.duration({
      minutes: 0,
      seconds: this.timeTimer + 2
    });
    let time = new Date(0, 0, 0, 2, 10, 30);
    const intervals: number = 1;
    this.timer = setInterval(
      function () {
        time = new Date(time.getTime() + intervals * 1000);
        duration = moment.duration(duration.asSeconds() - intervals, 'seconds');
        min = duration.minutes();
        sec = duration.seconds();
        sec -= 1;
        if (min < 0) {
          return clearInterval(this.timer);
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
        let label: HTMLElement = document.getElementById('timer');

        label.innerText = min + ':' + sec;
        if (min == 0 && sec == 0) {
          clearInterval(this.timer);
          clearInterval(this.disableTimer);
          document.getElementById("timer").innerHTML = '';
        }
      }, 1000);
    this.retryCode = true;
    this.disableTimer = setTimeout(() => {
      this.deactivateTimer();
    }, (this.timeTimer + 1) * 1000);
  }

  public deactivateTimer() {
    clearInterval(this.timer);
    clearInterval(this.disableTimer);
    document.getElementById("timer").innerHTML = '';
    this.retryCode = false;
  }

  public validateCode(code: NgForm) {
    if (code.touched && code.valid && code.value.length === 5) {
      this.successProccess = true;
    }
  }

  public createAccount(form: NgForm) {
    const account: UserSignUpInterface = this.formSignUp;
    account.codigo = form.value.code;
    this.loaderCreateAccount = true;
    this.usuarioService.createAccount(account).subscribe(
      (response) => {
        if (response.code === 200) {
          const signIn: UserSignInInterface = {
            usuario: (this.shippingMethod === 1) ? this.formSignUp.ms_persona.telefono_celular : this.formSignUp.ms_persona.correo,
            password: this.formSignUp.password,
            type: ''
          };
          this.loginService.validateLogin(signIn).subscribe(
            (r) => {
              this.toadNotificationService.alerta(r.message);
              if (r.code === 200) {
                ConfigGlobal.setUser(r);
                this.toadNotificationService.exito('Bienvenido a Bitoo');
                this.modalCrl.dismiss({ 'success': true });
                this.loaderCreateAccount = false;
              }
            }, (error) => {
              this.loaderCreateAccount = false;
              this.toadNotificationService.error(error);
            }
          );
        } else {
          this.loaderCreateAccount = false;
          this.toadNotificationService.alerta(response.message);
        }
      }, (error) => {
        this.loaderCreateAccount = false;
        this.toadNotificationService.error(error);
      }
    );
  }

  public getTimeTimer() {
    this.generalService.obtenerTiempoTemporizador().subscribe(
      (response) => {
        this.timeTimer = response.data;
      }, () => {
        this.failProcees();
      }
    );
  }

  public failProcees() {
    this.toadNotificationService.error('Error en el servidor');
    this.closeModal();
  }

}

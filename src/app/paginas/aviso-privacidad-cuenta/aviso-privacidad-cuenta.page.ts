import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EliminarCuentaService } from '../../api/eliminar-cuenta.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { AppSettings } from "../../AppSettings";
import { NotificationInterface } from './../../Bitoo/models/notifications-model';
import { ValidatorData } from '../../Bitoo/helper/validations';
import { SideBarService } from '../../api/busqueda/side-bar-service';
import { NotificationWithFirebaseService } from '../../api/notification-with-firebase.service';
import { UtilsCls } from '../../utils/UtilsCls';
import { NavController } from '@ionic/angular';
import { Auth0Service } from 'src/app/api/auth0.service';
import { CreateObjects } from '../../Bitoo/helper/create-object';

@Component({
  selector: 'app-aviso-privacidad-cuenta',
  templateUrl: './aviso-privacidad-cuenta.page.html',
  styleUrls: ['./aviso-privacidad-cuenta.page.scss'],
  providers: [UtilsCls, Auth0Service, ValidatorData, CreateObjects]
})
export class AvisoPrivacidadCuentaPage implements OnInit {
  usuario: any;
  public listMotivo: any;
  public idMotivo: number;
  public termsConditions: boolean;
  public id_motivo: number;
  public idUsuario: number;
  public loader: boolean;
  public URL_FRONT = AppSettings.URL_FRONT;

  constructor(
    private router: Router,
    private eliminarCuentaService: EliminarCuentaService,
    private notificaciones: ToadNotificacionService,
    private sideBarService: SideBarService,
    private notification: NotificationWithFirebaseService,
    private util: UtilsCls,
    private navctrl: NavController,
    private auth0: Auth0Service,
    private validate: ValidatorData,
    private create: CreateObjects,

  ) {


  }

  ngOnInit() {

    this.obtenerMotivo();

    this.sideBarService.change.subscribe(() => {
      if (this.util.existSession()) {

      }
      this.usuario = this.auth0.getUserData();
    });
    if (this.usuario === null) {
      this.navctrl.navigateRoot("tabs/inicio");
    }
  }

  /**
   * regresa al perfil
   */
  regresar() {
    this.router.navigate(['/tabs/home'], {
      queryParams: {
        special: true
      }
    });
    this.init();
  }
  /**
   * Inicializa las variables por default
   */
  private init() {
    this.termsConditions = false;
    this.idMotivo = null;
  }

  /**
  * Resetea el formulario 
  */
  public backTo(event: NgForm) {
    event.reset();
  }


  /**
   *  cierra sesion y regresa a negocios
   */
  cerrarsesion() {

    this.closeNotification();
    if (AppSettings.resetToken(this.router)) {
      this.sideBarService.publishSomeData("");
      this.router.navigate(["/tabs/inicio"], {
        queryParams: { spe: true },
      });
      localStorage.clear();
      this.notification.inicialize();
    }


  }
  /**
   *  Funcion para eliminar la cuenta
   */
  eliminarCuenta(form: NgForm) {

    this.id_motivo = form.value.idMotivo;

    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    this.idUsuario = usuario_sistema.id_usuario_sistema;

    this.eliminarCuentaService.eliminarCuenta(this.idUsuario, this.id_motivo)
      .subscribe(
        response => {
          if (response.code === 200) {

            this.cerrarsesion();
            this.notificaciones.success(response.message);

          }
        },
        error => {
          this.notificaciones.error(error);

        })

  }

  /**
   * Cambia la validacion de cerrar permanentemente mi cuenta en el formulario
   */
  public aceptTermsConditions(event: boolean) {

    this.termsConditions = false;
    if (event) {
      this.termsConditions = true;
    }
  }

  /**
   * Desabilita el boton de eliminar cuenta si no estan completas las validaciones
   */
  public disableButtom(formSignUp: NgForm): boolean {
    return (
      formSignUp.invalid ||
      !this.termsConditions
    );
  }

  /**
 * Funcion para obtener el  motivo de eliminar cuenta
 */
  public obtenerMotivo() {

    this.loader = false;
    this.eliminarCuentaService.motivoEliminarCuenta().subscribe(
      response => {
        if (response.code === 200 && response.data.list_cat_motivos_eliminar_cuenta.length > 0) {
          this.listMotivo = response.data.list_cat_motivos_eliminar_cuenta;
        }
        this.loader = true;
      }, error => {
        this.notificaciones.error(error);
        this.loader = true;
      }
    );
  }


  /**
  * Valida para actualizar el token para las notificaciones en cerrar sesión
  */
  private closeNotification() {
    if (this.validate.isTokenExist()) {
      this.updateNotification();
    } else {
      this.notification.inicialize();
      this.updateNotification();
    }
  }

  /**
  *Actualiza el token para las notificaciones al cerrar sesión
  */
  private updateNotification() {
    const content: NotificationInterface = this.create.createNotificationFirebaseWithNotUser();
    this.notification.updateUserWithNotification(content);
  }

  public politicas(){
    window.open(
        this.URL_FRONT + "politica/privacidad",
        "_blank"
    );
  }

}

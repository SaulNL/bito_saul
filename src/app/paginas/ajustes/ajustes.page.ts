import { CreateObjects } from './../../Bitoo/helper/create-object';
import { NotificationInterface } from './../../Bitoo/models/notifications-model';
import { ValidatorData } from './../../Bitoo/helper/validations';
import { NotificationWithFirebaseService } from './../../api/notification-with-firebase.service';
import { PermisoModel } from 'src/app/Modelos/PermisoModel';
import { ValidarPermisoService } from '../../api/validar-permiso.service';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilsCls } from "../../utils/UtilsCls";
import { AppSettings } from "../../AppSettings";
import { ActionSheetController, MenuController, NavController, Platform } from "@ionic/angular";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "src/app/api/auth0.service";
import { PedidosService } from "../../api/pedidos.service";
import { PersonaService } from '../../api/persona.service';

@Component({
  selector: "app-ajustes",
  templateUrl: "./ajustes.page.html",
  styleUrls: ["./ajustes.page.scss"],
  providers: [UtilsCls, Auth0Service, ValidatorData, CreateObjects]
})
export class AjustesPage implements OnInit {
  usuario: any;
  url_user: string;
  logon: any;
  misNegocios: boolean;
  misAPromociones: boolean;
  solicitudes: boolean;
  misVentas: boolean;
  misCompras: boolean;
  generarSolicitud: boolean;
  estadisticas: boolean;
  numNotifiSinLeer: number;
  totalNoVistos: number;
  subscribe;
  siNoVistos: boolean;
  versionActualSistema: number;
  releaseDate: string;
  interval: any;
  constructor(
    private util: UtilsCls,
    public actionSheetController: ActionSheetController,
    private sideBarService: SideBarService,
    private _router: Router,
    private navctrl: NavController,
    private active: ActivatedRoute,
    private auth0: Auth0Service,
    private validarPermisos: ValidarPermisoService,
    private pedidos: PedidosService,
    private platform: Platform,
    private personaService: PersonaService,
    private notification: NotificationWithFirebaseService,
    private validate: ValidatorData,
    private create: CreateObjects,
    private menuCtrl: MenuController
  ) {
    this.siNoVistos = false;
    this.totalNoVistos = 0;
    this.numNotifiSinLeer = 0;
    if (this.util.existSession()) {
      this.usuario = this.auth0.getUserData();
      this.setNewDataBasicUser(this.usuario.id_persona);
      this.validar(JSON.parse(String(localStorage.getItem('u_permisos'))));
    }
    this.versionActualSistema = (this.platform.is('android')) ? AppSettings.VERSION_ANDROID : AppSettings.VERSION_IOS;
    this.releaseDate = AppSettings.RELEASE_DATE;
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
        if (localStorage.getItem("isRedirected") === "false") {
          localStorage.setItem("isRedirected", "true");
        }
      }
    });

    this.subscribe = this.platform.backButton.subscribe(() => {
      this.subscribe.unsubscribe();
      this.notificacionesVentas();
    });

    this.active.queryParams.subscribe((params) => {

      this.interval = setInterval(() => {
        this.numNotifiSinLeer = Number(localStorage.getItem('notifSinLeer'));
      },1000)

      if (params && params.ventas) {
        this.notificacionesVentas();
      }
    });

    this.notificacionesVentas();
    //  this.usuario = this.util.getData();
    this.sideBarService.change.subscribe(() => {
      if (this.util.existSession()) {
        this.validar(JSON.parse(String(localStorage.getItem('u_permisos'))));
      }
      this.usuario = this.auth0.getUserData();
    });
    if (this.usuario === null) {
      this.navctrl.navigateRoot("tabs/inicio");
    }
    this.url_user = AppSettings.API_ENDPOINT + "img/user.png";
  }

  ionViewWillLeave(){
    clearInterval(this.interval);
  }

  private validar(permisos: Array<PermisoModel>) {
    this.misNegocios = this.validarPermisos.isChecked(permisos, 'mis_negocios');
    this.misAPromociones = this.validarPermisos.isChecked(permisos, 'anuncios_promociones');
    this.solicitudes = this.validarPermisos.isChecked(permisos, 'ver_solicitudes');
    this.misVentas = this.validarPermisos.isChecked(permisos, 'ventas');
    this.misCompras = this.validarPermisos.isChecked(permisos, 'compras');
    this.generarSolicitud = this.validarPermisos.isChecked(permisos, 'mis_solicitudes');
    this.estadisticas = this.validarPermisos.isChecked(permisos, 'estadisticas');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Perfil",
      buttons: [
        {
          text: "Mi Cuenta",
          icon: "person-outline",
          handler: () => {
            this._router.navigate(["/tabs/home/datos-basicos"]);
          },
        },
        {
          text: "Cambiar Contraseña",
          icon: "key-outline",
          handler: () => {
            this._router.navigate(["/tabs/home/cambio-contrasenia"]);
          },
        },
        {
          text: "Datos Complementarios",
          icon: "create-outline",
          handler: () => {
            this._router.navigate(["/tabs/home/datos-complementarios"]);
          },
        },
        {
          text: "Cerrar sesión",
          icon: "log-out-outline",
          handler: () => {
            this.closeNotification();
            if (AppSettings.resetToken(this._router)) {
              this.sideBarService.publishSomeData("");
              this._router.navigate(["/tabs/inicio"], {
                queryParams: { spe: true },
              });
              location.reload();
              localStorage.clear();
              localStorage.setItem('modalShown', 'false');
              this.notification.inicialize();
            }
          },
        },
        {
          text: "Cancelar",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }

  misPromociones() {
    this._router.navigateByUrl("tabs/home/promociones");
  }

  misSolicitudes() {
    this._router.navigateByUrl("tabs/home/solicitudes");
  }

  public notificacionesVentas() {
    const id = this.auth0.getIdProveedor();
    this.pedidos.noVistos(id).subscribe(
      res => {
        this.totalNoVistos = res.data;
        this.siNoVistos = (res.data > 0);
      },
      () => {
      });
  }

  private setNewDataBasicUser(idPersona: number) {
    this.personaService.datosBasicos(idPersona).subscribe(
      response => {
        if (response.code === 200) {
          this.usuario.nombre = response.data.nombre;
          this.usuario.paterno = response.data.paterno;
          this.usuario.materno = response.data.materno;
          this.usuario.telefono = response.data.telefono;
          this.usuario.imagen = response.data.imagen;
          this.usuario.correo = response.data.correo;
          localStorage.setItem('u_data', JSON.stringify(this.usuario));
        }
      }
    );
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida para actualizar el token para las notificaciones en cerrar sesión
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
   * @author Juan Antonio Guevara Flores
   * @description Actualiza el token para las notificaciones al cerrar sesión
   */
  private updateNotification() {
    const content: NotificationInterface = this.create.createNotificationFirebaseWithNotUser();
    this.notification.updateUserWithNotification(content);
  }

  abrirPaginaNotificaciones() {
    this._router.navigate(["/tabs/notificaciones"]);
  }
  openMenu() {
    this.menuCtrl.open('menuUsuario')
  }

  abrirCarrito(){
    this._router.navigate(['/tabs/carrito-compra']);
  }

}

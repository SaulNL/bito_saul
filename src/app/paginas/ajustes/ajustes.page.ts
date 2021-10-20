import { PermisoModel } from 'src/app/Modelos/PermisoModel';
import { ValidarPermisoService } from './../../api/validar-permiso.service';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilsCls } from "../../utils/UtilsCls";
import { AppSettings } from "../../AppSettings";
import {ActionSheetController, NavController, Platform} from "@ionic/angular";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Location } from "@angular/common";
import { Auth0Service } from "src/app/api/auth0.service";
import { PersonaService } from '../../api/persona.service';
import {PedidosService} from "../../api/pedidos.service";

@Component({
  selector: "app-ajustes",
  templateUrl: "./ajustes.page.html",
  styleUrls: ["./ajustes.page.scss"],
  providers: [UtilsCls, Auth0Service],
})
export class AjustesPage implements OnInit {
  usuario: any;
  public url_user: string;
  public logon: any;
  public misNegocios: boolean;
  public misAPromociones: boolean;
  public solicitudes: boolean;
  public misVentas: boolean;
  public misCompras: boolean;
  public generarSolicitud: boolean;
  public estadisticas: boolean;
  public totalNoVistos: number;
  public subscribe;

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
    private platform: Platform
  ) {
    this.totalNoVistos = 0;
    this.usuario = this.auth0.getUserData();
    if (this.util.existSession()) {
      this.validar(JSON.parse(String(localStorage.getItem('u_permisos'))));
    }
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
        if (localStorage.getItem("isRedirected") === "false") {
          console.log("reload app");
          localStorage.setItem("isRedirected", "true");
          location.reload();
        }
      }
    });

    this.subscribe = this.platform.backButton.subscribe(() => {
      this.subscribe.unsubscribe();
      console.log("Suscripción activada");
      this.notificacionesVentas();
    });

    this.active.queryParams.subscribe((params) => {
      if (params && params.ventas) {
        console.log("active compra");

      }
    });

    this.notificacionesVentas();
    //  this.usuario = this.util.getData();
    this.sideBarService.change.subscribe(isOpen => {
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
            this._router.navigate(["/tabs/datos-basicos"]);
          },
        },
        {
          text: "Cambiar Contraseña",
          icon: "key-outline",
          handler: () => {
            this._router.navigate(["/tabs/cambio-contrasenia"]);
          },
        },
        {
          text: "Datos Complementarios",
          icon: "create-outline",
          handler: () => {
            this._router.navigate(["/tabs/datos-complementarios"]);
          },
        },
        {
          text: "Cerrar sesión",
          icon: "log-out-outline",
          handler: () => {
            if (AppSettings.resetToken(this._router)) {
              this.sideBarService.publishSomeData("");
              this._router.navigate(["/tabs/inicio"], {
                queryParams: { spe: true },
              });
              location.reload();
              localStorage.clear();

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
        },
        error => {
        });
  }
}

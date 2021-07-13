import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilsCls } from "../../utils/UtilsCls";
import { AppSettings } from "../../AppSettings";
import { ActionSheetController, NavController } from "@ionic/angular";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Location } from "@angular/common";
import { Auth0Service } from "src/app/api/auth0.service";
import { PersonaService } from '../../api/persona.service';

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

  constructor(
    private util: UtilsCls,
    public actionSheetController: ActionSheetController,
    private sideBarService: SideBarService,
    private _router: Router,
    private navctrl: NavController,
    private active: ActivatedRoute,
    private auth0: Auth0Service
  ) {
    this.usuario = this.auth0.getUserData();
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.usuario = JSON.parse(localStorage.getItem('u_data'));
        if (params.special) {
          if (localStorage.getItem("isRedirected") === "false") {
            localStorage.setItem("isRedirected", "true");
            location.reload();
          }
        }
      }
    });
  //  this.usuario = this.util.getData();
  this.sideBarService.change.subscribe(isOpen => {
    this.usuario = this.auth0.getUserData();
  });
    if (this.usuario === null) {
      this.navctrl.navigateRoot("tabs/inicio");
    }
    this.url_user = AppSettings.API_ENDPOINT + "img/user.png";
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
          handler: () => {},
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
}

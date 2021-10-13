import { ValidarPermisoService } from './../../../api/validar-permiso.service';
import { PermisoModel } from 'src/app/Modelos/PermisoModel';
import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { UtilsCls } from "../../../utils/UtilsCls";
import { AppSettings } from "../../../AppSettings";
import { SideBarService } from "./../../../api/busqueda/side-bar-service";
import { Auth0Service } from "./../../../api/busqueda/auth0.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
  providers: [UtilsCls],
})
export class DashboardPage implements OnInit {
  usuario: any;
  public url_user: string;
  correnume: any;
  public isRemainder: boolean;
  public user: any;
  // public permisos: any;
  public misPromociones: boolean;
  public estadisticas: boolean;
  public quieroVender: boolean;
  public misNegocios: boolean;
  public misSolicitudes: boolean;
  public favoritos: boolean;
  public navBln: boolean;
  // public ruta: any;
  // public admin: boolean;

  constructor(
    private util: UtilsCls,
    private menuController: MenuController,
    private auth0: Auth0Service,
    private sideBarService: SideBarService,
    private validarPermiso: ValidarPermisoService) {
    this.user = this.util.getUserData();
    this.permitirPermiso(JSON.parse(String(localStorage.getItem('u_permisos'))));
    const ls = localStorage.getItem("nav");
    this.navBln = ls === "true";
  }
  // private validarPermiso(permisos) {
  //   for (const pe of permisos) {
  //     const permiso = pe.nombre;
  //     switch (permiso) {
  //       case "ver_promociones":
  //         this.ver_promociones = this.tienePermiso(permiso);
  //         break;
  //       case "validar_proveedor":
  //         this.validar_proveedor = this.tienePermiso(permiso);
  //         break;
  //       case "crear_proveedor":
  //         this.crear_proveedor = this.tienePermiso(permiso);
  //         break;
  //       case "ver_negocio":
  //         this.ver_negocio = this.tienePermiso(permiso);
  //         break;
  //       case "administrar_usuarios":
  //         this.admin = this.tienePermiso(permiso);
  //         break;
  //     }
  //   }
  // }

  // public obtenerPermisos() {
  //   let permisos = this.util.getUserPermisos();
  //   let permisoArr = [];
  //   if (permisos != null) {
  //     permisos.forEach(function (value) {
  //       permisoArr.push(value);
  //     });
  //     this.permisos = permisoArr;
  //     this.validarPermiso(this.permisos);
  //   }
  // }

  // isProveedor(permiso: string): boolean {
  //   if (this.tienePermiso(permiso)) {
  //     if (this.user.proveedor != null) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  // tienePermiso(key: string): boolean {
  //   if (this.permisos.length === 0) {
  //     return false;
  //   }
  //   return this.permisos.filter((p) => p.nombre === key).length > 0;
  // }
  ngOnInit() {

    this.usuario = this.util.getData();
    this.url_user = AppSettings.API_ENDPOINT + "img/user.png";
    if (this.usuario !== null) {
      if (typeof this.usuario.correo === "undefined") {
        this.correnume = this.usuario.telefono;
      } else {
        this.correnume = this.usuario.correo;
      }
    }
    this.sideBarService.change.subscribe(isOpen => {
      this.usuario = this.auth0.getUserData();
      if (this.util.existSession()) {
        this.permitirPermiso(JSON.parse(String(localStorage.getItem('u_permisos'))));
      }
    })
  }
  private permitirPermiso(permisos: Array<PermisoModel>) {
    this.misPromociones = this.validarPermiso.isChecked(permisos, 'anuncios_promociones');
    this.estadisticas = this.validarPermiso.isChecked(permisos, 'estadisticas');
    this.quieroVender = this.validarPermiso.isChecked(permisos, 'quiero_vender');
    this.misNegocios = this.validarPermiso.isChecked(permisos, 'mis_negocios');
    this.misSolicitudes = this.validarPermiso.isChecked(permisos, 'mis_solicitudes');
    this.favoritos = this.validarPermiso.isChecked(permisos, 'mis_favoritos');
  }
  openFirst() {
    this.menuController.enable(true, "first");
    this.menuController.open("first");
  }
}

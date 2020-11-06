import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { UtilsCls } from "../../../utils/UtilsCls";
import { AppSettings } from "../../../AppSettings";

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
  public permisos: any;
  public ver_promociones: boolean;
  public validar_proveedor: boolean;
  public crear_proveedor: boolean;
  public ver_negocio: boolean;
  public navBln: boolean;
  public ruta: any;
  public admin: boolean;

  constructor(private util: UtilsCls, private menuController: MenuController) {
    this.user = this.util.getUserData();
    this.obtenerPermisos();
    const ls = localStorage.getItem("nav");
    this.navBln = ls === "true";
  }
  private validarPermiso(permisos) {
    for (const pe of permisos) {
      const permiso = pe.nombre;
      switch (permiso) {
        case "ver_promociones":
          this.ver_promociones = this.tienePermiso(permiso);
          break;
        case "validar_proveedor":
          this.validar_proveedor = this.tienePermiso(permiso);
          break;
        case "crear_proveedor":
          this.crear_proveedor = this.tienePermiso(permiso);
          break;
        case "ver_negocio":
          this.ver_negocio = this.tienePermiso(permiso);
          break;
        case "administrar_usuarios":
          this.admin = this.tienePermiso(permiso);
          break;
      }
    }
  }

  public obtenerPermisos() {
    let permisos = this.util.getUserPermisos();
    let permisoArr = [];
    if (permisos != null) {
      permisos.forEach(function (value) {
        permisoArr.push(value);
      });
      this.permisos = permisoArr;
      this.validarPermiso(this.permisos);
    }
  }

  isProveedor(permiso: string): boolean {
    if (this.tienePermiso(permiso)) {
      if (this.user.proveedor != null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  tienePermiso(key: string): boolean {
    if (this.permisos.length === 0) {
      return false;
    }
    return this.permisos.filter((p) => p.nombre === key).length > 0;
  }
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
  }

  openFirst() {
    this.menuController.enable(true, "first");
    this.menuController.open("first");
  }
}

import { ValidarPermisoService } from '../../api/validar-permiso.service';
import { PermisoModel } from 'src/app/Modelos/PermisoModel';
import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { UtilsCls } from "../../utils/UtilsCls";
import { AppSettings } from "../../AppSettings";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.scss'],
})
export class MenuUsuarioComponent implements OnInit {
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
    private validarPermiso: ValidarPermisoService,
    private router: Router,
  ) {
    this.user = this.util.getUserData();
    this.permitirPermiso(JSON.parse(String(localStorage.getItem('u_permisos'))));
    const ls = localStorage.getItem("nav");
    this.navBln = ls === "true";
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

  openCat() {
    localStorage.removeItem('byCategorias');
    localStorage.setItem('isRedirected', 'false');
    this.router.navigate(['/tabs/categorias']);
  }
  openSug() {
    this.router.navigate(['/tabs/mis-sugerencias']);
  }

}

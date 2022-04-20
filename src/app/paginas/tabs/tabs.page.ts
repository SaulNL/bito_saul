import { Component, OnInit } from "@angular/core";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  providers: [UtilsCls, SideBarService, Auth0Service],
})
export class TabsPage implements OnInit {
  existeSesion: boolean;
  usuario: any;
  activedPage: string;

  constructor(
    private util: UtilsCls,
    private sideBarService: SideBarService,
    private router: Router,
    private auth0: Auth0Service
  ) {
    this.existeSesion = util.existe_sesion();
    this.activedPage = "";
  }

  ngOnInit(): void {
    this.sideBarService.getObservable().subscribe((data) => {
      this.usuario = this.util.getData();
    });
    this.sideBarService.change.subscribe((isOpen) => {
      this.usuario = this.auth0.getUserData();
    });
    this.usuario = this.util.getData();

    this.activedPage = localStorage.getItem("activedPage");

    /* localStorage.removeItem('activedPage') */
  }

  inicio() {
    localStorage.removeItem("activedPage");
    // localStorage.setItem('isRedirected', 'false');
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/inicio"], {
      queryParams: { buscarNegocios: "buscar" },
    });
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "inicio");
    this.activedPage = localStorage.getItem("activedPage");
  }

  promociones() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/promociones"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "promociones");
    this.activedPage = localStorage.getItem("activedPage");
  }
  solicitudes() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/mis-favoritos"]);
    localStorage.setItem("activedPage", "favoritos");
    this.activedPage = localStorage.getItem("activedPage");
    // this.router.navigate(['/tabs/home/solicitud']);
  }

  productos() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/productos"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "productos");
    this.activedPage = localStorage.getItem("activedPage");
  }

  requerimientos() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/home/solicitud"]);
    localStorage.setItem("activedPage", "requerimientos");
    this.activedPage = localStorage.getItem("activedPage");
  }

  perfil() {
    localStorage.removeItem("activedPage");
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    localStorage.setItem("resetFiltro", "0");
    this.router.navigate(["/tabs/home/perfil"], {
      queryParams: { special: true },
    });
  }
  login() {
    localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/login"]);
    localStorage.setItem("activedPage", "perfil");
    this.activedPage = localStorage.getItem("activedPage");
  }
}

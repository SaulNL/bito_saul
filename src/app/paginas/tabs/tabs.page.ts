import { Component, OnInit } from "@angular/core";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Router } from "@angular/router";
import { Platform, AlertController } from '@ionic/angular';
import {AfiliacionPlazaModel} from "../../Modelos/AfiliacionPlazaModel";

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
  public isIos: boolean;
  private plazaAfiliacion: AfiliacionPlazaModel | null;

  constructor(
      private util: UtilsCls,
      private sideBarService: SideBarService,
      private router: Router,
      private auth0: Auth0Service,
      private platform: Platform,
      public alertController: AlertController
  ) {
    this.existeSesion = util.existe_sesion();
    this.activedPage = "";
    this.isIos = this.platform.is('ios');
  }

  ngOnInit(): void {
    this.sideBarService.getObservable().subscribe((data) => {
      this.usuario = this.util.getData();
    });
    this.sideBarService.change.subscribe((isOpen) => {
      this.usuario = this.auth0.getUserData();
    });
    this.usuario = this.util.getData();
    const pagina = localStorage.getItem('activedPage');

    if (pagina === null && this.isIos){
      this.activedPage = 'inicio';
    }

    if(pagina==='promociones'){
      this.activedPage = localStorage.getItem("activedPage");
    }
    if(pagina==='productos'){
      this.activedPage = localStorage.getItem("activedPage");
      this.mostrarLoguearse();
    }
    if(pagina==='perfil'){
      this.activedPage = localStorage.getItem("activedPage");
    }
    localStorage.removeItem('activedPage');
    this.plazaAfiliacion = JSON.parse(localStorage.getItem("org"));
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
    this.mostrarLoguearse();
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

  public mostrarLoguearse(){
    if (this.existeSesion) {
    }else{
      if(this.plazaAfiliacion != null){

      }else{
        setTimeout(() =>{
          this. mensajeRegistro();
        },3800);
      }
    }
}

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bitoo!',
      message: "¿Ya tienes una cuenta?",
        buttons: [
            {
                text: "Iniciar sesión",
                cssClass: 'text-grey',
                handler: () => {
                  this.router.navigate(['/tabs/login']);
                }
            },
            {
                text: "Registrate",
                cssClass: 'text-rosa',
                handler: () => {
                    this.router.navigate(["/tabs/login/sign-up"]);
                },
            },
        ],
    });
    await alert.present();
  }

}

import { Component, OnInit } from "@angular/core";
import { UtilsCls } from "../../utils/UtilsCls";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Router } from "@angular/router";
import {Platform, AlertController, ModalController} from '@ionic/angular';
import { AfiliacionPlazaModel } from "../../Modelos/AfiliacionPlazaModel";
import { NotificacionesService } from "src/app/api/usuario/notificaciones.service";
import moment from "moment";
import { AdministracionService } from "src/app/api/administracion-service.service";
import { FiltroCatVariableModel } from './../../Modelos/catalogos/FiltroCatVariableModel';
import {ModalInicioComponent} from '../../componentes/modal-inicio/modal-inicio.component';

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
  public isAndroid: boolean;
  private plazaAfiliacion: AfiliacionPlazaModel | null;
  public misNotificaciones: any;
  public notifSinLeer: number;
  public id_proveedor: any;
  showPopUp: boolean = false;
  showPopUpGracias: boolean = false;
  popUpTitle: string;
  popUpDescrip: string;
  infoPersona: any;
  misEncuestas: any = [];
  hayEncuesta: boolean = false
  contesto: boolean = false;
  filtroVariable: FiltroCatVariableModel = new FiltroCatVariableModel
  mensajeRespondio: string;
  idProveedor: number;
  idPersona: number;

  constructor(
    private util: UtilsCls,
    private sideBarService: SideBarService,
    private router: Router,
    private auth0: Auth0Service,
    private platform: Platform,
    public alertController: AlertController,
    private notificacionesServide: NotificacionesService,
    private AdministracionService: AdministracionService,
    private modalController: ModalController,
  ) {
    this.existeSesion = util.existe_sesion();
    this.activedPage = "";
    this.isIos = this.platform.is('ios');
    this.isAndroid = (this.platform.is('android'));

    setTimeout( () => {
      this.initializeModal();
    }, 2000);

  }

  ngOnInit(): void {
    this.plazaAfiliacion = JSON.parse(localStorage.getItem("org"));
    this.sideBarService.getObservable().subscribe((data) => {
      this.usuario = this.util.getData();
    });
    this.sideBarService.change.subscribe((isOpen) => {
      this.usuario = this.auth0.getUserData();
    });
    this.usuario = this.util.getData();
    const pagina = localStorage.getItem('activedPage');
    const prod = localStorage.getItem('productos');
    const neg = localStorage.getItem('negocios');

    if (this.usuario !== null) this.obtenerNotificaciones();

    this.actualizarEncuestas();

    // se agregaron estas lineas para mandar simpre al inicio cada cierran y abren la app

    // localStorage.removeItem("activedPage");
    if(!localStorage.getItem("activedPage")){
      localStorage.setItem("activedPage", "inicio");
    }
    this.activedPage = localStorage.getItem("activedPage");

    /* Se comentaron estas lineas de codigo para que siempre mande al inicio cuando cierran y abren la app

    if (neg === 'active' && this.isIos) {
      this.activedPage = 'inicio';
    }
    if (prod === 'active' && this.router.navigate(['/tabs/productos'], {
      queryParams: {
        special: true
      }
    }) && this.isIos) {
      this.activedPage = 'productos';

    }

    if (pagina === 'promociones') {
      this.activedPage = localStorage.getItem("activedPage");
    }

    if (pagina === 'productos') {
      this.activedPage = localStorage.getItem("activedPage");
      this.mostrarLoguearse();
    }

    if (pagina === 'perfil' && this.isAndroid) {
      this.activedPage = localStorage.getItem("activedPage");
    }

    localStorage.removeItem('activedPage');
    localStorage.removeItem('productos'); */
  }

  inicio() {
    localStorage.removeItem("productos");
    localStorage.removeItem("activedPage");
    localStorage.setItem('isRedirected', 'false');
    // localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/inicio"], {
      queryParams: { buscarNegocios: "buscar" },
    });
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "inicio");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.setItem('negocios', ('active'));
    localStorage.removeItem("activarTodos")
    if (localStorage.getItem("idGiro") === null) {
      if (!localStorage.getItem('FiltroAct')) {
        localStorage.removeItem("todo");
      }
    }
  }

  async initializeModal() {
    console.log('ruta', this.router.url);
    if ( this.router.url == '/tabs/inicio'){
      const modal = await this.modalController.create({
        component: ModalInicioComponent,
      });
      await modal.present();
    }
  }


  promociones() {
    localStorage.removeItem("activedPage");
    // localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/promociones"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "promociones");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }
  solicitudes() {
    localStorage.removeItem("activedPage");
    // localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/mis-favoritos"]);
    localStorage.setItem("activedPage", "favoritos");
    this.activedPage = localStorage.getItem("activedPage");
    // this.router.navigate(['/tabs/home/solicitud']);
    localStorage.removeItem("productos");
  }

  productos() {
    localStorage.removeItem("activedPage");
    // localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/productos"]);
    localStorage.setItem("resetFiltro", "0");
    localStorage.setItem("activedPage", "productos");
    this.activedPage = localStorage.getItem("activedPage");
    this.mostrarLoguearse();
    localStorage.removeItem("productos");
  }

  requerimientos() {
    localStorage.removeItem("activedPage");
    // localStorage.removeItem("byCategorias");
    this.router.navigate(["/tabs/home/solicitud"]);
    localStorage.setItem("activedPage", "requerimientos");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }

  perfil() {
    localStorage.removeItem("activedPage");
    // localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    localStorage.setItem("resetFiltro", "0");
    this.router.navigate(["/tabs/home"], {
      queryParams: { special: true },
    });
    localStorage.setItem("activedPage", "perfil2");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
    localStorage.removeItem("negocios");
    // localStorage.removeItem("todo");
  }
  login() {
    // localStorage.removeItem("byCategorias");
    localStorage.setItem("isRedirected", "false");
    this.router.navigate(["/tabs/login"]);
    localStorage.setItem("activedPage", "perfil");
    this.activedPage = localStorage.getItem("activedPage");
    localStorage.removeItem("productos");
  }

  public mostrarLoguearse() {
    if (this.existeSesion) {
    } else {
      if (this.plazaAfiliacion != null) {

      } else {
        setTimeout(() => {
          this.mensajeRegistro();
        }, 3800);
      }
    }
  }

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bituyú!',
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

  obtenerNotificaciones() {
    this.idProveedor = null;
    this.idPersona = null;

    if (this.usuario.proveedor) {
      this.idProveedor = this.usuario.proveedor.id_proveedor;
      this.idPersona = this.usuario.proveedor.id_persona;
    } else {
      this.idPersona = this.usuario.id_persona;
    }

    setInterval(() => {
      this.servicioNotificaciones();
    }, 5000);

  }

  servicioNotificaciones() {
    this.notificacionesServide.obtenerNotificaciones(this.idProveedor, this.idPersona).subscribe(
      response => {
        if (response.code === 200) {
          this.misNotificaciones = response.data;

          localStorage.setItem('notificaciones', JSON.stringify(this.misNotificaciones));

          this.notificacionesSinAbrir();
        }
      },
      error => {
      }
    );
  }

  notificacionesSinAbrir() {
    const sumaNoleidos = this.misNotificaciones.map(item => item.no_leidos).reduce((prev, curr) => prev + curr, 0);

    localStorage.setItem('notifSinLeer', sumaNoleidos);

    this.notifSinLeer = Number(localStorage.getItem('notifSinLeer'));
  }

  async actualizarEncuestas() {
    this.filtroVariable.variable = 'intervaloTiempoPreguntaRapida';

    await this.AdministracionService.obtenerVariable(this.filtroVariable).subscribe(response => {
      let valor;
      if (response.data === undefined || response.data.length === 0) {
        valor = null;
      } else {
        valor = response.data[0];
        localStorage.setItem('valorMostrarEncuesta', JSON.stringify(valor.valor));
        let valorMostrarEncuesta = Number(localStorage.getItem('valorMostrarEncuesta')) * 60;
        if (valorMostrarEncuesta === 0) {
          valorMostrarEncuesta = 60;
        }
        setInterval(() => {
          this.obtenerEncuestas();
        }, valorMostrarEncuesta * 1000);
      }
    });
  }
  obtenerEncuestas() {
    this.contesto = false;
    this.showPopUpGracias = false
    let infoPersona = JSON.parse(localStorage.getItem('u_sistema'))
    if (infoPersona != null && infoPersona != "") {
      this.notificacionesServide.obtenerEncuestas(infoPersona.id_persona).subscribe(
        response => {
          if (response.code === 200) {
            if (response.data.length > 0) {
              this.misEncuestas = response.data[0];
              if (this.misEncuestas.hasOwnProperty("id_pregunta_rapida") && this.misEncuestas != undefined) {
                this.hayEncuesta = true;

                this.showPopUp = true;
                setTimeout(() => {
                  this.closePopUp()
                }, (this.misEncuestas.duracion_pantalla * 1000));

              } else {
                this.hayEncuesta = false;
              }
            }
          } else {

          }
        },
        error => {
          console.log("error:" + error.message)
        }
      );
    } else {
    }
  }

  async enviarRespuesta(id_pregunta_rapida: number, id_opcion_pregunta_rapida: number) {
    this.closePopUp()
    let infoPersona = JSON.parse(localStorage.getItem('u_sistema'))
    let fecha_respuestas = moment().format('YYYY/MM/DD');
    await this.notificacionesServide.guardarRespuestaEncuesta(id_pregunta_rapida, infoPersona.id_persona, id_opcion_pregunta_rapida, fecha_respuestas).subscribe(
      response => {
        if (response.code === 200) {
          this.mensajeRespondio = this.misEncuestas.mensaje;
          this.contesto = true;
          this.showPopUpGracias = true;
          setTimeout(() => {
            this.closePopUpGracias()
          }, 5000);

        } else {
        }
      },
      error => {
      }
    );
  }
  closePopUp() {
    this.showPopUp = false;
  }

  closePopUpGracias() {
    this.showPopUpGracias = false;
  }

  tabActual(){

  }
}

import { PlazasAfiliacionesComponent } from "../../componentes/plazas-afiliaciones/plazas-afiliaciones.component";
import { AfiliacionPlazaModel } from "../../Modelos/AfiliacionPlazaModel";
import { Auth0Service } from "../../api/busqueda/auth0.service";
import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import {
  IonContent,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { BusquedaService } from "../../api/busqueda.service";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { FiltrosBusquedaComponent } from "../../componentes/filtros-busqueda/filtros-busqueda.component";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { ActivatedRoute } from "@angular/router";
import { MapaNegociosComponent } from "../../componentes/mapa-negocios/mapa-negocios.component";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { Router } from "@angular/router";
import { ProveedorServicioService } from "../../api/busqueda/proveedores/proveedor-servicio.service";
import { UtilsCls } from "../../utils/UtilsCls";
import { PermisoModel } from "src/app/Modelos/PermisoModel";
import { ValidarPermisoService } from "../../api/validar-permiso.service";
import { ICategoriaNegocio } from "src/app/interfaces/ICategoriaNegocio";
import { Observable, throwError } from "rxjs";
import { runInThisContext } from "vm";
import { LocalStorageUtil } from "../../utils/localStorageUtil";
import { LOCAL_STORAGE_KEY } from "src/app/utils/localStorageKey";

@Component({
  selector: "app-tab3",
  templateUrl: "inicio.page.html",
  styleUrls: ["inicio.page.scss"],
  providers: [SideBarService],
})
export class InicioPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public static readonly MENSAJE_CUANDO_CARGA = "Cargar más";
  public static readonly PAGINAS_POR_CONSULTA = 20;
  public lengthLista: number;
  public cordenada: number;
  public Filtros: FiltrosModel;
  public listaCategorias: Array<ICategoriaNegocio>;
  private modal: any;
  public selectionAP: boolean;
  public anyFiltros: FiltrosModel;
  strBuscar: any;
  private seleccionado: any;
  loader: any;
  listaIdsMapa: any;
  filtroActivo: boolean =true;
  user: any;
  public existeSesion: boolean;
  public msj = "Cargando";
  public tFiltro: boolean;
  private objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public persona: number | null;
  public permisos: Array<PermisoModel> | null;
  public afiliacion: boolean;
  public byLogin: boolean;
  public isIOS: boolean = false;
  public subscribe;
  public categoriasEstaVacios = true;
  public nombreCategoria = "";
  public actualPagina = 0;
  public totalDePaginas = 0;
  public seHaceScroll = false;
  public siguientePagina = this.actualPagina + 1;
  public mensaje = InicioPage.MENSAJE_CUANDO_CARGA;
  public totalDePaginasPorConsulta = 0;

  constructor(
    public loadingController: LoadingController,
    private toadController: ToastController,
    private principalSercicio: BusquedaService,
    private modalController: ModalController,
    private notificaciones: ToadNotificacionService,
    private route: ActivatedRoute,
    private eventosServicios: SideBarService,
    private ruta: Router,
    private serviceProveedores: ProveedorServicioService,
    private util: UtilsCls,
    private auth0Service: Auth0Service,
    private validarPermiso: ValidarPermisoService,
    private platform: Platform
  ) {
    this.byLogin = false;
    this.Filtros = new FiltrosModel();
    
    this.Filtros.idEstado = 29;
    const byCategorias =localStorage.getItem("filtroactual");
    if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
      this.selectionAP = false;
      console.log("filtro activo");
    }else{
      this.filtroActivo = false;
      console.log("filtro false");
     
    }
    this.listaCategorias = new Array<ICategoriaNegocio>();
    this.listaIdsMapa = [];
    this.user = this.util.getUserData();
    this.existeSesion = this.util.existe_sesion();
    this.selectionAP = false;
    this.tFiltro = false;
    this.afiliacion = false;
    this.isIOS = this.platform.is("ios");
    this.route.queryParams.subscribe((params) => {
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.backPhysicalBottom();
      });
    });
  
  
  }

  public backPhysicalBottom() {
    const option = localStorage.getItem("filter");
    if (option !== null) {
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
      const byCategorias =localStorage.getItem("filtroactual");
      if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
        const dato = JSON.parse(byCategorias);
        this.Filtros = dato;
        this.filtroActivo = true;
      }else{
        this.filtroActivo = false;
      }
      
       localStorage.removeItem("filter");
      localStorage.setItem("isRedirected", "false");
      this.ruta.navigate(["/tabs/categorias"]);
    }
    const byCategorias =localStorage.getItem("filtroactual");
    if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
  }

  ngOnInit(): void {
    this.user = this.util.getUserData();
    this.load();
    this.route.queryParams.subscribe((params) => {
      if (params.buscarNegocios && params) {
        this.load();
        const byCategorias =localStorage.getItem("filtroactual");
        if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
          const dato = JSON.parse(byCategorias);
          this.Filtros = dato;
          this.filtroActivo = true;
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params.byLogin && params) {
        this.negocioRutaByLogin(params.byLogin);
        const byCategorias =localStorage.getItem("filtroactual");
        if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
          const dato = JSON.parse(byCategorias);
          this.Filtros = dato;
          this.filtroActivo = true;
        }
      }
    });
    const byCategorias =localStorage.getItem("filtroactual");
    if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }

  }

  private load() {
    const selected = localStorage.getItem("org");
    if (selected != null) {
      this.selectionAP = true;
      this.objectSelectAfiliacionPlaza = JSON.parse(
        String(localStorage.getItem("org"))
      );
    }

    this.buscarNegocios(true);
    if (this.util.existSession()) {
      this.persona = this.util.getIdPersona();
      this.permisos = this.auth0Service.getUserPermisos();
      this.afiliacion = this.validarPermiso.isChecked(
        this.permisos,
        "ver_afiliacion"
      );
    }
  }
  /**
   * Scroll
   * @author Omar
   */
  scrollToTop() {
    this.content.scrollToTop(500).then((r) => {});
  }

  public recargar(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.ngOnInit();
    }, 2000);
  }

  ionViewWillEnter() {
    let categoria = localStorage.getItem("seleccionado");
    if (this.filtroActivo === false) {
      localStorage.setItem("resetFiltro", "0");
    }
    let estatusFiltro = localStorage.getItem("resetFiltro");
    if (categoria !== null) {
      this.filtroActivo = true;
      const dato = JSON.parse(categoria);
      localStorage.setItem("resetFiltro", "1");
      estatusFiltro = localStorage.getItem("resetFiltro");
      this.Filtros = new FiltrosModel();
      // this.Filtros.idGiro = [dato.idGiro != null ? dato.idGiro : 1];
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      this.buscarNegocios(true);
      localStorage.removeItem("seleccionado");
    }
    if (categoria === null && estatusFiltro === "0") {
      if (
        this.Filtros.abierto === null &&
        this.Filtros.blnEntrega === null &&
        this.Filtros.idEstado === 29 &&
        this.Filtros.idCategoriaNegocio === null &&
        this.Filtros.idGiro === null &&
        this.Filtros.idLocalidad === null &&
        this.Filtros.idMunicipio === null &&
        this.Filtros.idTipoNegocio === null &&
        this.Filtros.intEstado === 0 &&
        this.Filtros.kilometros === 10 &&
        this.Filtros.latitud === 0 &&
        this.Filtros.longitud === 0 &&
        this.Filtros.strBuscar === "" &&
        this.Filtros.strMunicipio === "" &&
        this.Filtros.tipoBusqueda === 0
      ) {
      } else {
        this.borrarFiltros();
      }
    }
  }

  async validarResultadosDeCategorias(respuesta: any) {
    const cantidadDeResultados = respuesta.data.lst_cat_negocios.data.length;
    if (cantidadDeResultados > 0) {
      this.actualPagina = respuesta.data.lst_cat_negocios.current_page;
      this.siguientePagina = this.actualPagina + 1;
      this.totalDePaginas = respuesta.data.lst_cat_negocios.total;
      this.totalDePaginasPorConsulta = respuesta.data.lst_cat_negocios.to;
      this.categoriasEstaVacios = false;
      this.lengthLista = this.listaCategorias.length;

      if (this.actualPagina > 1) {
        this.listaCategorias.push(...respuesta.data.lst_cat_negocios.data);
        this.negociosIdMapa();
        if (
          this.listaCategorias[this.lengthLista - 1].nombre ==
            this.listaCategorias[this.lengthLista].nombre ||
          this.listaCategorias[this.lengthLista - 1].nombre == ""
        ) {
          this.listaCategorias[this.lengthLista].nombre = "";
        }
      } else {
        this.listaCategorias = respuesta.data.lst_cat_negocios.data;
        this.negociosIdMapa();
      }
    } else {
      throw throwError("");
    }
  }

  cargarCategorias() {
    const byCategorias =localStorage.getItem("filtroactual");
    if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
    this.principalSercicio
      .obtenerNegocioPorCategoria(this.Filtros, this.siguientePagina)
      .then((respuesta) => {
        this.validarResultadosDeCategorias(respuesta);
        this.loader = false;
        //
        const byCategorias=localStorage.getItem("filtroactual");
        console.log(byCategorias+" & bere "+ " - ");
        if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
          console.log(" 1 bere ");
          this.filtroActivo = true;
        }
      })
      .catch((error) => {
        this.loader = false;
        this.notificaciones.error("Error al buscar los datos"+error.message);
      });
  }

  buscarNegocios(seMuestraElLoader: boolean) {
    this.loader = seMuestraElLoader;
    if (seMuestraElLoader === true) {
      this.siguientePagina = 1;
      this.listaCategorias = [];
    }

    const usr = this.user;
    if (usr.id_persona !== undefined) {
      this.Filtros.id_persona = usr.id_persona;
    }
    
  
    const byCategorias = localStorage.getItem("byCategorias");
    const dato = JSON.parse(byCategorias);
    if (byCategorias !== null && byCategorias !== undefined && byCategorias !== "" && byCategorias.length>0) {
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      this.filtroActivo = true;
    }
    this.selectionAP
      ? (this.Filtros.organizacion =
          this.objectSelectAfiliacionPlaza.id_organizacion)
      : "";
    this.cargarCategorias();
  }

  async configToad(mensaje) {
    const toast = await this.toadController.create({
      color: "dark",
      duration: 2000,
      message: mensaje,
    });
    return await toast.present();
  }

  buscarToolbar(event) {
    this.Filtros = new FiltrosModel();
    this.Filtros.strBuscar = event;
    this.tFiltro = true;
    this.buscarNegocios(true);
  }

  abrirFiltros() {
    this.presentModal();
  }

  async presentModal() {
    let eventEmitter = new EventEmitter();
    eventEmitter.subscribe((res) => {
      this.modal.dismiss({
        dismissed: true,
      });
      this.filtroActivo = true;
      this.Filtros = res;
      let d1= JSON.stringify(res);
      localStorage.setItem("filtroactual", d1);
      this.buscarNegocios(true);
    });

 
    
    this.modal = await this.modalController.create({
      component: FiltrosBusquedaComponent,
      componentProps: {
        buscarPorFiltros: eventEmitter,
        filtros:  this.Filtros,
        isProductPage: false,
      },
    });
    return await this.modal.present();
  }
  public openPlazasAfiliacionesModal() {
    this.presentModalPlazasAfiliaciones();
  }
  async presentModalPlazasAfiliaciones() {
    this.modal = await this.modalController.create({
      component: PlazasAfiliacionesComponent,
      cssClass: "custom-modal-plazas-afiliaciones",
      componentProps: {
        idUsuario: this.persona,
        permisos: this.permisos,
      },
    });

    return await this.modal.present();
  }
  private buscarSeleccionado(seleccionado: any) {
    this.seleccionado = seleccionado;
    this.Filtros = new FiltrosModel();
    this.Filtros.idCategoriaNegocio = [seleccionado.id_categoria];
    this.Filtros.idGiro = [seleccionado.idGiro];
    this.buscarNegocios(true);
  }

  async abrirModalMapa() {
    //  let listaIds = [68, 95, 116, 52, 155, 20, 142];
    const modal = await this.modalController.create({
      component: MapaNegociosComponent,
      componentProps: {
        listaIds: this.listaIdsMapa,
      },
    });
    await modal.present();
  }

  negociosIdMapa() {
    let listaIdNegocio = [];
    let listaIds = [];
    this.listaCategorias.map((l) => {
      l.negocios.map((n) => {
        listaIds.push(n);
      });
    });
    console.log("listacategor", this.listaCategorias);
    console.log("listaids", listaIds);
    for (let index = 0; index < listaIds.length; index++) {
      listaIdNegocio.push(listaIds[index].id_negocio);
    }
    this.listaIdsMapa = listaIdNegocio;
    console.log("listas mapass", this.listaIdsMapa);
  }
  public regresarBitoo() {
    localStorage.removeItem("org");
    location.reload();
  }
  borrarFiltros() {
    localStorage.removeItem("byCategorias");
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.filtroActivo = false;
    this.buscarNegocios(true);
  }
  borrarFiltros2() {
    localStorage.removeItem("filtroactual");
    localStorage.removeItem("byCategorias");
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    /* this.Filtros.idGiro = this.Filtros.idGiro != null ? this.Filtros.idGiro : [1];*/
      this.filtroActivo = false;
    this.buscarNegocios(true);
  }
  negocioRuta(negocioURL) {
    if (negocioURL == "") {
      this.notificaciones.error(
        "Este negocio aún no cumple los requisitos mínimos"
      );
    } else {
      localStorage.setItem("isRedirected", "false");
      this.ruta.navigate(["/tabs/negocio/" + negocioURL]);
    }
  }
  negocioRutaByLogin(url: string) {
    localStorage.setItem("isRedirected", "false");
    this.ruta.navigate(["/tabs/negocio/" + url]);
  }
  cargarMasPaginas(event: any) {
    if (this.totalDePaginasPorConsulta < this.totalDePaginas) {
      this.buscarNegocios(false);
      setTimeout(() => {
        event.target.complete();
      }, 800); // 800 es el tiempo que se tarda por cargar, sin tener un lag por las 20 paginas que se consultan
    } else {
      event.target.disabled = true;
    }
  }
}

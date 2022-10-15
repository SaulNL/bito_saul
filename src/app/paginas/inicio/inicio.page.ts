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
import { INegocios } from 'src/app/interfaces/INegocios';
import { Observable, throwError } from "rxjs";
import { runInThisContext } from "vm";
import { LocalStorageUtil } from "../../utils/localStorageUtil";
import { AlertController } from "@ionic/angular";
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;
declare var google: any;


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
  loaderNegocios: any;
  listaIdsMapa: any;
  filtroActivo: boolean = true;
  user: any;
  public existeSesion: boolean;
  public msj = "Cargando";
  public tFiltro: boolean;
  public objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public persona: number | null;
  public permisos: Array<PermisoModel> | null;
  public afiliacion: boolean;
  public byLogin: boolean;
  public isIOS: boolean = false;
  public subscribe;
  public categoriasEstaVacios = true;
  public nombreCategoria = "";
  public actualPagina = 0;
  public actualGiro=0;
  public totalDePaginas = 0;
  public seHaceScroll = false;
  public siguientePagina = this.actualPagina + 1;
  public siguienteGiro = this.actualGiro +1;
  public mensaje = InicioPage.MENSAJE_CUANDO_CARGA;
  public totalDePaginasPorConsulta = 0;
  activedPage: string;
  
  lstCatTipoGiro: any;
  idGiro: number=null;
  todos: number;
  todo: number;
  idTodo: boolean;
  
  public miUbicacionlongitud: number;
  public miUbicacionlatitud: number;
  public estasUbicacion: string;
  public municipio: any;
  public blnUbicacion: boolean;
  public latitud: any;
  public longitud: any;
  public ubicacion: any;
  public tipoBusqueda: any;

  public banderaUbicacion: boolean;
  public banderaInicio: boolean;
  public idNegocio: number;
  mostrarloaderInicio: boolean;
  loaderInicio: boolean;
  buscador = false;
  banderaVerMas = false;
  listaVerMas: any[] = [];
  mostrarNegocios: any = 4;

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
    private platform: Platform,
    public alertController: AlertController  
  ) {
    this.byLogin = false;
    this.Filtros = new FiltrosModel();
    this.obtenergiros();

    if(localStorage.getItem("idGiro") != null){
      this.idGiro=JSON.parse( localStorage.getItem("idGiro"));
    }

    if(localStorage.getItem("activarTodos") === "true"){
      this.filtroActivo = true;
    }
    
    this.Filtros.idEstado = 29;
    const byCategorias = localStorage.getItem("filtroactual");
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== "" &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      if (localStorage.getItem("filtroActivo") === "true" && !this.isIOS) {
        this.filtroActivo = true;
      }
      this.filtroActivo = true;
      this.selectionAP = false;

    } else {
      this.filtroActivo = false;

    }
    this.listaCategorias = new Array<ICategoriaNegocio>();
    this.listaIdsMapa = [];
    this.banderaInicio = false;
    this.user = this.util.getUserData();
    this.existeSesion = this.util.existe_sesion();
   //aqui para cargar
   this.loaderNegocios=true;
    this.tFiltro = false;
    this.afiliacion = true;
    this.mostrarloaderInicio=true;
    this.isIOS = this.platform.is("ios");
    this.route.queryParams.subscribe((params) => {
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.backPhysicalBottom();
      });
    });
    localStorage.removeItem("productos");
  }

  public backPhysicalBottom() {
    const option = localStorage.getItem("filter");
    if (option !== null) {
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
      const byCategorias = localStorage.getItem("filtroactual");
      if (
        byCategorias !== null &&
        byCategorias !== undefined &&
        byCategorias !== "" &&
        byCategorias.length > 0
      ) {
        const dato = JSON.parse(byCategorias);
        this.Filtros = dato;
        this.filtroActivo = true;
      } else {
        
        if (localStorage.getItem("filtroActivo") === "true" && !this.isIOS) {
          this.filtroActivo = true;
        }else{
          this.filtroActivo = false;
        }
        
      }
      localStorage.removeItem("filter");
      localStorage.setItem("isRedirected", "false");
      this.ruta.navigate(["/tabs/categorias"]);
    }
    const byCategorias = localStorage.getItem("filtroactual");
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== "" &&
      byCategorias.length > 0
    ) {
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
        const byCategorias = localStorage.getItem("filtroactual");
       
        if (
          byCategorias !== null &&
          byCategorias !== undefined &&
          byCategorias !== "" &&
          byCategorias.length > 0
        ) {
          const dato = JSON.parse(byCategorias);
          this.Filtros = dato;
          this.filtroActivo = true;
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params.byLogin && params) {
        this.negocioRutaByLogin(params.byLogin);
        const byCategorias = localStorage.getItem("filtroactual");
        if (
          byCategorias !== null &&
          byCategorias !== undefined &&
          byCategorias !== "" &&
          byCategorias.length > 0
        ) {
          const dato = JSON.parse(byCategorias);
          this.Filtros = dato;
          this.filtroActivo = true;
        }
      }
    });
    const byCategorias = localStorage.getItem("filtroactual");
   
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== "" &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
    
    if (localStorage.getItem("activarTodos") === "true" ) {
      this.idTodo=true;
    }else{
      this.idTodo=false;
    }
    const pagina = localStorage.getItem('Page');

    if (pagina === 'Requerimiento') {
      window.location.assign("/tabs/inicio");
      localStorage.removeItem("Page");
    }
    localStorage.removeItem("productos");
    localStorage.setItem('negocios', ('active'));
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
      // this.afiliacion = this.validarPermiso.isChecked(
      //   this.permisos,
      //   "ver_afiliacion"
      // );
    }
  }
  /**
   * Scroll
   * @author Omar
   */
  scrollToTop() {
    this.content.scrollToTop(500).then((r) => { });
  }

  public recargar(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.ngOnInit();
      localStorage.removeItem("productos");
    }, 2000);
  }

  ionViewWillEnter() {
    if(this.isIOS){
      this.getCurrentPosition();
    }

    if (localStorage.getItem("loaderNegocio") === "true" ) {
      this.idNegocio=null;
      localStorage.removeItem("loaderNegocio");
    }

    if(!this.isIOS){
      this.platform.backButton.subscribeWithPriority(10, () => {
        const byCategorias = localStorage.getItem("byCategorias");
        if(byCategorias!=null){
        this.ruta.navigate(['/tabs/categorias']);
        }      
      });
    }
    

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
      //this.Filtros.idGiro = [dato.idGiro != null ? dato.idGiro : 1];
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
    if(cantidadDeResultados < 0){
      this.listaCategorias = [];
      this.selectionAP = true;
    }
    if (cantidadDeResultados > 0) {
      this.actualPagina = respuesta.data.lst_cat_negocios.current_page;
      this.siguientePagina = this.actualPagina + 1;
      //this.siguienteGiro = this.actualGiro +1;
      this.totalDePaginas = respuesta.data.lst_cat_negocios.total;
      this.totalDePaginasPorConsulta = respuesta.data.lst_cat_negocios.to;
      this.categoriasEstaVacios = false;
      this.lengthLista = this.listaCategorias.length;

      if (this.actualPagina > 1 || this.actualGiro >1) {
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
        console.log("sin ordenar +++++++++++++++++++")
        console.log(JSON.stringify(respuesta.data.lst_cat_negocios.data))
        let aux = this.ordenarRandom(respuesta.data.lst_cat_negocios.data) //id_categoria_negocio    
        this.listaCategorias = aux;
        this.negociosIdMapa();
      }
    } else {
      throw throwError("");
    }
  }
  ordenarRandom(listaCat:any[]){
    console.log("entra random+++++++++++++++++++")
    let nuevaLista:any[]=[];
    nuevaLista=listaCat.sort(function() { return Math.random() - 0.5 });/*(function (a, b) {
      return (a.id_categoria_negocio - b.id_categoria_negocio)
  })*/  
    console.log(JSON.stringify(nuevaLista)) 
    return nuevaLista;
  }

  async validarResultadosDeCategoriasAll(respuesta: any) {
    const cantidadDeResultados = respuesta.data.lst_cat_negocios.data.length;
    if (cantidadDeResultados > 0) {
      if (this.actualPagina > 1 || this.actualGiro >1) {
        this.obtenerNegocios([...respuesta.data.lst_cat_negocios.data]);
      } else {
        this.obtenerNegocios(respuesta.data.lst_cat_negocios.data);
      }
    } else {
      throw throwError("");
    }
  }
  
  public getCurrentPosition(){
    let gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
    Geolocation.getCurrentPosition(gpsOptions).then(res => {
      console.log("latitu y longituuuuuuuuuudddddd")
        this.miUbicacionlatitud = res.coords.latitude;
        this.miUbicacionlongitud = res.coords.longitude;
        this.latitud = this.miUbicacionlatitud;
        this.longitud = this.miUbicacionlongitud;
        try {
            this.ubicacion = 'ubicacion';
            this.tipoBusqueda = 1;
            this.geocodeLatLng();
        } catch (e) {
        }
    }).catch(error => {
        this.ubicacion = 'localidad';
        this.latitud = undefined;
        this.longitud = undefined;
        this.AlertActivarUbicacion();
    }
    );  
  }

  public geocodeLatLng() {
    // @ts-ignore
    const geocoder = new google.maps.Geocoder;
    const latlng = {
        lat: parseFloat(String(this.miUbicacionlatitud)),
        lng: parseFloat(String(this.miUbicacionlongitud))
    };
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                let posicion = results[0].address_components.length;
                posicion = posicion - 4;
                this.estasUbicacion = results[0].formatted_address;
                this.municipio = results[0].address_components[posicion].long_name;
            } else {

            }
        } else {

        }
    });
  }

  async AlertActivarUbicacion() {
    const alert = await this.alertController.create({
      header: 'Bitoo!',
      message: "Activa tu ubicación para poder ver los negocios cerca de ti",
      buttons: [
        {
            text: "Aceptar",
            cssClass: 'text-grey',
            // handler: () => {
            //   this.cerrarModal();
            // }
        },
      ],
    });
    await alert.present();
  }

  async validarResultadosTodos(respuesta: any) {
    const cantidadDeResultados = respuesta.data.lst_cat_negocios.length;
    if (cantidadDeResultados > 0) {
      //if (this.actualPagina > 1) {
        this.obtenerNegocios2([respuesta.data.lst_cat_negocios]);
      //} else {
        //this.obtenerNegocios(respuesta.data.lst_cat_negocios);
      //}
    } else {
      throw throwError("");
    }
  }
  public async cargarCategorias() {
    const byCategorias = localStorage.getItem("filtroactual");
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== "" &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
    try {     
      var respuesta = await this.principalSercicio
        .obtenerNegocioPorCategoria(this.Filtros, this.siguientePagina)        
      this.validarResultadosDeCategorias(respuesta);
      //console.log("respuest cargar c");
      //console.log(respuesta);
      //await this.procesar(respuesta, 1);
      const byCategorias2 = localStorage.getItem("filtroactual");
      if (
        byCategorias2 !== null &&
        byCategorias2 !== undefined &&
        byCategorias2 !== "" &&
        byCategorias2.length > 0
      ) {
        this.filtroActivo = true;
      }
      this.loader = false;
    } catch (error) {
      this.loader = false;
      // this.notificaciones.error("Error al buscar los datos" + error.message);
      this.notificaciones.error("No hay conexión a internet, conectate a una red");
    }
  }
  public async cargarCargarNegociosMapas() {
    this.loader = true;
    try {
      var respuesta = await this.principalSercicio
        .obtenerNegocioPorCategoria(this.Filtros, this.siguientePagina)
      await this.procesar(respuesta, 0);
      this.loader = false;
    } catch (error) {
      this.loader = false;
      this.notificaciones.error("No hay conexión a internet, conectate a una red");
    }

  }
  public async procesar(response: any, i: number) {
    if (response.data.lst_cat_negocios.last_page >= i) {
      if(this.Filtros.idCategoriaNegocio == null  && this.Filtros.abierto == null && this.Filtros.blnEntrega == null
         && this.Filtros.idGiro == null  && this.Filtros.intEstado == 0
         && this.Filtros.idLocalidad == null && this.Filtros.idMunicipio == null && this.Filtros.latitud == 0 && this.Filtros.longitud == 0
         && this.Filtros.organizacion == null && this.Filtros.strBuscar == "" && this.Filtros.strMunicipio == ""
         && this.Filtros.tipoBusqueda == 0
        ){
          this.banderaInicio = true;
          if(!this.isIOS){
            this.getCurrentPosition();
          }
          var responseNegociosTodos = await this.principalSercicio.obtenerNegociosTodosMapa();
          await this.validarResultadosTodos(responseNegociosTodos);
      }else{
        this.banderaInicio = false;
        var response2 = await this.principalSercicio.obtenerNegocioPorCategoria(this.Filtros, i);
        await this.validarResultadosDeCategoriasAll(response2);
        i=i+1;
        await this.procesar(response,i );
        
        return
      }
    } else {
      this.loader = false;
      return
    }
  }

  public async buscarNegocios(seMuestraElLoader: boolean) {
    this.loader = seMuestraElLoader;
    this.listaIdsMapa = [];
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
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== "" &&
      byCategorias.length > 0
    ) {
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      this.filtroActivo = true;
      this.banderaVerMas = false;
    }
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : "";
      this.loaderNegocios=false;
      const todo = localStorage.getItem("todo");

       if(todo === 'todo' || localStorage.getItem('org') != null){
        await this.cargarCategorias();
       }
     
      const org = localStorage.getItem("org");
      const categorias = localStorage.getItem("byCategorias");

      if(org === null && categorias === null && this.idGiro === null &&  localStorage.getItem("todo") ===null){
        this.loader = false;
        this.selectionAP = null;
        this.obtenerPrincipalInicio();
      }
      //await this.cargarCategorias();
      
      this.loader = false;
    
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
    this.buscador = false;
    localStorage.setItem("todo", "todo");
  
    if(event===null){
      localStorage.removeItem("filtroactual");
      this.obtenerPrincipalInicio();
    }else{
      this.buscarNegocios(true);
      this.selectionAP = false;
      this.buscador = true
    }
    
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
      let d1 = JSON.stringify(res);
      localStorage.setItem("filtroactual", d1);
      localStorage.setItem("todo", "todo");
      this.buscarNegocios(true);
    });

    this.modal = await this.modalController.create({
      component: FiltrosBusquedaComponent,
      componentProps: {
        buscarPorFiltros: eventEmitter,
        filtros: this.Filtros,
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
   this.listaIdsMapa = [];
   await this.buscarNegocios(true);
   await this.cargarCargarNegociosMapas()

    const modal = await this.modalController.create({
      component: MapaNegociosComponent,
      componentProps: {
        listaIds: this.listaIdsMapa,
        latitud: this.latitud,
        longitud: this.longitud,
        banderaInicio: this.banderaInicio
      },
    });  
    await modal.present();
  }

  public negociosIdMapa() {

    let listaIds = [];
    this.listaCategorias.map((l) => {
      l.negocios.map((n) => {
        listaIds.push(n);
      });
    });
  }

  public obtenerNegocios(listaCategoriasAll: ICategoriaNegocio[]) {

    let listaIds = [];
    listaCategoriasAll.map((l) => {
      l.negocios.map((n) => {
        listaIds.push(n);
      });
    });
    for (let index = 0; index < listaIds.length; index++) {
      this.listaIdsMapa.push(listaIds[index].id_negocio);
    }
  }

  public obtenerNegocios2(listaCategoriasAll: INegocios[]) {

    let listaIds = [];
    listaCategoriasAll.map((l) => {
      //negocios.map((n) => {
        listaIds.push(l);
      //});
    });
    
    let tamano = listaIds[0].length;
    

    for (let index = 0; index < listaIds[0].length; index++) {
      this.listaIdsMapa.push(listaIds[0][index].id_negocio);
    }
  }

  public regresarBitoo() {
    localStorage.removeItem("org");
    localStorage.removeItem("todo");
    localStorage.removeItem("activarTodos");

    this.objectSelectAfiliacionPlaza = null;
    this.borrarFiltros();
    this.borrarFiltrosP();
    
  }
  borrarFiltros() {
    localStorage.removeItem("byCategorias");
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    /* this.Filtros.idGiro = this.Filtros.idGiro != null ? this.Filtros.idGiro : [1];*/
    this.filtroActivo = false;
    this.buscarNegocios(true);
  }
  borrarFiltrosP() {
    localStorage.removeItem("filtroactual");
    localStorage.removeItem("byCategorias");
    localStorage.removeItem("filtroActivo");
    localStorage.removeItem("idGiro");
    this.idGiro=null;
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.filtroActivo = false;
    localStorage.removeItem("todo");
    const org = localStorage.getItem("org");
    if(org!=null){
      this.activar();
    }

    if(org===null){
      this.selectionAP = null;
    }
    this.buscarNegocios(true);
  }
  negocioRuta(negocioURL, proveedor) {
    
    this.idNegocio=proveedor;
    setTimeout(()=>{            
      if (negocioURL == "") {
        this.notificaciones.error(
          "Este negocio aún no cumple los requisitos mínimos"
        );
      } else {
  
        if (this.tFiltro === true) {
          localStorage.setItem("isRedirected", "false");
          this.ruta.navigate(["/tabs/negocio/" + negocioURL]);
  
  
        } else {
          localStorage.setItem("isRedirected", "true");
          this.ruta.navigate(["/tabs/negocio/" + negocioURL]);
        }
  
      }
  }, 1000);
    
  }
  negocioRutaByLogin(url: string) {
    localStorage.setItem("isRedirected", "false");
    this.ruta.navigate(["/tabs/negocio/" + url]);
  }
  cargarMasPaginas(event: any) {
    if ( this.totalDePaginas>=this.totalDePaginasPorConsulta ) {
      this.buscarNegocios(false);
      setTimeout(() => {
        event.target.complete();
      }, 800); // 800 es el tiempo que se tarda por cargar, sin tener un lag por las 20 paginas que se consultan
    } else {
      event.target.disabled = true;
    }
  }

  cargarMasNegocios(event: any){
    let negocios = [];
    this.listaCategorias.map(e => negocios = e.negocios);

    if (this.listaVerMas.length != negocios.length) {
      setTimeout(() => {
        this.mostrarNegocios += 4;
        this.listaVerMas = negocios.slice(0, this.mostrarNegocios);
        event.target.complete();
        
      }, 800);
    } else {
      event.target.disabled = true;
    }
    
  }

  public obtenerPrincipalInicio(nombre?: string){
    localStorage.removeItem("todo");
    this.idTodo=false;
    this.loader = true;
    this.loaderInicio=true;
    this.banderaVerMas= false;

    let convenio = nombre == 'Con Convenio' ? 'convenio' : null;
    let promocion = nombre == 'Con Promociones' ? 'promocion' : null;
    let destacados = nombre == 'Destacados' ? 'destacados' : null;

    if (nombre === undefined) {
      this.principalSercicio.obtenerPrincipalInicio()
        .subscribe(
          (response) => {
          
            if (response.code === 200) {
              this.listaCategorias = response.data;
              setTimeout(() => {
                this.loader = false;
                this.loaderInicio=false;
                this.mostrarloaderInicio=false;
              }, 800);
            }
          },
          (error) => {
            this.loader = false;
            this.loaderInicio=false;
            this.mostrarloaderInicio=false;
            //this._notificacionService.error(error);
          }
        );
        return false;
    }

      if (destacados != null) {
        this.activar();        
      } else {
        let body = { tipo: convenio != null ? convenio : promocion};

        this.principalSercicio.obtenerPrincipalInicioTodos(body).subscribe(
          (response) => {
          
            if (response.code === 200) {

              this.banderaVerMas = true;
              this.listaCategorias = response.data;
              this.listaCategorias.map(e => {
                this.listaVerMas = e.negocios.slice(0, 4);
              });

              setTimeout(() => {
                this.loader = false;
                this.loaderInicio=false;
                this.mostrarloaderInicio=false;
              }, 800);
              
            }
          },
          (error) => {
            this.loader = false;
            this.loaderInicio=false;
            this.mostrarloaderInicio=false;
            //this._notificacionService.error(error);
          },
          () => {
            this.scrollToTop();
          }
        );
      }
  }

  public obtenergiros() {
    this.principalSercicio.obtenerGiros().subscribe(
      response => {
        this.lstCatTipoGiro= response.data;
        this.lstCatTipoGiro.map(i => {
          const aux = i.nombre;
          i.nombreB = aux.replace(' y ', (' y' + '<div></div>'));
        });
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  async buscarByGiro(event){
    localStorage.removeItem("activarTodos");
    localStorage.setItem("todo", "todo");
    this.idTodo=false;
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.filtroActivo = true;
    this.banderaVerMas = false;
    this.loaderNegocios=true;
    this.idGiro =event;   
    localStorage.setItem("idGiro",JSON.stringify(this.idGiro)) 
    this.Filtros.idGiro=[this.idGiro];
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : "";
    let d1 = JSON.stringify(this.Filtros);
    localStorage.setItem("filtroactual", d1);
    var respuesta = await this.principalSercicio
        .obtenerNegocioPorCategoria(this.Filtros, this.siguienteGiro);
        this.listaCategorias=[];
      if(respuesta.data.lst_cat_negocios.total>0){
        this.validarResultadosDeCategorias(respuesta);
      }else{
        this.listaCategorias=[];
        this.selectionAP = true;
      }
      this.loaderNegocios=false;

  }

  async activar(){
    localStorage.removeItem("filtroactual");
    localStorage.removeItem("byCategorias");
    localStorage.removeItem("filtroActivo");
    localStorage.removeItem("idGiro");
    localStorage.setItem("activarTodos", "true");
    this.idTodo=true;
    this.idGiro =null;
    this.filtroActivo=false; 
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : "";
    localStorage.setItem("todo", "todo");
    var respuesta = await this.principalSercicio
        .obtenerNegocioPorCategoria(this.Filtros, this.siguienteGiro)
      this.validarResultadosDeCategorias(respuesta);
      this.loader = false;
      this.scrollToTop();
  }
}

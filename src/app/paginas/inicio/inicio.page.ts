import { PlazasAfiliacionesComponent } from '../../componentes/plazas-afiliaciones/plazas-afiliaciones.component';
import { AfiliacionPlazaModel } from '../../Modelos/AfiliacionPlazaModel';
import { Auth0Service } from '../../api/busqueda/auth0.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  IonContent,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { BusquedaService } from '../../api/busqueda.service';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { FiltrosBusquedaComponent } from '../../componentes/filtros-busqueda/filtros-busqueda.component';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { ActivatedRoute } from '@angular/router';
import { MapaNegociosComponent } from '../../componentes/mapa-negocios/mapa-negocios.component';
import { SideBarService } from '../../api/busqueda/side-bar-service';
import { Router } from '@angular/router';
import { UtilsCls } from '../../utils/UtilsCls';
import { PermisoModel } from 'src/app/Modelos/PermisoModel';
import { ICategoriaNegocio } from 'src/app/interfaces/ICategoriaNegocio';
import { INegocios } from 'src/app/interfaces/INegocios';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { PersonaService } from 'src/app/api/persona.service';
import { FiltrosService } from 'src/app/api/filtros.service';
import Swal from 'sweetalert2';
import {ModalInicioComponent} from '../../componentes/modal-inicio/modal-inicio.component';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory, Encoding, } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
declare var google: any;


@Component({
  selector: 'app-tab3',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  providers: [SideBarService],
})
export class InicioPage implements OnInit, AfterViewInit {
  
  @ViewChild("fileUpload", {
    read: ElementRef
  }) fileUpload: ElementRef;

  public isAlert: boolean = false;
  public listaCtgs: Array<any>;

  constructor(
      private busquedaService: BusquedaService,
    public loadingController: LoadingController,
    private toadController: ToastController,
    private principalSercicio: BusquedaService,
    private modalController: ModalController,
    private notificaciones: ToadNotificacionService,
    private route: ActivatedRoute,
    private ruta: Router,
    private personaServcie: PersonaService,
    private util: UtilsCls,
    private auth0Service: Auth0Service,
    private platform: Platform,
    public alertController: AlertController,
    private filtrosService: FiltrosService,
    private router: Router,
  ) {
    localStorage.removeItem('banderaCerrar');
    localStorage.removeItem('modalPromo');
    this.loaderVideo = true;
    this.subCAt = localStorage.getItem('subCat') != undefined ? true : false;
    // if (this.subCAt) {
    //   localStorage.removeItem('subCat');
    // }
    this.afi = localStorage.getItem('afi') != undefined ? true : false;
    // if (this.afi) {
    //   localStorage.removeItem('afi');
    // }
    this.byLogin = false;
    this.Filtros = new FiltrosModel();
    this.obtenergiros();
    this.regresarBitoo(false); // se puso este metodo para que cuando cierren la app y vuelvan entrar, mande al nuevo inicio

    if (localStorage.getItem('idGiro') != null) {
      this.idGiro = JSON.parse(localStorage.getItem('idGiro'));
    }

    if (localStorage.getItem('activarTodos') === 'true') {
      this.filtroActivo = true;
    }

    this.Filtros.idEstado = 29;
    const byCategorias = localStorage.getItem('filtroactual');
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      if (localStorage.getItem('filtroActivo') === 'true' && !this.isIOS) {
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
    // aqui para cargar
    this.loaderNegocios = true;
    this.tFiltro = false;
    this.afiliacion = true;
    this.mostrarloaderInicio = true;
    this.isIOS = this.platform.is('ios');
    this.route.queryParams.subscribe((params) => {
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.backPhysicalBottom();
      });
    });
    localStorage.removeItem('productos');
  }
  public static readonly MENSAJE_CUANDO_CARGA = 'Cargar más';
  public static readonly PAGINAS_POR_CONSULTA = 20;
  @ViewChild(IonContent) content: IonContent;
  public lengthLista: number;
  public totalPaginas: number;
  public cordenada: number;
  public Filtros: FiltrosModel;
  public listaCategorias: Array<ICategoriaNegocio>;
  public listaCompleta: any;
  private modal: any;
  public selectionAP = false;
  public subCatBandera = false;
  public anyFiltros: FiltrosModel;
  strBuscar: any;
  private seleccionado: any;
  loader: any;
  loaderNegocios: any;
  listaIdsMapa: any;
  filtroActivo = true;
  user: any;
  public paginacion = [];
  public pagSelect: any;
  public lastPage: number;
  public variablePrueba = false;
  public existeSesion: boolean;
  public msj = 'Cargando';
  public tFiltro: boolean;
  public objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public persona: number | null;
  public permisos: Array<PermisoModel> | null;
  public afiliacion: boolean;
  public byLogin: boolean;
  public isIOS = false;
  public subscribe;
  public categoriasEstaVacios = true;
  public nombreCategoria = '';
  public actualPagina = 0;
  public actualGiro = 0;
  public totalDeNegocios = 0;
  public loaderTop = false;
  public filtroBusqueda = false;
  public siguientePagina = this.actualPagina + 1;
  public siguienteGiro = this.actualGiro + 1;
  public mensaje = InicioPage.MENSAJE_CUANDO_CARGA;
  public totalDeNegociosPorConsulta = 0;
  activedPage: string;

  lstCatTipoGiro: any;
  idGiro: number = null;
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
  public verMasNegociosCon = false;
  public verMasNegociosPromo = false;
  public verMasNegociosVistos = false;
  public verMasNegociosConBtn = true;
  public verMasNegociosPromoBtn = true;
  public verMasNegociosVistosBtn = true;
  public idNegocio: number;
  public indice: number;
  mostrarloaderInicio: boolean;
  loaderInicio: boolean;
  loaderVideo: boolean;
  buscador = false;
  banderaVerMas = false;
  listaVerMas: any[] = [];
  mostrarNegocios: any = 4;
  paginaPivote: number;
  primeraPagRandom: number;
  paginaPrevia: number;
  pagBoton = false;
  scrollAmount: any;
  isLoading: boolean;
  consultaTerminada = true;
  showPopUp: boolean;
  insigniaTitle: string;
  insigniaDescrip: string;
  loaderVerMas = false;
  favoritos: any[] = [];
  buttonDisabled: boolean;
  public subCAt: boolean;
  public afi: boolean;

  public backPhysicalBottom() {
    const option = localStorage.getItem('filter');
    if (option !== null) {
      this.Filtros = new FiltrosModel();
      this.Filtros.idEstado = 29;
      const byCategorias = localStorage.getItem('filtroactual');
      if (
        byCategorias !== null &&
        byCategorias !== undefined &&
        byCategorias !== '' &&
        byCategorias.length > 0
      ) {
        const dato = JSON.parse(byCategorias);
        this.Filtros = dato;
        this.filtroActivo = true;
      } else {

        if (localStorage.getItem('filtroActivo') === 'true' && !this.isIOS) {
          this.filtroActivo = true;
        } else {
          this.filtroActivo = false;
        }

      }
      localStorage.removeItem('filter');
      localStorage.setItem('isRedirected', 'false');
      this.ruta.navigate(['/tabs/categorias']);
    }
    const byCategorias = localStorage.getItem('filtroactual');
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.loaderTop = false;
    this.user = this.util.getUserData();
    this.load();
    this.route.queryParams.subscribe((params) => {
      if (params.buscarNegocios && params) {
        this.load();
        const byCategorias = localStorage.getItem('filtroactual');
        if (
          byCategorias !== null &&
          byCategorias !== undefined &&
          byCategorias !== '' &&
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
        const byCategorias = localStorage.getItem('filtroactual');
        if (
          byCategorias !== null &&
          byCategorias !== undefined &&
          byCategorias !== '' &&
          byCategorias.length > 0
        ) {
          const dato = JSON.parse(byCategorias);
          this.Filtros = dato;
          this.filtroActivo = true;
        }
      }
    });
    const byCategorias = localStorage.getItem('filtroactual');

    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }

    if (localStorage.getItem('activarTodos') === 'true') {
      this.banderaVerMas == false;
      this.idTodo = true;
    } else {
      this.idTodo = false;
    }
    const pagina = localStorage.getItem('Page');

    if (pagina === 'Requerimiento') {
      window.location.assign('/tabs/inicio');
      localStorage.removeItem('Page');
    }
    localStorage.removeItem('productos');
    localStorage.setItem('negocios', ('active'));
  }


  ngAfterViewInit() {
    this.banderaVerMas = false;
    setTimeout(() => {
      this.obtenerPreferencias(this.user.id_persona);
    }, (4000));
  }

  async obtenerPreferencias(id_persona: number) {
    this.filtrosService.obtenerPreferencias(id_persona).subscribe(
      async response => {
        if (response.code == 200) {
          const listaPreferencias = response.data.preferencias;
          if (listaPreferencias.length < 1) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center'
            });
            Toast.fire({
              title: 'Queremos conocer más sobre tus gustos en Bituyú.',
              text: 'Registra tus preferencias',
              icon: 'info',
              showDenyButton: false,
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: '¡Claro!',
              cancelButtonText: 'Después',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then((result) => {
              if (result.isConfirmed) {
                this.ruta.navigate(['/tabs/home/preferencias']);
              } else if (result.isDismissed || result.isDenied) {
              }
            });
          }
        }
      },
      error => {
      }
    );

  }

  private load() {
    const selected = localStorage.getItem('org');
    if (selected != null) {
      this.selectionAP = true;
      this.objectSelectAfiliacionPlaza = JSON.parse(
        String(localStorage.getItem('org'))
      );
    }

    this.buscarNegocios(true);
    if (this.util.existSession()) {
      this.persona = this.util.getIdPersona();
      this.permisos = this.auth0Service.getUserPermisos();
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
      localStorage.removeItem('productos');
    }, 2000);
  }

  ionViewWillEnter() {
    const idGiro = JSON.parse(localStorage.getItem('idGiro'));
    if (idGiro !== null) {
      this.buscarByGiro(idGiro);
    }
    this.subCAt = localStorage.getItem('subCat') != undefined ? true : false;
    // if (this.subCAt) {
    //   localStorage.removeItem('subCat')
    // }
    this.afi = localStorage.getItem('afi') != undefined ? true : false;
    // if (this.afi) {
    //   localStorage.removeItem('afi');
    // }

    if (this.isIOS) {
      this.getCurrentPosition();
    }

    if (localStorage.getItem('loaderNegocio') === 'true') {
      this.idNegocio = null;
      localStorage.removeItem('loaderNegocio');
    }

    if (!this.isIOS) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        const byCategorias = localStorage.getItem('byCategorias');
        if (byCategorias != null) {
          this.ruta.navigate(['/tabs/categorias']);
        }
      });
    }


    const categoria = localStorage.getItem('seleccionado');
    if (this.filtroActivo === false) {
      localStorage.setItem('resetFiltro', '0');
    }
    let estatusFiltro = localStorage.getItem('resetFiltro');
    if (categoria !== null) {
      this.filtroActivo = true;
      const dato = JSON.parse(categoria);
      localStorage.setItem('resetFiltro', '1');
      estatusFiltro = localStorage.getItem('resetFiltro');
      this.Filtros = new FiltrosModel();
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      if (!localStorage.getItem('byCategorias')) {
        this.buscarNegocios(true);
      }
      localStorage.removeItem('seleccionado');
    }
    if (categoria === null && estatusFiltro === '0') {
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
        this.Filtros.strBuscar === '' &&
        this.Filtros.strMunicipio === '' &&
        this.Filtros.tipoBusqueda === 0
      ) {
      } else {
        this.borrarFiltros();
      }
    }
  }

  async validarResultadosDeCategorias(respuesta: any) {
    this.banderaVerMas == false;
    const cantidadDeResultados = respuesta.data.lst_cat_negocios.data.length;
    if (cantidadDeResultados < 0) {
      this.listaCategorias = [];
      this.selectionAP = true;
    }
    if (cantidadDeResultados > 0) {
      this.actualPagina = respuesta.data.lst_cat_negocios.current_page;
      this.siguientePagina = this.actualPagina + 1;
      this.totalDeNegocios = respuesta.data.lst_cat_negocios.total;
      this.totalPaginas = Math.ceil((this.totalDeNegocios / 20));
      this.totalDeNegociosPorConsulta = respuesta.data.lst_cat_negocios.to;
      this.categoriasEstaVacios = false;
      this.lengthLista = this.listaCategorias.length;
      this.banderaVerMas == false;
      if (this.actualPagina > 1 || this.actualGiro > 1) {
        this.listaCategorias.push(...respuesta.data.lst_cat_negocios.data);
        this.negociosIdMapa();
        this.banderaVerMas == false;
      } else {

        this.listaCategorias = await respuesta.data.lst_cat_negocios.data;
        this.loader = false;
        this.loaderInicio = false;
        this.mostrarloaderInicio = false;
        this.negociosIdMapa();
      }
    } else {
      throw throwError('');
    }

    this.obtenerNegociosFav();
  }
  ordenarRandom(listaCat: any[]) {
    let nuevaLista: any[] = [];
    nuevaLista = listaCat.sort(function() { return Math.random() - 0.5; });
    return nuevaLista;
  }

  public getCurrentPosition() {
    const gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
    Geolocation.getCurrentPosition(gpsOptions).then(res => {
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
      header: 'Bituyú',
      message: 'Activa tu ubicación para poder ver los negocios cerca de ti',
      buttons: [
        {
          text: 'Aceptar',
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
      this.obtenerNegocios2([respuesta.data.lst_cat_negocios]);

    } else {
      throw throwError('');
    }
  }

  public async cargarCategorias() {
    const byCategorias = localStorage.getItem('filtroactual');
    this.banderaVerMas == false;
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
    try {
      const respuesta = await this.principalSercicio.obtenerNegocioPorCategoria(this.Filtros, this.siguientePagina);
      if ( respuesta.data.lst_cat_negocios.data.length === 0 ){
        this.subCatBandera = true;
      }
      this.validarResultadosDeCategorias(respuesta);

      const byCategorias2 = localStorage.getItem('filtroactual');
      if (
        byCategorias2 !== null &&
        byCategorias2 !== undefined &&
        byCategorias2 !== '' &&
        byCategorias2.length > 0
      ) {
        this.filtroActivo = true;
      }
      this.loader = false;
    } catch (error) {
      this.loader = false;
      // this.notificaciones.error("Error al buscar los datos" + error.message);
      //this.notificaciones.error('No hay conexión a internet, conectate a una red');
    }
  }

  public async cargarCargarNegociosMapas() {
    this.loader = true;
    try {
      if (this.Filtros.idCategoriaNegocio == null && this.Filtros.abierto == null && this.Filtros.blnEntrega == null
        && this.Filtros.idGiro == null && this.Filtros.intEstado == 0
        && this.Filtros.idLocalidad == null && this.Filtros.idMunicipio == null && this.Filtros.latitud == 0 && this.Filtros.longitud == 0
        && this.Filtros.organizacion == null && this.Filtros.strBuscar == '' && this.Filtros.strMunicipio == ''
        && this.Filtros.tipoBusqueda == 0
      ) {
        this.banderaInicio = true;
        this.loader = true;
        if (!this.isIOS) {
          this.getCurrentPosition();
        }
        const responseNegociosTodos = await this.principalSercicio.obtenerNegociosTodosMapa();
        await this.validarResultadosTodos(responseNegociosTodos);
      } else {
        this.banderaInicio = false;
        this.loader = true;
        const responseNegociosCategorias = await this.principalSercicio.obtenerNegociosTodosFiltroMapa(this.Filtros);
        await this.validarResultadosTodos(responseNegociosCategorias);
      }
      // this.loader = false;
    } catch (error) {
      this.loader = false;
      this.notificaciones.error('No hay conexión a internet, conectate a una red');
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
    const byCategorias = localStorage.getItem('byCategorias');
    const dato = JSON.parse(byCategorias);
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      this.filtroActivo = true;
      this.banderaVerMas = false;
    }
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : '';
    this.loaderNegocios = false;
    const todo = localStorage.getItem('todo');

    if (localStorage.getItem('subCat') || localStorage.getItem('org') != null || todo == 'todo') {
      await this.cargarCategorias();
    }

    const org = localStorage.getItem('org');
    const categorias = localStorage.getItem('byCategorias');
    if (org === null && categorias === null && this.idGiro === null && localStorage.getItem('todo') === null) {
      this.loader = false;
      this.selectionAP = false;
      this.obtenerPrincipalInicio(); // Abre el inicio cuando se abre la app por primera vez
    }

    this.loader = false;
  }

  async configToad(mensaje) {
    const toast = await this.toadController.create({
      color: 'dark',
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
    localStorage.setItem('todo', 'todo');

    if (event === null) {
      localStorage.removeItem('filtroactual');
      this.obtenerPrincipalInicio();
    } else {
      this.buscarNegocios(true);
      this.selectionAP = false;
      this.buscador = true;
    }

  }

  abrirFiltros() {
    this.presentModal();
  }

  async presentModal() {
    const eventEmitter = new EventEmitter();
    eventEmitter.subscribe((res) => {
      this.modal.dismiss({
        dismissed: true,
      });
      let filtroactivo;
      if (res == false) { filtroactivo = false; }
      this.filtroActivo = true;
      this.Filtros = res;
      const d1 = JSON.stringify(res);
      localStorage.setItem('filtroactual', d1);
      localStorage.setItem('FiltroAct', 'true');
      localStorage.setItem('todo', 'todo');
      if (res == false) {
        this.borrarFiltrosP(true);
      } else {
        this.buscarNegocios(true);
      }
    });

    this.modal = await this.modalController.create({
      component: FiltrosBusquedaComponent,
      componentProps: {
        buscarPorFiltros: eventEmitter,
        eliminarPorFiltros: eventEmitter,
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
      cssClass: 'custom-modal-plazas-afiliaciones',
      componentProps: {
        idUsuario: this.persona,
        permisos: this.permisos,
      },
    });

    return await this.modal.present();
  }

  public openEventos() {
    this.ruta.navigate(['/tabs/eventos']);
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
    await this.cargarCargarNegociosMapas();
    // Vuelve a consultar las cordenadas por si las manda en null anteriormente
    if (this.banderaInicio && this.latitud === undefined && this.longitud === undefined) {
      this.latitud = 19.31905;
      this.longitud = -98.19982;
    }

    const modal = await this.modalController.create({
      component: MapaNegociosComponent,
      componentProps: {
        listaIds: this.listaIdsMapa,
        latitud: this.latitud,
        longitud: this.longitud,
        banderaInicio: this.banderaInicio,
      },
    });
    await modal.present();
    this.loader = false;
  }

  public negociosIdMapa() {
    this.banderaVerMas == false;
    const listaIds = [];
    this.listaCategorias.map((l) => {
      l.negocios.map((n) => {
        listaIds.push(n);
      });
    });

    const byCategoria = localStorage.getItem('byCategorias');

    if (byCategoria != null) {
      const categoria = JSON.parse(byCategoria);
      this.Filtros.idCategoriaNegocio = [categoria.id_categoria];
    }

    const idGiro = localStorage.getItem('idGiro');

    if (idGiro != null) {
      const id = JSON.parse(idGiro);
      this.Filtros.idGiro = [id];
    }

    this.listaVerMas = [];
    this.banderaVerMas == false;
    this.consultaTerminada = true;
    if (this.paginaPrevia == undefined) {
      this.loaderTop = false;
    } else {
      this.listaVerMas = [];
      this.banderaVerMas == false;
      this.consultaTerminada = true;
      this.loaderTop = true;
    }
    this.buttonDisabled = false;

  }

  public obtenerNegocios2(listaCategoriasAll: INegocios[]) {
    const listaIds = [];
    listaCategoriasAll.map((l) => {
      listaIds.push(l);
    });

    for (let index = 0; index < listaIds[0].length; index++) {
      this.listaIdsMapa.push(listaIds[0][index].id_negocio);
    }

    this.loader = false;
  }

  public regresarBitoo(activacion) {

    if (localStorage.getItem('FiltroAct')) {
      localStorage.removeItem('filter');
      localStorage.removeItem('categoriaSeleccionada');
      if (activacion) {
        localStorage.removeItem('FiltroAct');
        localStorage.removeItem('filtroactual');
      }
    }

    if (!this.subCAt || !this.afi) {
      if (!localStorage.getItem('FiltroAct')) {
        localStorage.removeItem('todo');
      }
    }
    if (!this.afi) {
      localStorage.removeItem('org');
    }
    localStorage.removeItem('activarTodos');

    this.objectSelectAfiliacionPlaza = null;
    this.borrarFiltros();
    this.borrarFiltrosP(false);
    if (activacion) {
      localStorage.removeItem('afi');
      localStorage.removeItem('FiltroAct');
      location.reload();
    }

  }
  borrarFiltros() {
    this.isLoading = false;
    this.loaderTop = false;
    if (!this.subCAt) {
      localStorage.removeItem('byCategorias');
    }
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    /* this.Filtros.idGiro = this.Filtros.idGiro != null ? this.Filtros.idGiro : [1];*/
    this.filtroActivo = false;
    this.buscarNegocios(true);
  }
  borrarFiltrosP(click) {
    this.subCAt = click == true ? false : true;
    this.loader = true;
    if (!this.subCAt) {
      localStorage.removeItem('byCategorias');
      localStorage.removeItem('filtroactual');
      localStorage.removeItem('FiltroAct');
      localStorage.removeItem('subCat');
    }
    localStorage.removeItem('filtroActivo');
    localStorage.removeItem('idGiro');
    this.idGiro = null;
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.filtroActivo = false;
    if (!this.subCAt || !this.afi) {
      if (!localStorage.getItem('FiltroAct')) {
        localStorage.removeItem('todo');
      }
    }
    const org = localStorage.getItem('org');
    if (org != null) {
      this.activar();
    }

    if (org === null) {
      this.selectionAP = false;
      this.subCatBandera = false;
    }
    this.loaderTop = false;
    this.filtroBusqueda = false;
    this.isLoading = false;
    if (this.objectSelectAfiliacionPlaza !== null && this.objectSelectAfiliacionPlaza !== undefined) {
      localStorage.setItem('activarTodos', 'true');
      localStorage.setItem('todo', 'todo');
      this.loader = true;
      this.activar();
      this.idTodo = false;
    } else {
      this.buscarNegocios(true);
      this.obtenerPrincipalInicio();
    }
  }

  negocioRuta(negocioURL, proveedor) {
    localStorage.setItem('urlNegocio1', negocioURL);
    this.idNegocio = proveedor;
    setTimeout(() => {
      if (negocioURL == '') {
        this.notificaciones.error(
          'Este negocio aún no cumple los requisitos mínimos'
        );
      } else {

        if (this.tFiltro === true) {
          localStorage.setItem('isRedirected', 'false');
          this.ruta.navigate(['/tabs/negocio/' + negocioURL]);


        } else {
          localStorage.setItem('isRedirected', 'true');
          this.ruta.navigate(['/tabs/negocio/' + negocioURL]);
        }

      }
    }, 1000);

  }
  negocioRutaByLogin(url: string) {
    localStorage.setItem('isRedirected', 'false');
    this.ruta.navigate(['/tabs/negocio/' + url]);
  }
  cargarMasPaginas() {
    this.loaderVerMas = true;
    if (this.totalDeNegocios >= this.totalDeNegociosPorConsulta) {
      this.buscarNegocios(false);
      setTimeout(() => {
        this.loaderVerMas = false;

      }, 7000); // es el tiempo que se tarda por cargar, sin tener un lag por las 20 paginas que se consultan
    }
  }

  cargarMasNegocios(event: any) {
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

  public obtenerPrincipalInicio(nombre?: string) {
    this.isLoading = false;
    this.loaderTop = false;
    if (!this.subCAt || !this.afi) {
      if (!localStorage.getItem('FiltroAct')) {
        localStorage.removeItem('todo');
      }
    }
    this.idTodo = false;
    this.loader = true;
    this.loaderInicio = true;
    this.banderaVerMas = false;

    if (nombre === undefined && !this.afi && !localStorage.getItem('subCat')) {
      if (!localStorage.getItem('FiltroAct')) {
        this.principalSercicio.obtenerPrincipalInicio()
          .subscribe(
            (response) => {
              if (response.code === 200) {
                this.listaCategorias = response.data;
                const uno = this.listaCategorias[0].negocios.slice(0, 10);
                const dos = this.listaCategorias[1].negocios.slice(0, 10);
                const tres = this.listaCategorias[2].negocios.slice(0, 10);
                this.obtenerNegociosFav();
                this.banderaVerMas = true;
                this.listaVerMas = [{ nombre: 'Con convenio', negocios: uno }, { nombre: 'Con promociones', negocios: dos }, { nombre: 'Más Vistos', negocios: tres }];
                if (this.listaCategorias[0].negocios.length <= 10) { this.verMasNegociosConBtn = false; }
                if (this.listaCategorias[1].negocios.length <= 10) { this.verMasNegociosPromoBtn = false; }
                if (this.listaCategorias[2].negocios.length <= 10) { this.verMasNegociosVistosBtn = false; }

                if (this.listaVerMas[0].negocios.length <= 10) { this.verMasNegociosCon = false; }
                if (this.listaVerMas[1].negocios.length <= 10) { this.verMasNegociosPromo = false; }
                if (this.listaVerMas[2].negocios.length <= 10) { this.verMasNegociosVistos = false; }

                setTimeout(() => {
                  this.loader = false;
                  this.loaderInicio = false;
                  this.mostrarloaderInicio = false;
                }, 800);
              }
            },
            (error) => {
              this.loader = false;
              this.loaderInicio = false;
              this.mostrarloaderInicio = false;
              // this._notificacionService.error(error);
            }
          );
        return false;
      }
    }
  }

  cargarMasNegociosInicio(nombre) {
    this.indice = nombre === 'Con promociones' ? this.indice = 1 : nombre === 'Con convenio' ? this.indice = 0 : this.indice = 2;
    this.listaCompleta = this.listaCategorias[this.indice];
    const len = this.listaVerMas[this.indice].negocios.length;
    const lenCat = this.listaCategorias[this.indice].negocios.length;
    if (len < lenCat) {

      for (let i = len; i <= lenCat; i++) {
        if (i + 1 <= lenCat) {
          const nuevosDatos = this.listaVerMas[this.indice].negocios.push(this.listaCategorias[this.indice].negocios[i]);
        }
      }
    }

    const dif = this.listaCategorias[this.indice].negocios.length - this.listaVerMas[this.indice].negocios.length;

    if (dif < 4) {

      if (this.listaVerMas[this.indice].negocios.length > 10) {
        this.indice == 0 ? this.verMasNegociosCon = true : this.indice == 1 ? this.verMasNegociosPromo = true : this.verMasNegociosVistos = true;
      }

    }
  }

  cargarMenosNegociosInicio(nombre, ancla) {
    this.indice = nombre === 'Con promociones' ? this.indice = 1 : nombre === 'Con convenio' ? this.indice = 0 : this.indice = 2;
    this.listaVerMas[this.indice].negocios.splice(10, this.listaCategorias[this.indice].negocios.length);

    if (this.listaVerMas[this.indice].negocios.length <= 10) {
      this.indice == 0 ? this.verMasNegociosCon = false : this.indice == 1 ? this.verMasNegociosPromo = false : this.verMasNegociosVistos = false;
    } else {
      this.indice == 0 ? this.verMasNegociosCon = true : this.indice == 1 ? this.verMasNegociosPromo = true : this.verMasNegociosVistos = true;
    }
    if (ancla == 'ancla0') {// Se conservan posiciones estaticas de forma provicional
      this.content.scrollToPoint(0, 330, 500);
    } if (ancla == 'ancla1') {
      this.content.scrollToPoint(0, 1800, 500);
    } if (ancla == 'ancla2') {
      this.content.scrollToPoint(0, 3500, 500);
    }
  }

  obtenerNegociosFav() {
    this.personaServcie.obtenerNegociosFavoritos(this.user.id_persona).subscribe(r => {
      if (r.code == 200) {
        const favoritos = r.data;

        for (const categoria of this.listaCategorias) {
          for (const nego of categoria.negocios) {
            for (const fav of favoritos) {
              if (nego.id_negocio == fav.id_negocio) {
                nego.usuario_like = 1;
              }
            }
          }
        }
      }

    });


  }

  public obtenergiros() {
    this.principalSercicio.obtenerGiros().subscribe(
      response => {
        this.lstCatTipoGiro = response.data;
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
  async buscarByGiro(event) {
    this.primeraPagRandom = 0;
    this.paginaPrevia = 0;
    this.totalDeNegocios = 0;
    this.totalPaginas = 0;
    localStorage.removeItem('activarTodos');
    localStorage.setItem('todo', 'todo');
    this.idTodo = false;
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.filtroActivo = true;
    this.banderaVerMas = false;
    this.loaderNegocios = true;
    this.filtroBusqueda = true;
    this.idGiro = event;
    this.obtenerCategorias(this.idGiro);
    localStorage.setItem('idGiro', JSON.stringify(this.idGiro));
    this.Filtros.idGiro = [this.idGiro];
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : '';
    const d1 = JSON.stringify(this.Filtros);
    localStorage.setItem('filtroactual', d1);

    const noPaginas = await this.principalSercicio.obtenerNumeroPaginas(this.Filtros, 1);
    const rand = this.random(1, JSON.stringify(noPaginas.data.last_page));
    this.totalPaginas = Math.ceil((this.totalDeNegocios / 20));
    this.primeraPagRandom = rand;
    this.paginaPivote = rand;
    this.paginaPrevia = this.paginaPivote;
    const respuesta = await this.principalSercicio
      .obtenerNegocioPorCategoria(this.Filtros, 1); // rand this.siguienteGiro);
    this.paginacion = [];
    this.pagSelect = respuesta.data.lst_cat_negocios.current_page;
    this.lastPage = respuesta.data.lst_cat_negocios.last_page;
    this.variablePrueba = true;
    this.generarPaginacion(respuesta);
    this.listaCategorias = [];
    if (respuesta.data.lst_cat_negocios.total > 0) {
      this.validarResultadosDeCategoriaSeleccionada(respuesta.data, false);
    } else {
      this.listaCategorias = [];
      this.selectionAP = true;
    }
    this.loaderNegocios = false;

  }

  async activar() {
    this.filtroBusqueda = false;
    this.banderaVerMas == false;
    this.listaCategorias = [];
    this.primeraPagRandom = 0;
    this.paginaPrevia = 0;
    localStorage.removeItem('filtroactual');
    localStorage.removeItem('byCategorias');
    localStorage.removeItem('filtroActivo');
    localStorage.removeItem('idGiro');
    localStorage.setItem('activarTodos', 'true');
    this.idTodo = true;
    this.loader = true;
    this.idGiro = null;
    this.filtroActivo = false;
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : '';
    localStorage.setItem('todo', 'todo');
    const noPaginas = await this.principalSercicio.obtenerNumeroPaginas(this.Filtros, 1);
    const rand = this.random(1, noPaginas.data.last_page);
    this.primeraPagRandom = rand;
    this.paginaPivote = rand;
    this.paginaPrevia = this.paginaPivote;
    const respuesta = await this.principalSercicio
      .obtenerNegocioPorCategoria(this.Filtros, rand); // this.siguienteGiro)
    this.paginacion = [];
    this.pagSelect = respuesta.data.lst_cat_negocios.last_page <= 1 ? 1 : respuesta.data.lst_cat_negocios.current_page;
    this.variablePrueba = true;
    this.generarPaginacion(respuesta);
    this.validarResultadosDeCategorias(await respuesta);
    this.loader = false;
    this.content.scrollToPoint(0, 20);
    // this.scrollToTop();
  }

  // ####### PARA CATEGORÍA SELECCIONADA SE AHISLAN METODOS PARA MOSTRAR NEGOCIOS ALEATORIOS###########
  public random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }
  async validarResultadosDeCategoriaSeleccionada(respuesta: any, buscaArriba: boolean) {
    const cantidadDeResultados = respuesta.lst_cat_negocios.data.length;
    if (cantidadDeResultados < 0) {
      this.listaCategorias = [];
      this.selectionAP = true;
    }
    if (cantidadDeResultados > 0) {
      if (buscaArriba == true) {
        this.listaCategorias = []
        this.listaCategorias.unshift(...respuesta.lst_cat_negocios.data);
        this.negociosIdMapa();
        this.isLoading = false;
      } else {
        this.actualPagina = respuesta.lst_cat_negocios.current_page;
        this.siguientePagina = this.actualPagina + 1;
        this.totalDeNegocios = respuesta.lst_cat_negocios.total;
        this.totalDeNegociosPorConsulta = respuesta.lst_cat_negocios.to;
        this.categoriasEstaVacios = false;
        this.lengthLista = this.listaCategorias.length;

        if (this.actualPagina >= this.primeraPagRandom || this.actualGiro > 1) {
          this.listaCategorias.push(...respuesta.lst_cat_negocios.data);
          this.negociosIdMapa();
        } else {
          this.listaCategorias = respuesta.lst_cat_negocios.data;
          this.negociosIdMapa();
        }
      }
    } else {
      throw throwError('');
    }
  }

  cambiarPag(tipo){
    let paginaActual = this.pagSelect;
    this.paginaPrevia = tipo == 1 ? paginaActual-- : paginaActual;
    this.paginaPrevia = tipo == 2 ? paginaActual + 1 : paginaActual;
    if (this.paginaPrevia >= 1 && this.paginaPrevia <= this.lastPage){
      this.pagBoton = true;
      this.pagSelect = this.paginaPrevia;
      this.cargarMasPaginasArriba(null);
    }else{
      const texto = this.paginaPrevia == 0 ? 'Estas en la primera pagina' : 'Estas en la ultima pagina';

      this.paginaPrevia = this.paginaPrevia == 0 ? this.paginaPrevia + 1 : this.paginaPrevia - 1;

      this.notificaciones.toastInfo(texto);
    }
  }

  cargarMasPaginasArriba(event) {// Bloquear boton
    this.isLoading = true;
    this.paginaPrevia = !this.pagBoton ? event.detail.value : this.paginaPrevia;
    this.buttonDisabled = true;
    if (this.totalDeNegociosPorConsulta > 20  || this.paginaPrevia) {
      this.buscarNegociosArriba(true);
    }
  }
  public async buscarNegociosArriba(seMuestraElLoader: boolean) {
    this.loader = seMuestraElLoader;
    this.listaIdsMapa = [];

    const usr = this.user;
    if (usr.id_persona !== undefined) {
      this.Filtros.id_persona = usr.id_persona;
    }
    const byCategorias = localStorage.getItem('byCategorias');
    const dato = JSON.parse(byCategorias);
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      this.Filtros.idCategoriaNegocio = [dato.id_categoria];
      this.filtroActivo = true;
      this.banderaVerMas = false;
    }
    this.selectionAP
      ? (this.Filtros.organizacion =
        this.objectSelectAfiliacionPlaza.id_organizacion)
      : '';
    this.loaderNegocios = false;
    const todo = localStorage.getItem('todo');

    if (todo === 'todo' || localStorage.getItem('org') != null) {
      await this.cargarCategoriasArriba();
    }

    const org = localStorage.getItem('org');
    const categorias = localStorage.getItem('byCategorias');

    if (org === null && categorias === null && this.idGiro === null && localStorage.getItem('todo') === null) {
      this.loader = false;
      this.selectionAP = false;
      this.obtenerPrincipalInicio();
    }

    this.loader = false;

  }
  public async cargarCategoriasArriba() {
    this.pagBoton = false;
    const byCategorias = localStorage.getItem('filtroactual');
    if (
      byCategorias !== null &&
      byCategorias !== undefined &&
      byCategorias !== '' &&
      byCategorias.length > 0
    ) {
      const dato = JSON.parse(byCategorias);
      this.Filtros = dato;
      this.filtroActivo = true;
    }
    try {
      const respuesta = await this.principalSercicio.obtenerNegocioPorCategoria(this.Filtros, this.paginaPrevia);
      this.validarResultadosDeCategoriaSeleccionada(respuesta.data, true);
      const byCategorias2 = localStorage.getItem('filtroactual');
      if (
        byCategorias2 !== null &&
        byCategorias2 !== undefined &&
        byCategorias2 !== '' &&
        byCategorias2.length > 0
      ) {
        this.filtroActivo = true;
      }
      this.loader = false;
    } catch (error) {
      this.loader = false;
      this.notificaciones.error('No hay conexión a internet, conectate a una red');
    }
  }

  generarPaginacion(respuesta){
    this.paginacion = Array.from({length: respuesta.data.lst_cat_negocios.last_page}, (_, index) => index + 1);
  }

  clickDistintivo(tag: string, object: string) {
    this.showPopUp = true;
    this.insigniaTitle = tag;
    this.insigniaDescrip = object;
  }
  closePopUp() {
    this.showPopUp = false;
  }

  abrirAlert(isAlert: boolean){
    this.isAlert = isAlert;
    this.loaderTop = false;
  }

  cerrarAlert(isAlert: boolean){
    this.isAlert = isAlert;
    const idGiro = localStorage.getItem('idGiro');
    const todo = localStorage.getItem('todo');
    if ( idGiro !== null){
      this.loaderTop = true;
    } else if ( todo !== null ){
      this.loaderTop = true;
    }
  }

  obtenerCategorias(giro) {
    this.busquedaService.obtenerCategoriasGiros(giro).subscribe((response) => {
          this.listaCtgs = response.data;
        },
        (error) => {
          alert(error);
        }
    );
  }
}

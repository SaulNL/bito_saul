import { Component, OnInit, ViewChild } from '@angular/core';
import { BusquedaService } from '../../api/busqueda.service';
import { Router } from '@angular/router';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { HostListener } from '@angular/core';
import { IonContent, NavController, Platform } from '@ionic/angular';
import { SideBarService } from '../../api/busqueda/side-bar-service';
import { LOCAL_STORAGE_KEY } from '../../utils/localStorageKey';
import { IPaginacion } from '../../interfaces/IPaginacion';
import { PaginacionUtils } from '../../utils/paginacion-util';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { AfiliacionPlazaModel } from '../../Modelos/AfiliacionPlazaModel';
import { throwError } from 'rxjs';
import { PersonaService } from '../../api/persona.service';
import { UtilsCls } from '../../utils/UtilsCls';
@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.page.html",
  styleUrls: ["./categorias.page.scss"],
  providers: [SideBarService],
})
export class CategoriasPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public paginacion: IPaginacion = {
    actualPagina: 1,
    siguientePagina: 1,
    mensaje: '',
  };
  public user: any;
  public nombreseleccion: string;
  public buttonDisabled: boolean;
  public consultaTerminada: boolean = true;
  public objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public loader: any;
  public listaIdsMapa: any;
  public actualPagina = 0;
  public categoriasEstaVacios = true;
  public lengthLista: number;
  public actualGiro = 0;
  public siguientePagina = this.actualPagina + 1;
  public siguienteGiro = this.actualGiro + 1;
  public loaderTop = false;
  public isLoading = false;
  public selectionAP = false;
  public filtroActivo: boolean;
  public totalPaginas: number;
  public totalDeNegocios = 0;
  public banderaVerMas = false;
  public listaVerMas: any[] = [];
  public loaderNegocios: any;
  public paginaPivote: number;
  public primeraPagRandom: number;
  public paginaPrevia: number;
  public idTodo: boolean;
  public idGiro: number = null;
  public lstCatTipoGiro: any;
  public listaCategorias: Array<any>;
  public listaCategoriasMostrar: Array<any>;
  public Filtros: FiltrosModel;
  public imgMobil: boolean;
  public isIOS: boolean = false;
  public filtros: boolean;
  public totalDeNegociosPorConsulta = 0;
  constructor(
    private busquedaService: BusquedaService,
    private sideBarService: SideBarService,
    private platform: Platform,
    private router: Router,
    private util: UtilsCls,
    private principalSercicio: BusquedaService,
    private notificaciones: ToadNotificacionService,
    private personaServcie: PersonaService,
  ) {
    this.Filtros = new FiltrosModel();
    this.Filtros.idEstado = 29;
    this.isIOS = this.platform.is('ios');
    this.listaCategorias = new Array<any>();
    this.listaCategoriasMostrar = new Array<any>();
    this.filtroActivo = true;
    this.user = this.util.getUserData();
    this.filtros = false;
    this.nombreseleccion = '';
  }

  ngOnInit() {
    this.obtenergiros();
    if (localStorage.getItem('isRedirected') === 'false' && !this.isIOS) {
      localStorage.setItem('isRedirected', 'true');
      location.reload();
    }
    if (localStorage.getItem('activarTodos') === 'true') {
      this.banderaVerMas = false;
      this.idTodo = true;
      console.log(1, this.idTodo)
    } else {
      this.idTodo = false;
      console.log(2, this.idTodo)
    }
    this.obtenerCategorias(null);
    if (window.innerWidth <= 768) {
      this.imgMobil = true;
    } else {
      this.imgMobil = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 768) {
      this.imgMobil = true;
    } else {
      this.imgMobil = false;
    }
  }

  obtenerCategorias(giro) {
    console.log("paginacion", this.paginacion)
    this.busquedaService.obtenerCategoriasGiros(giro).subscribe((response) => {
      this.listaCategorias = response.data
      console.log("lista:", this.listaCategorias)
      // this.listaCategorias.push(...response.data.data);
      // this.listaCategoriasMostrar.push(...response.data.data);
      // this.paginacion = PaginacionUtils.establecerDatosDePaginacion(
      //   response.data
      // );
    },
      (error) => {
        alert(error);
      }
    );
  }

  seleccionarCategoria(subCategoria) {
    localStorage.setItem('todo', 'todo');
    localStorage.removeItem('byCategorias');
    localStorage.setItem('byCategorias', JSON.stringify(subCategoria));
    localStorage.setItem('seleccionado', JSON.stringify(subCategoria));
    let seleccionado2 = localStorage.setItem(
      'seleccionado',
      JSON.stringify(subCategoria)
    );
    localStorage.setItem(LOCAL_STORAGE_KEY.CATEGORIA_SELECCIONADA, 'true');
    localStorage.removeItem('busqueda');
    localStorage.setItem('filter', 'true');
    this.router.navigate(['/tabs/inicio']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cargarMasPaginas(evento: any) {
    if (
      this.paginacion.totalDePaginasPorConsulta < this.paginacion.totalDePaginas
    ) {
      // this.obtenerCategorias();
      setTimeout(() => {
        evento.target.complete();
      }, 800);
    } else {
      evento.target.disabled = true;
    }
  }

  public obtenergiros() {
    this.principalSercicio.obtenerGiros().subscribe(response => {
      console.log(response)
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

  async buscarByGiro(nombre, giro) {
    console.log(nombre, giro)
    this.idTodo = giro == null ? true : false;
    console.log(3, this.idTodo)
    this.obtenerCategorias(giro)
    this.filtros = true;
    this.nombreseleccion = nombre;
    // this.idTodo = true;
    this.idGiro = giro;
  }

  async activar() {
    this.filtros = false;
    this.nombreseleccion = '';
    this.idGiro = 0;
    this.idTodo = false;
    console.log(4, this.idTodo)
  }


}

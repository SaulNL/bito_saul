import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService } from 'src/app/api/pedidos.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import {Auth0Service} from '../../api/busqueda/auth0.service';
import {NavBarServiceService} from '../../api/busqueda/nav-bar-service.service';
import {SideBarService} from '../../api/busqueda/side-bar-service';

@Component({
  selector: 'app-toolbar-busqueda',
  templateUrl: './toolbar-busqueda.component.html',
  styleUrls: ['./toolbar-busqueda.component.scss'],
})
export class ToolbarBusquedaComponent implements OnInit {
  @Input() public placeHolder: string = 'Buscar'
  @Output() public buscarEmit = new EventEmitter()
  strBuscar: String;
  public user: any;
  public permisos: Array<string>;
  public totalNoVistos: number;

  constructor(
    private router: Router,
    private _auth0: Auth0Service,
    private navBarServiceService: NavBarServiceService,
    private sideBarService: SideBarService,
    private pedidosServicios: PedidosService,
    private _utils_cls: UtilsCls,
    private active: ActivatedRoute
  ) {
    this.totalNoVistos = 0;
    this.permisos = [];
    this.permisosList();
  }

  ngOnInit() {
    if (this.permisos.includes('ver_negocio')) {
      this.notificacionesVentas();
      setInterval(it => {
        this.notificacionesVentas();
      }, 300000);
    }
    this.active.queryParams.subscribe(params => {
      this.permisosList();
      this.user = this._auth0.getUserData();
      if (params && params.special) {
        if (params.special){
          if (this.permisos.includes('ver_negocio')){
            this.notificacionesVentas();
          }
        }
      }
    });
  }

  buscar() {
    this.buscarEmit.emit(this.strBuscar);
  }

  searchItems(event){
    if (event && event.key === 'Enter'){
      this.buscar();
    }
  }

  limpiar() {
    this.strBuscar = null;
    this.buscar();
  }

  private permisosList() {
    const permisos = JSON.parse(localStorage.getItem('u_permisos'));
    const list = [];
    if (permisos != null) {
      permisos.map(p => {
        list.push(p.nombre);
      });
      this.permisos = list;
    }
  }
  notificacionesVentas() {
    const id = this._utils_cls.getIdProveedor();
    this.pedidosServicios.noVistos(id).subscribe(
      res => {
        this.totalNoVistos = res.data;
      },
      error => {
      });
  }

  verSolicitudes(){
    localStorage.setItem('isRedirected', 'false');
    this.router.navigate(['/tabs/categorias']);
  }
}

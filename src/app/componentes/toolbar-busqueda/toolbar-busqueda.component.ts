import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(
    private _auth0: Auth0Service,
    private navBarServiceService: NavBarServiceService,
    private sideBarService: SideBarService
  ) { 
    this.permisos = [];
    this.permisosList();
  }

  ngOnInit() {
    if (this.permisos.includes('ver_negocio')) {
      //this.notificacionesVentas();
      setInterval(it => {
        //this.notificacionesVentas();
      }, 300000);
    }
    this.user = this._auth0.getUserData();
    this.navBarServiceService.change.subscribe(respuesta => {
      this.user = respuesta;
      this.permisos = ['ver_negocio'];
    });

    /* this.sideBarService.change.subscribe(isOpen => {
      this.permisosList();
    }); */
    console.log(this.user.nombre);
    
  }

  buscar() {
    console.log(this.strBuscar)
    this.buscarEmit.emit(this.strBuscar);
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
}

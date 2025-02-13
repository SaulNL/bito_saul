import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../api/solicitudes.service';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';

@Component({
  selector: 'app-admin-solicitudes-publicadas',
  templateUrl: './admin-solicitudes-publicadas.page.html',
  styleUrls: ['./admin-solicitudes-publicadas.page.scss'],
})
export class AdminSolicitudesPublicadasPage implements OnInit {
  public usuario: any;
  public id_proveedor: any;
  public id_persona: any;
  public lstSolicitudesPublicadas: Array<SolicitudesModel>;
  public lstSolicitudesPublicadasBK: Array<SolicitudesModel>;
  public seleccionTO: SolicitudesModel;
  public filtro: any;
  public solicitud: SolicitudesModel;
  public numeroPublicadas: number;
  public loader: any;
  public msj = 'Cargando';
  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public notificaciones: ToadNotificacionService
  ) { }

  ngOnInit() {
    this.seleccionTO = new SolicitudesModel();
    this.solicitud = new SolicitudesModel();
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.id_persona = this.usuario.id_persona;
    this.obtenerSolcitudesPublicadas();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.obtenerSolcitudesPublicadas();
        }
      }
    });
  }
  public obtenerSolcitudesPublicadas() {
    this.loader = true;
    this.seleccionTO.id_proveedor = this.id_proveedor;
    this.seleccionTO.id_persona = this.id_persona;
    this.solicitudesService.obtenerSolcitudesPublicadas(this.seleccionTO).subscribe(response => {
      this.lstSolicitudesPublicadas = response.data;
      this.numeroPublicadas = this.lstSolicitudesPublicadas.length;
      this.lstSolicitudesPublicadasBK = response.data;
      this.loader = false;
    },
      error => {
        this.loader = false;
             this.notificaciones.error(error);
      });
  }
  btnBuscar(e) {
    this.loader = true;
    this.msj = 'Buscando';
    this.filtro = e.target.value;
    this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadasBK;
    this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadas.filter(element => {
      return element.solicitud.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1
        || element.descripcion.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1;
    });
    this.loader = false;
  }
  selecAdminPublicada(solicitud: any) {
    this.solicitud = JSON.parse(JSON.stringify(solicitud));
    let navigationExtras = JSON.stringify(this.solicitud);
    this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud'], { queryParams: { special: navigationExtras } });
  }
}

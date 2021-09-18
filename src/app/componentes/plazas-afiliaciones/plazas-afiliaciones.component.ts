import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { ValidarPermisoService } from './../../api/validar-permiso.service';
import { PermisoModel } from './../../Modelos/PermisoModel';
import { AfiliacionPlazaModel } from './../../Modelos/AfiliacionPlazaModel';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { GeneralServicesService } from 'src/app/api/general-services.service';

@Component({
  selector: 'app-plazas-afiliaciones',
  templateUrl: './plazas-afiliaciones.component.html',
  styleUrls: ['./plazas-afiliaciones.component.scss'],
})
export class PlazasAfiliacionesComponent implements OnInit {
  @Input() idUsuario: number | null;
  @Input() permisos: Array<PermisoModel> | null;
  public loaderPlz: boolean;
  public loaderOrg: boolean;
  public listAfiliacines: Array<AfiliacionPlazaModel>;
  public listPlazas: Array<AfiliacionPlazaModel>;
  public existOrg: boolean;
  public existPlz: boolean;
  public showHidenPlaza: boolean;
  public showHidenAfiliacion: boolean;
  public afiliacion: boolean;
  constructor(
    private modalCtr: ModalController,
    private validarPermiso: ValidarPermisoService,
    private generalService: GeneralServicesService,
    private notificaciones: ToadNotificacionService
  ) {
    this.showHidenPlaza = false;
    this.showHidenAfiliacion = false;
    this.loaderOrg = true;
    this.loaderPlz = true;
    this.existOrg = false;
    this.existPlz = false;
    this.afiliacion = false;
  }

  ngOnInit() {
    if (this.idUsuario != null && this.idUsuario > 0) {
      this.afiliacion = this.validarPermiso.isChecked(this.permisos, 'ver_afiliacion')
      this.obtenerOrganizacion(this.idUsuario);
    }
    this.obtenerPlazas();
  }

  public cerrarModal() {
    this.modalCtr.dismiss();
  }

  public shPlaza(change: boolean) {
    this.showHidenPlaza = !change;
  }
  public shAfiliacion(change: boolean) {
    this.showHidenAfiliacion = !change;
  }
  public selectOption(selected: AfiliacionPlazaModel) {
    const existSelection = localStorage.getItem('org');
    (existSelection) ? localStorage.removeItem('org') : '';
    localStorage.setItem('org', JSON.stringify(selected));
    location.reload();
  }

  public obtenerOrganizacion(idUsuario: number) {
    this.loaderOrg = false;
    this.generalService.obtenerOrganizacionesPorUsuario(idUsuario).subscribe(
      response => {
        if (response.code === 200 && response.data.length > 0) {
          this.loaderOrg = true;
          this.listAfiliacines = response.data;
        }
      },
      error => {
        this.notificaciones.error(error);
        this.loaderOrg = true;
      }
    )
  }
  public obtenerPlazas() {
    this.loaderPlz = false;
    this.generalService.obtenerPlazas().subscribe(
      response => {
        if (response.code === 200 && response.data.length > 0) {
          this.loaderPlz = true;
          this.listPlazas = response.data;
        }
      }, error => {
        this.notificaciones.error(error);
        this.loaderPlz = true;
      }
    );
  }
}

import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { ValidarPermisoService } from './../../api/validar-permiso.service';
import { PermisoModel } from './../../Modelos/PermisoModel';
import { AfiliacionPlazaModel } from './../../Modelos/AfiliacionPlazaModel';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { GeneralServicesService } from 'src/app/api/general-services.service';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { NegocioModel } from 'src/app/Modelos/NegocioModel';
import { Router } from '@angular/router';

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
  public loaderVip: boolean;
  public listAfiliacines: Array<AfiliacionPlazaModel>;
  public listPlazas: Array<AfiliacionPlazaModel>;
  public listNegociosVip: Array<NegocioModel>;
  public existOrg: boolean;
  public existPlz: boolean;
  public existVip: boolean;
  public showHidenPlaza: boolean;
  public showHidenAfiliacion: boolean;
  public showHidenVip: boolean;
  public afiliacion: boolean;
  public plaza: boolean;
  public vip: boolean;
  idProvedor: number = null;
  listConvenios: AfiliacionPlazaModel[];
  public selectAflPlz: boolean;
  public selectIdAflPlz: number;
  public selectVip: number;

  constructor(
    private modalCtr: ModalController,
    private router: Router,
    private validarPermiso: ValidarPermisoService,
    private generalService: GeneralServicesService,
    private notificaciones: ToadNotificacionService
  ) {
    this.showHidenPlaza = false;
    this.showHidenAfiliacion = false;
    this.showHidenVip = false;
    this.loaderOrg = true;
    this.loaderPlz = true;
    this.loaderVip = true;
    this.existOrg = false;
    this.existPlz = false;
    this.existVip = false;
    this.afiliacion = true;
    this.plaza = false;
    this.vip = false;
    this.selectAflPlz = false;
    this.selectIdAflPlz = null;
    this.selectVip = null;
  }

  ngOnInit() {
    // if (this.idUsuario != null && this.idUsuario > 0) {
    //   this.afiliacion = this.validarPermiso.isChecked(this.permisos, 'ver_afiliacion')
    //   this.obtenerOrganizacion();
    // }
    this.obtenerNegociosVip()
    this.obtenerPlazas();
    if (this.idUsuario != null) {
      this.obtenerOrganizacion();
    }
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
  public shVip(change: boolean) {
    this.showHidenVip = !change;
  }
  public selectOption(selected: AfiliacionPlazaModel) {
    localStorage.setItem('afi', 'afi');
    this.selectAflPlz = true;
    this.selectIdAflPlz = selected.id_organizacion;
    const existSelection = localStorage.getItem('org');
    (existSelection) ? localStorage.removeItem('org') : '';
    localStorage.setItem('org', JSON.stringify(selected));
    localStorage.setItem("todo", "todo");
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  public selectOptionVip(selected2: NegocioModel) {

    this.selectVip = selected2.url_negocio;

    const existSelection = localStorage.getItem('vip');
    (existSelection) ? localStorage.removeItem('vip') : '';
    localStorage.setItem('vip', JSON.stringify(selected2));
    if (this.selectVip != null) {
      var promo = this.selectVip;
      this.router.navigate(['/tabs/negocio/' + this.selectVip], {
        queryParams: { route: true, clickBanner: true, promo: promo }
      });
    }

    setTimeout(() => {
      this.modalCtr.dismiss();
    }, 500);

  }

  public obtenerOrganizacion() {
    this.loaderOrg = false;
    const user = JSON.parse(localStorage.getItem('u_data'));
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    this.idUsuario = usuario_sistema.id_usuario_sistema

    if (user.proveedor != null) {
      this.idProvedor = user.proveedor.id_proveedor;
    }

    this.generalService.obtenerOrganizaciones(this.idUsuario, this.idProvedor)
      .subscribe(
        response => {
          if (response.code === 200) {

            this.listAfiliacines = response.data;

            this.listConvenios = response.convenios;

            if (this.listConvenios.length < 0) {
              this.listConvenios = [];
            }
            this.listAfiliacines = this.listAfiliacines.concat(this.listConvenios);
            var hash = {};
            this.listAfiliacines = this.listAfiliacines.filter(function (current) {
              var exists = !hash[current.id_organizacion];
              hash[current.id_organizacion] = true;
              return exists;
            });

          } else {
            this.afiliacion = false;
          }
          this.loaderOrg = true;
        },
        error => {
          this.notificaciones.error(error);
          this.loaderOrg = true;
        }
      )
  }

  public obtenerPlazas() {
    this.plaza = true;
    this.loaderPlz = false;
    this.generalService.obtenerPlazas().subscribe(
      response => {
        if (response.code === 200 && response.data.length > 0) {
          this.listPlazas = response.data;
        } else {
          this.plaza = false;
        }
        this.loaderPlz = true;
      }, error => {
        this.notificaciones.error(error);
        this.loaderPlz = true;
      }
    );
  }

  public obtenerNegociosVip() {
    this.vip = true;
    this.loaderVip = false;
    this.generalService.obtenerPrincipalVip().subscribe(
      response => {
        if (response.code === 200) {
          this.listNegociosVip = response.data.lst_cat_negocios;
          console.log("NEGOCIOS VIP: " + JSON.stringify(this.listNegociosVip));

        } else {
          this.vip = false;
        }
        this.loaderVip = true;
      }, error => {
        this.notificaciones.error(error);
        this.loaderVip = true;
      }
    );
  }
}

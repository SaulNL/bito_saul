import { Component, OnInit } from '@angular/core';
import { MsPersonaModel } from '../../Modelos/MsPersonaModel';
import { GeneralServicesService } from '../../api/general-services.service';
import { PersonaService } from '../../api/persona.service';
import { UtilsCls } from "../../utils/UtilsCls";
import { CatEstadoModel } from "../../Modelos/catalogos/CatEstadoModel";
import { CatMunicipioModel } from "../../Modelos/catalogos/CatMunicipioModel";
import { CatLocalidadModel } from "../../Modelos/catalogos/CatLocalidadModel";
import { DetDomicilioModel } from "../../Modelos/DetDomicilioModel";
import { SessionUtil } from "../../utils/sessionUtil";
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-datos-complementarios',
  templateUrl: './datos-complementarios.page.html',
  styleUrls: ['./datos-complementarios.page.scss'],
  providers: [
    UtilsCls,
    SessionUtil
  ]
})
export class DatosComplementariosPage implements OnInit {
  proveedorTO: MsPersonaModel;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  primeraVez: boolean;
  public blnBuscadoMunicipios: boolean;
  select_estado = false;
  public select_municipio: boolean;
  public blnBuscadoLocalidades: boolean;
  public sexos = [
    { id: 1, sexo: 'Hombre' },
    { id: 2, sexo: 'Mujer' },
  ];
  public loader: any;
  private file_img_galeria: FileList;
  public nombreArchivo: string;
  public nombreArchivo2: string;
  public estaAux: any;
  public muniAux: any;
  public locaAux: any;
  constructor(
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    private servicioPersona: PersonaService,
    private sesionUtl: SessionUtil,
    public loadingController: LoadingController,
    private notificaciones: ToadNotificacionService,
    private router: Router
  ) {
    this.proveedorTO = JSON.parse(localStorage.getItem('u_data'));
    this.proveedorTO.det_domicilio = JSON.parse(localStorage.getItem('u_data')).domicilio !== null ? JSON.parse(localStorage.getItem('u_data')).domicilio : new DetDomicilioModel();
    this.list_cat_estado = [];
    this.list_cat_municipio = [];
    this.list_cat_localidad = [];
    this.select_estado = false;
    this.select_municipio = false;
    this.nombreArchivo = '';
    this.nombreArchivo2 = '';
  }

  ngOnInit() {
    this.primeraVez = true;
    this.load_cat_estados();
    if (this.proveedorTO.det_domicilio.id_estado !== null && this.proveedorTO.det_domicilio.id_estado !== undefined) {
      this.get_list_cat_municipio({ value: this.proveedorTO.det_domicilio.id_estado });
    }
    if (this.proveedorTO.det_domicilio.id_municipio !== null && this.proveedorTO.det_domicilio.id_municipio !== undefined) {
      this.get_list_cat_localidad({ value: this.proveedorTO.det_domicilio.id_municipio });
    }
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          this.list_cat_estado.forEach(element => {
            if (element.id_estado==this.proveedorTO.det_domicilio.id_estado) {
              this.estaAux = element.nombre;
              
            }
          });
        }
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  public get_list_cat_municipio(event, reset: boolean = false) {
    let idE;
    if (event !== undefined) {
      this.blnBuscadoMunicipios = true;
      if (!this.primeraVez) {
        this.select_estado = false;
        this.select_municipio = false;
        this.list_cat_municipio = [];
        this.proveedorTO.det_domicilio.id_municipio = undefined;
        this.proveedorTO.det_domicilio.id_localidad = undefined;
      }
      if (event.type === 'ionChange') {
        idE = event.detail.value;
      } else {
        idE = event.value;
      }
      this.select_estado = false;
      this.select_municipio = false;
      this._general_service.getMunicipios(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_municipio = response.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio==this.proveedorTO.det_domicilio.id_municipio) {
                this.muniAux = element.nombre;
                
              }
            });
            this.select_estado = true;
            this.blnBuscadoMunicipios = false;
          }
        },
        error => {
          this.notificaciones.error(error);
          this.blnBuscadoMunicipios = false;
        }
      );
    } else {
      this.select_estado = false;
      this.select_municipio = false;
      this.list_cat_municipio = [];
      this.proveedorTO.det_domicilio.id_municipio = undefined;
      this.proveedorTO.det_domicilio.id_localidad = undefined;
    }
  }
  public get_list_cat_localidad(event, reset: boolean = false) {
    let id;
    if (event !== undefined) {
      this.blnBuscadoLocalidades = true;
      if (!this.primeraVez) {
        this.select_municipio = false;
        this.proveedorTO.det_domicilio.id_localidad = undefined;
        this.list_cat_localidad = [];
      }
      if (event.type === 'ionChange') {
        id = event.detail.value;
      } else {
        id = event.value;
      }
      this.select_municipio = false;
      this._general_service.getLocalidad(id).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_localidad = response.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad==this.proveedorTO.det_domicilio.id_localidad) {
                this.locaAux = element.nombre;
                
              }
            });
            this.select_municipio = true;
            this.primeraVez = false;
            this.blnBuscadoLocalidades = false;
          }
        },
        error => {
          this.notificaciones.error(error);
          this.primeraVez = false;
          this.blnBuscadoLocalidades = false;
        }
      );
    } else {
      this.select_municipio = false;
      this.proveedorTO.det_domicilio.id_localidad = undefined;
      this.list_cat_localidad = [];
    }
  }
  actualizarDatos(formBasicos: NgForm) {
    this.presentLoading();
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.proveedorTO).subscribe(
        data => {
          if (data.code === 200) {
            this.loader.dismiss();
            this.router.navigate(['/tabs/home/perfil']);
            this.notificaciones.exito('Los datos se actualizaron');
            const resultado = this.sesionUtl.actualizarSesion();
            resolve(resultado);
          }
          if (data.code === 402) {
            this.notificaciones.alerta(data.message);
            const resultado = this.sesionUtl.actualizarSesion();
            this.router.navigate(['/tabs/home/perfil']);
            this.loader.dismiss();
            resolve(resultado);
          }
          this.loader.dismiss();
        },
        error => {
          this.notificaciones.error(error);
          this.loader.dismiss();
        });
    });
    miPrimeraPromise.then((successMessage) => {

    });
  }
  public subirArchivo(event, tipo: number) {
    this.file_img_galeria = event.target.files;
    const file_name = this.file_img_galeria[0].name;
    const file = this.file_img_galeria[0];
    let file_64: any;
    const utl = new UtilsCls();
    utl.getBase64(file).then(
      data => {
        file_64 = data;
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
        archivo.archivo_64 = file_64;
        switch (tipo) {
          case 1:
            this.proveedorTO.ine1 = archivo;
            break;
          case 2:
            this.proveedorTO.ine2 = archivo;
            break;
        }
      }
    );
  }
}

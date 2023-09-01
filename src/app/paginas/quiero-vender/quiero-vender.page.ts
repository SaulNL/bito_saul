import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsCls } from '../../utils/UtilsCls';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { MsPersonaModel } from '../../Modelos/MsPersonaModel';
import { DetDomicilioModel } from '../../Modelos/DetDomicilioModel';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from '../../components/recorte-imagen/recorte-imagen.component';
import { CatEstadoModel } from '../../Modelos/CatEstadoModel';
import { GeneralServicesService } from '../../api/general-services.service';
import { CatMunicipioModel } from '../../Modelos/CatMunicipioModel';
import { CatLocalidadModel } from '../../Modelos/CatLocalidadModel';
import { PersonaService } from '../../api/persona.service';
import { Router } from '@angular/router';
import { SessionUtil } from '../../utils/sessionUtil';
import { LoadingController } from '@ionic/angular';
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-quiero-vender',
  templateUrl: './quiero-vender.page.html',
  styleUrls: ['./quiero-vender.page.scss'],
  providers: [
    UtilsCls,
    SessionUtil
  ]
})
export class QuieroVenderPage implements OnInit {

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public loader: boolean;
  public actualTO: any;
  public procesando_img: boolean;
  public proveedorTO: MsPersonaModel;
  public imageChangedEvent: any = '';
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public hImagen: boolean = false;
  public fechas: string = '';
  public file_img_galeria: FileList;
  public select_estado: boolean;
  public list_cat_estado: Array<CatEstadoModel>;
  public select_municipio: boolean;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public msj = 'Guardando';
  public sexos = [
    { id: 1, sexo: 'Hombre' },
    { id: 2, sexo: 'Mujer' }
  ];

  public minDate: Date;
  public maxDate: Date;

  public hIneFrente: boolean = false;
  public hIneAtras: boolean = false;

  public formulario1: boolean;
  public formulario2: boolean;
  public finalizar: boolean;
  public loadion: any;
  public direccionUser: any;
  primeraVez: any;
  btnEstado: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _utils_cls: UtilsCls,
    public _notificacionService: ToadNotificacionService,
    public modalController: ModalController,
    private _general_service: GeneralServicesService,
    private servicioPersona: PersonaService,
    private _router: Router,
    private sesionUtl: SessionUtil,
    private loadingController: LoadingController,
    private menuCtrl: MenuController
  ) {

    this.proveedorTO = new MsPersonaModel();
    this.proveedorTO.det_domicilio = new DetDomicilioModel();
    this.proveedorTO = JSON.parse(localStorage.getItem('u_data'));
    this.proveedorTO.fecha_nacimiento = this.proveedorTO.fecha_nacimiento !== null ? new Date(this.proveedorTO.fecha_nacimiento).toISOString() : null;
    this.proveedorTO.det_domicilio = JSON.parse(localStorage.getItem('u_data')).domicilio !== null && undefined ? JSON.parse(localStorage.getItem('u_data')).domicilio : new DetDomicilioModel();
    if (this.proveedorTO.fecha_nacimiento !== null || this.proveedorTO.fecha_nacimiento !== undefined) {
      //    this.fechas = this.proveedorTO.fecha_nacimiento.toISOString();
    } else {
      this.fechas = '';
    }
    //  this.fechas = this.proveedorTO.fecha_nacimiento.toISOString();
    this.select_estado = false;
    this.list_cat_estado = [];
    this.select_municipio = false;
    this.list_cat_municipio = [];
    this.list_cat_localidad = [];
    this.loader = false;
    this.hIneAtras = true;
    this.hIneFrente = true;
  }

  ngOnInit() {
    this.ObtenerDireccionPersonal();
    if (this.proveedorTO.det_domicilio.id_estado !== null && this.proveedorTO.det_domicilio.id_estado !== undefined) {
      this.get_list_cat_municipio({ id_estado: this.proveedorTO.det_domicilio.id_estado });
    }
    if (this.proveedorTO.det_domicilio.id_municipio !== null && this.proveedorTO.det_domicilio.id_municipio !== undefined) {
      this.get_list_cat_localidad({ id_municipio: this.proveedorTO.det_domicilio.id_municipio });
    }
    this.firstFormGroup = this._formBuilder.group(
      {
        compNombre: ['', Validators.required],
        compApellidos: ['', Validators.required],
        compCorreo: ['', Validators.required],
        compApellidoM: ['', Validators.required],
        compSexo: ['', Validators.required],
        compTelefono: ['', ''],
        compCelular: ['', Validators.required],
        compNacimiento: ['', Validators.required],
        ineFrente: ['', ''],
        ineAtras: ['', ''],
        selfie: ['', ''],
      }
    );

    if (this.proveedorTO.imagen === null) {
      this.firstFormGroup.get('selfie').setValidators([Validators.required]);
    }

    this.secondFormGroup = this._formBuilder.group({
      estado: ['', Validators.required],
      municipio: [{ disabled: !this.select_estado }, Validators.required],
      localidad: ['', Validators.required],
      colonia: ['', Validators.required],
      calle: ['', Validators.required],
      numeroExt: ['', Validators.required],
      numeroInt: ['', ''],
      cp: ['', ''],
    });

    this.load_cat_estados();

    this.formulario1 = true;
    this.formulario2 = false;
    this.finalizar = false;

  }

  public subir_imagen_cuadrada(event) {
    let nombre_archivo;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this._utils_cls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          nombre_archivo = archivo.name;
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 400 && height === 400) {
              //   this.procesando_img = true;
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                  data => {
                    file_64 = data;
                    const imagen = new ArchivoComunModel();
                    imagen.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                    imagen.archivo_64 = file_64;
                    this.proveedorTO.selfie = archivo;
                    this.hImagen = true;
                  }
                );
              } else {
                this._notificacionService.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
              }
            } else {
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.abrirModal(img.src, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = nombre_archivo,
                    archivo.archivo_64 = r.data;
                  this.proveedorTO.selfie = archivo;
                  this.hImagen = true;
                }
              }
              );
            }
          };
        };
      }
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.close();
  }

  async abrirModal(evento, width, heigh) {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        imageChangedEvent: evento,
        resizeToWidth: width,
        resizeToHeight: heigh,
        IdInput: 'selfie'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss().then(r => {
      return r;
    }
    );
    return data;
  }

  public subirArchivo(event, tipo: number) {
    this.file_img_galeria = event.target.files;
    const file_name = this.file_img_galeria[0].name;
    const file = this.file_img_galeria[0];
    if (file.size < 3145728) {
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
              this.hIneFrente = true;
              break;
            case 2:
              this.proveedorTO.ine2 = archivo;
              this.hIneAtras = true;
              break;
            case 3:
              this.proveedorTO.selfie = archivo;
              break;
          }
        }
      );
    } else {
      this._notificacionService.alerta('comun.file_sobrepeso');
    }
  }

  guardar() {
    this.loader = true;
    if (this.proveedorTO.selfie === null || this.proveedorTO.selfie === undefined) {
      this._notificacionService.alerta('Ingrese foto de perfil');
      this.loader = false;
    } else {
      this.formulario1 = false;
      this.formulario2 = true;
      this.finalizar = false;
      this.loader = false;
    }
  }

  ObtenerDireccionPersonal() {
    const id = this._utils_cls.getIdPersona();
    this.servicioPersona.datosUsuario(id).subscribe(
      respuesta => {
        var dato = respuesta.data.persona.domicilio;
        this.direccionUser = respuesta.data.persona.domicilio;
        this.proveedorTO.det_domicilio.calle = dato.calle;
        this.proveedorTO.det_domicilio.numero_int = dato.numero_int == null ? "" : dato.numero_int;
        this.proveedorTO.det_domicilio.numero_ext = dato.numero_ext == null ? "" : dato.numero_ext;
        this.proveedorTO.det_domicilio.colonia = dato.colonia;
        this.proveedorTO.det_domicilio.codigo_postal = dato.codigo_postal;
        this.load_cat_estados();
      },
      error => {
        console.log(error);
      }
    );
  }

  public get_list_cat_municipio(evento) {
    let idE;
    if (evento.type == 'ionChange') {
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderMunicipio = true;
      this._general_service.getMunicipiosAll(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_municipio = response.data.list_cat_municipio;
            this.select_estado = true;
            this.list_cat_municipio.forEach(element2 => {
              if (element2.id_municipio === this.direccionUser.id_municipio) {
                this.proveedorTO.det_domicilio.id_municipio = element2.id_municipio;
                this.get_list_cat_localidad(element2);
              }
            });
            if (this.proveedorTO.det_domicilio.id_municipio > 0) {
              this.select_estado = true;
              this.get_list_cat_localidad({ value: this.proveedorTO.det_domicilio.id_municipio });
            }
          }
        },
        error => {
          this._notificacionService.error(error);
        },
        () => {
          //  this.loaderMunicipio = false;
        }
      );
    } else {
      this.list_cat_municipio = [];
    }
  }
  public get_list_cat_municipio2(evento) {
    // this.loaderMunicipio = true;
    this._general_service.getMunicipiosAll(evento).subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_municipio = response.data.list_cat_municipio;
          this.select_estado = true;
          this.list_cat_municipio.forEach(element2 => {
            if (element2.id_municipio === this.direccionUser.id_municipio) {
              this.proveedorTO.det_domicilio.id_municipio = element2.id_municipio;
              this.get_list_cat_localidad(element2);

            }
          });
          if (this.proveedorTO.det_domicilio.id_municipio > 0) {
            this.select_estado = true;
            this.get_list_cat_localidad({ value: this.proveedorTO.det_domicilio.id_municipio });
          }
        }
      },
      error => {
        this._notificacionService.error(error);
      },
      () => {
        //  this.loaderMunicipio = false;
      }
    );

  }

  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          this.list_cat_estado.forEach(element => {
            if (element.id_estado === this.direccionUser.id_estado) {
              this.proveedorTO.det_domicilio.id_estado = element.id_estado;

              this.get_list_cat_municipio2(element.id_estado);
            }
          });
          this.btnEstado = true;
        }
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }


  public get_list_cat_localidad(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;
      this.select_municipio = true;
      this._general_service.getLocalidadAll(idE).subscribe(response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.select_municipio = true;
          this.list_cat_localidad = response.data.list_cat_localidad;
          this.list_cat_localidad.forEach(element => {
            if (element.id_localidad === this.direccionUser.id_localidad) {
              this.proveedorTO.det_domicilio.id_localidad = element.id_localidad;
            }
          });
        }
      },
        error => {
          //   this._notificacionService.pushError(error);
          this._notificacionService.error(error);
        },
        () => {
          //  this.loaderLocalidad = false;
        }
      );
    } else {
      this.select_municipio = false;
      this.proveedorTO.det_domicilio.id_localidad = undefined;
      this.list_cat_localidad = [];
    }
  }

  regresar() {
    this.formulario1 = true;
    this.formulario2 = false;
    this.finalizar = false;
  }

  guardar2() {
    this.loader = true;
    if (this.secondFormGroup.invalid) {
      return Object.values(this.secondFormGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(con => con.markAsTouched());
          this.loader = false;
        } else {
          control.markAsTouched();
          this.loader = false;
        }
      });
    } else {
      this.formulario1 = false;
      this.formulario2 = false;
      this.finalizar = true;
      this.loader = false;
    }
  }

  regresar2() {
    this.formulario1 = false;
    this.formulario2 = true;
    this.finalizar = false;
  }

  public guardarProveedor() {
    this.loader = true;
    this.proveedorTO.convertir_proveedor = true;
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.proveedorTO).subscribe(
        data => {
          this.mostrarMensaje(data);
          const resultado = this.sesionUtl.actualizarSesion();
          resolve(resultado);
          this.loader = false;
        },
        error => {
          this._notificacionService.error(error);
          this.loader = false;
        }
      );
    });
  }

  private mostrarMensaje(data) {
    switch (data.code) {
      case 200:

        for (const entry of data.message) {
          this._notificacionService.exito(entry);
          localStorage.setItem('u_data', JSON.stringify(this.proveedorTO));
          this._router.navigate(['/tabs/home']);
        }
        break;

      case 402:
        for (const entry of data.message) {
          this._notificacionService.alerta(entry);
        }
        break;
      case 500:
        for (const entry of data.message) {
          this._notificacionService.error(entry);
        }
        break;
      default:
        this._notificacionService.error('Error, Consulte a sistemas');
        break;
    }
  }
  convercionFechaNac(event) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms).toISOString();
    this.proveedorTO.fecha_nacimiento = fecha;
  }
}

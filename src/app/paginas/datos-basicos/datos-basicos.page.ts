import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { UtilsCls } from './../../utils/UtilsCls';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Router } from "@angular/router";
import { RecorteImagenComponent } from 'src/app/components/recorte-imagen/recorte-imagen.component';
import { SessionUtil } from './../../utils/sessionUtil';
import { ConvenioModel } from '../../Modelos/ConvenioModel';




@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
  providers: [
    SessionUtil,
  ]
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;
  public loader: boolean;
  public minDate: any;
  public maxDate: any;
  private file_img_galeria: FileList;
  public msj = 'Cargando';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  resizeToWidth: number = 0;
  resizeToHeight: number = 0;
  maintainAspectRatio: boolean = false;
  fechaSeleccionada: boolean = false;

  public lstAfiliaciones: any;
  public tipoAfl: any;
  public tipoOrg: any;
  public lstOrganizaciones: any;
  public afl_etiqueta: boolean;
  public etiqueta_name: any;

  public identficacionAfl: any;
  public nombreEmpresa: string;
  public lstAflUsuario: any;
  public lstOrgUsuario: any;
  public arrayAfl: any;
  public arrayOrg: any;
  public arrayAflOrg: any;
  public idAfl: number;

  public organizacion_id: number[];

  constructor(
    private servicioPersona: PersonaService,
    public loadingController: LoadingController,
    private utilsCls: UtilsCls,
    public modalController: ModalController,
    private notificaciones: ToadNotificacionService,
    private router: Router,
    private sesionUtl: SessionUtil
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 0);
    this.maxDate = new Date(currentYear - 18, 0, 0);
    this.minDate = moment.parseZone(this.minDate).format("YYYY-MM-DD");
    this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");
    this.loader = false;
  }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
    this.setDataBasicUser();
    this.obtenerOrgAfilUsuario();
    this.obtenerAfiliaciones();
    this.obtenerOrganizaciones();
  }

  private actualizarUsuario(user) {
    this.usuarioSistema = user;
    this.usuarioSistema.fecha_nacimiento = this.usuarioSistema.fecha_nacimiento !== null ? new Date(this.usuarioSistema.fecha_nacimiento) : null;
  }

  private setDataBasicUser() {
    const user = JSON.parse(localStorage.getItem('u_data'));
    this.servicioPersona.datosBasicos(user.id_persona).subscribe(
      response => {
        if (response.code === 200) {
          this.actualizarUsuario(response.data);
        } else {
          this.actualizarUsuario(user);
        }
      }, () => {
        this.actualizarUsuario(user);
      }
    );
  }

  actualizarDatos(formBasicos: NgForm) {
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    this.loader = true;


    if (this.arrayAfl === undefined) {
      this.arrayAfl = []
    }
    if (this.arrayOrg === undefined) {
      this.arrayOrg = []
    }

    this.arrayAflOrg = this.arrayAfl.concat(this.arrayOrg);

    if (this.arrayAflOrg !== undefined) {

      this.usuarioSistema.afiliaciones = Array<ConvenioModel>();

      this.arrayAfl.forEach(afi => {
        const afiliacion = new ConvenioModel();
        afiliacion.id_organizacion = afi;

        afiliacion.id_usuario = usuario_sistema.id_usuario_sistema;

        afiliacion.identificacion = this.identficacionAfl;

        afiliacion.nombre_empresa = ""

        this.usuarioSistema.afiliaciones.push(afiliacion);
      });


      this.arrayOrg.forEach(org => {

        const afiliacion = new ConvenioModel();
        afiliacion.id_organizacion = org;

        afiliacion.id_usuario = usuario_sistema.id_usuario_sistema;

        afiliacion.identificacion = "";

        afiliacion.nombre_empresa = this.nombreEmpresa

        this.usuarioSistema.afiliaciones.push(afiliacion);

      });

    }

    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.usuarioSistema).subscribe(
        data => {
          if (data.code === 200) {
            const resultado = this.sesionUtl.actualizarSesion();
            this.router.navigate(['/tabs/home']);
            this.loader = false;
            this.notificaciones.exito(data.data.mensaje);
            resolve(resultado);
            setTimeout(() => {
              this.router.navigate(['/tabs/home']);
            }, 1500);
          }
        },
        error => {
          this.loader = false;
          this.notificaciones.error(error);
          // this.lstPrincipal = new Array();

        });
    });
    miPrimeraPromise.then((successMessage) => {
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home']);
  }
  convercionFechaNac(event) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms);
    this.usuarioSistema.fecha_nacimiento = fecha;
  }
  public subir_imagen_cuadrado(event) {
    let nombre_archivo;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this.utilsCls.getFileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          nombre_archivo = archivo.name;
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 400 && height === 400) {
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                  data => {
                    const archivo = new ArchivoComunModel();
                    if (file_name != null) {
                      archivo.nombre_archivo = this.utilsCls.convertir_nombre(file_name);
                      archivo.archivo_64 = data;
                    }
                    this.usuarioSistema.selfie = archivo;
                  }
                );
              } else {
                this.notificaciones.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
                // this.notificacionService.pushAlert('comun.file_sobrepeso');
              }
            } else {
              this.resizeToWidth = 200;
              this.resizeToHeight = 200;
              this.abrirModal(img.src, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = nombre_archivo;
                  archivo.archivo_64 = r.data;
                  this.usuarioSistema.selfie = archivo;
                }
              }
              );
            }
          };
        };
      }
    }
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

  afiliado(evento) {
    const theValue = parseInt(evento.detail.value);

    this.arrayAfl = [theValue];
    // const found =afl.find(element => element === 99998);

    if (theValue != null) {
      this.afl_etiqueta = true;
    }
    // if (theValue== 99998) {
    //   this.nombre_empresa_afl = true;
    // } else {
    //   this.nombre_empresa_afl = false;
    // }
    let filteredArr = this.lstAfiliaciones.find(data => data.id_organizacion === theValue);


    this.etiqueta_name = filteredArr.etiqueta_identificacion != null ? filteredArr.etiqueta_identificacion : "No.";

  }

  async obtenerAfiliaciones() {
    await this.obtenerOrgAfilUsuario();
    this.servicioPersona.obtenerAfiliaciones().subscribe((response) => {
      this.lstAfiliaciones = Object.values(response.data);
      if (this.lstAflUsuario.length > 0) {
        this.lstAfiliaciones.forEach((element) => {
          this.lstAflUsuario.forEach((elements) => {
            if (element.id_organizacion == elements.id_organizacion) {
              this.idAfl = elements.id_organizacion
              this.tipoAfl = element.nombre;
              this.etiqueta_name = element.etiqueta_identificacion
              this.afl_etiqueta = true;
              this.identficacionAfl = elements.identificacion;
            }
          });
        });
      }
    });
  }

  organizacion(evento) {

    const org = evento.detail.value.map(item => parseInt(item));
    this.arrayOrg = org;

  }


  async obtenerOrganizaciones() {
    await this.obtenerOrgAfilUsuario();
    this.servicioPersona.obtenerOrganizaciones().subscribe((response) => {
      this.lstOrganizaciones = Object.values(response.data);
      if (this.lstOrgUsuario.length > 0) {
        this.lstOrganizaciones.forEach((element) => {
          this.lstOrgUsuario.forEach((elements) => {
            if (element.id_organizacion == elements.id_organizacion) {
              this.tipoOrg = element.nombre;
              this.nombreEmpresa = elements.nombre_empresa

            }
          });
        });
      }
    });
  }


  async obtenerOrgAfilUsuario() {
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    var respuesta = await this.servicioPersona.obtenerOrgAfilUsuario(usuario_sistema.id_usuario_sistema).toPromise();

    if (respuesta.code === 200) {
      this.lstAflUsuario = Object.values(respuesta.data.list_afiliaciones_usuario);
      this.lstOrgUsuario = Object.values(respuesta.data.list_organizaciones_usuario);

      this.organizacion_id = []
      let array = this.lstOrgUsuario;
      for (const item of array) {
        this.organizacion_id.push(item.id_organizacion);
      }
    } else {
      this.lstAflUsuario = [];
      this.lstOrgUsuario = [];
    }
  }
}

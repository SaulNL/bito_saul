import { CatOrganizacionesModel } from './../../../../Modelos/CatOrganizacionesModel';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { NegocioService } from "../../../../api/negocio.service";
import { UtilsCls } from './../../../../utils/UtilsCls';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from "../../../../components/recorte-imagen/recorte-imagen.component";
import { ActionSheetController } from "@ionic/angular";
import { HorarioNegocioModel } from '../../../../Modelos/HorarioNegocioModel';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-info-negocio',
  templateUrl: './info-negocio.page.html',
  styleUrls: ['./info-negocio.page.scss'],
})
export class InfoNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public negtag: boolean;
  public listTipoNegocio: any;
  public listCategorias: any;
  public listaSubCategorias: any;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  private usuario: any;
  public entregas = [
    { id: true, respuesta: 'Si' },
    { id: false, respuesta: 'No' }
  ];
  public tags: string;
  public lstOrganizaciones: Array<CatOrganizacionesModel>;
  public urlNegocioLibre = true;
  public controladorTiempo: any;
  public blnActivaEntregas: boolean;
  public diasArray = [
    { id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null },
    { id: 2, dia: 'Martes', horarios: [], hi: null, hf: null },
    { id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null },
    { id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null },
    { id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null },
    { id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null },
    { id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null },
  ];

  public negocioGuardar: any;
  public horarioini: string;
  public horariofin: string;
  public nuevoHorario: HorarioNegocioModel;
  public posicionHorario: number;
  public blnActivaHoraF: boolean;
  public blnActivaDias: boolean;
  public blnActivaHorario: boolean;
  public tipoNegoAux: any;
  public tipoGiroAux: any;
  public tipoSubAux: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService,
    private actionSheetController: ActionSheetController,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
    this.listCategorias = [];
    this.listTipoNegocio = [];
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.negtag = false;
    this.negocioGuardar = new NegocioModel();
    this.nuevoHorario = new HorarioNegocioModel();
    this.blnActivaHoraF = true;
    this.blnActivaDias = true;
    this.blnActivaHorario = true;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.specialune) {
        //this.negocioTO = JSON.parse(params.specialune);
        this.negocioTO = new NegocioModel();
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        let datos = JSON.parse(params.special);
        this.negocioTO = datos.info;
        this.negocioGuardar = datos.pys;
      }
    });
    this.obtenerTipoNegocio();
    this.obtenerCatOrganizaciones();
    this.buscarNegocio(this.negocioTO.id_negocio);
  }
  public buscarNegocio(id) {

    if (this.negocioTO.id_negocio === null || this.negocioTO.id_negocio === undefined) {
      this.negocioTO = new NegocioModel();
      this.negocioTO.tags = ""; 
      this.categoriaPrincipal({ value: 0 });
      this.subcategorias({ value: 0 });
    } else {
      this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          this.negocioTO = response.data;

          const archivo = new ArchivoComunModel();
          archivo.archivo_64 = this.negocioTO.url_logo;
          archivo.nombre_archivo = this.negocioTO.id_negocio.toString();
          this.negocioTO.logo = archivo;
          this.negocioTO.local = archivo;
          this.categoriaPrincipal({ value: this.negocioTO.id_tipo_negocio });
          this.subcategorias({ value: this.negocioTO.id_giro });
        },
        error => {
          console.log(error);
        }
      );
    }

  }
  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
      response => {
        this.listTipoNegocio = response.data;
        this.listTipoNegocio.forEach(element => {
          if (element.id_tipo_negocio == this.negocioTO.id_tipo_negocio) {
            this.tipoNegoAux = element.id_tipo_negocio;
          }
        });
      },
      error => {
        this.listTipoNegocio = [];
        console.log(error);
      }
    );
    
  }
  categoriaPrincipal(evento) {
    // this.loaderGiro = true;
    //   this.negocioTO.id_giro = null;
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.id_giro = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    this.negocioServico.categoriaPrincipal(idE).subscribe(
      respuesta => {
        this.listCategorias = respuesta.data;
        this.listCategorias.forEach(element => {
          if (element.id_giro == this.negocioTO.id_giro) {
            this.tipoGiroAux = element.id_giro;
          }
        });

      },
      error => {
      },
      () => {
        // this.loaderGiro = false;
      }
    );
  }
  subcategorias(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.id_categoria_negocio = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    this.negocioServico.obtenerCategorias(idE).subscribe(
      respuesta => {
        this.listaSubCategorias = Array();
        if (respuesta.code === 200) {
          this.listaSubCategorias = respuesta.data;
          this.listaSubCategorias.forEach(element => {
            if (element.id_categoria == this.negocioTO.id_categoria_negocio) {
              this.tipoSubAux = element.id_categoria;
            }
          });
        }
      },
      error => {
      },
      () => {
        //   this.loaderCategoria = false;
      }
    );
  }
  public subir_imagen_cuadrada(event) {
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
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
                      archivo.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                      archivo.archivo_64 = file_64;
                    }
                    this.negocioTO.logo = archivo;
                    this.negocioTO.local = archivo;

                    /*  this.formGroup1.patchValue({
                        archivo: archivo
                      });*/
                  }
                );
              } else {
                this.notificaciones.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
              }
            } else {
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.abrirModal(event, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = r.nombre_archivo,
                    archivo.archivo_64 = r.data;
                  this.negocioTO.logo = archivo;
                  this.negocioTO.local = archivo;
                  //this.blnImgCuadrada = false;
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
        IdInput: 'imageUpload'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss().then(r => {
      return r;
    }
    );
    return data;
  }
  agregarTags(tags: string[]) {
    this.negtag = true;
    this.tags = tags.join();
  }
  public obtenerCatOrganizaciones() {
    this.negocioServico.obtenerCatOrganizaciones().subscribe(
      response => {
        this.lstOrganizaciones = Object.values(response.data);
      });
  }

  /**
     * Funcion para enviar a validar la url del negocio
     * @param evento
     * @author Omar
     */
  confirmarUrlNegocio(evento, entrada = 1) {
    let cadena = '';
    if (entrada === 2) {
      cadena = evento.detail.value;
    }
    else {
      cadena = evento;
    }
    clearTimeout(this.controladorTiempo);
    this.controladorTiempo = setTimeout(() => {
      let tem = cadena.replace(/[^a-zA-Z0-9 ]/g, "");
      this.negocioServico.verificarUrlNegocio(tem).subscribe(
        repuesta => {
          if (repuesta.code === 200) {
            this.negocioTO.url_negocio = repuesta.data.url_negocio;
            this.urlNegocioLibre = repuesta.data.url_libre;
          }
        }
      );
      clearTimeout(this.controladorTiempo);
    }, 1000);
  }
  guardar() {
    this.datos();
    this.negocioServico.guardar(this.negocioGuardar).subscribe(
      response => {        
        if (response.code === 200) {
          this.notificaciones.exito('Tu negocio se guardo exitosamente');
        } else {
          this.notificaciones.alerta('Error al guardar, intente nuevamente');
          //   this._notificacionService.pushAlert('Error al guardar, intente nuevamente');
          //  this.loaderGuardar = false;
        }
      },
      error => {
        this.notificaciones.error(error);
        //  this.loaderGuardar = false;
      }
    );
  }
  entregasDomicilio(evento){
    this.blnActivaEntregas = evento.detail.value;
  }
  diasSeleccionado(evento) {
    if(evento.detail.value.length > 0){
      this.nuevoHorario.dias = evento.detail.value;
      this.blnActivaHorario = false;
    }else{
      this.blnActivaHorario = true;
    }
  }

agregarHorario() {
    if (this.nuevoHorario.id_horario === null || this.nuevoHorario.id_horario === undefined) {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format("HH:mm");
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format("HH:mm");
      this.nuevoHorario.activo = true;
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.id_horario = null;
      if(this.posicionHorario >=  0){
        this.negocioTO.dias[this.posicionHorario] = this.nuevoHorario;
      }else{
        this.negocioTO.dias.push(this.nuevoHorario);
      }
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioNegocioModel;
      this.posicionHorario = -1;
    } else {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format("HH:mm");
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format("HH:mm");
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.dias = this.nuevoHorario.dias;
      this.nuevoHorario.activo = true;
      this.negocioTO.dias[this.posicionHorario] = this.nuevoHorario;
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioNegocioModel;
      this.posicionHorario = -1;
    }
  }

  next(){
    this.datos();    
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto",],{
        queryParams: { special: navigationExtras },
      }
    );
  }
  regresar(){
     this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }
  datos(){
    this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
    this.negocioGuardar = new NegocioModel();
    this.negocioGuardar.id_negocio = this.negocioTO.id_negocio;
    this.negocioGuardar.rfc = this.negocioTO.rfc;
    this.negocioGuardar.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.negocioGuardar.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
    this.negocioGuardar.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;

    this.negocioGuardar.logo = this.negocioTO.logo;
    this.negocioGuardar.local = this.negocioTO.local;
    this.negocioGuardar.nombre_comercial = this.negocioTO.nombre_comercial;
    this.negocioGuardar.id_tipo_negocio = this.negocioTO.id_negocio;
    this.negocioGuardar.id_giro = this.negocioTO.id_giro;
    this.negocioGuardar.otra_categoria = this.negocioTO.otra_categoria;
    let tem = this.negocioTO.url_negocio;
    let ten = tem.replace(/\s+/g, '');
    this.negocioGuardar.url_negocio = ten.replace(/[^a-zA-Z0-9 ]/g, "");

    if (this.negocioGuardar.id_giro === 12) {
      this.negocioGuardar.id_categoria_negocio = 100;
    } else {
      this.negocioGuardar.id_categoria_negocio = this.negocioTO.id_categoria_negocio;
    }
    this.negocioGuardar.otra_subcategoria = '';
    this.negocioGuardar.organizaciones = this.negocioTO.organizaciones;
    this.negocioGuardar.nombre_organizacion = '';
    if (this.negocioGuardar.organizaciones !== undefined && this.negocioGuardar.organizaciones.length > 0) {
      this.negocioGuardar.nombre_organizacion = this.negocioTO.nombre_organizacion;
    }
    if (this.negtag == true) {
      this.negocioGuardar.tags = this.tags;
    } else {
      let convertir;
      convertir =JSON.parse(JSON.stringify(this.negocioTO));
      this.negocioGuardar.tags = convertir.tags.join(); 
    }
    this.negocioGuardar.descripcion = this.negocioTO.descripcion;
    this.negocioGuardar.entrega_domicilio = this.negocioTO.entrega_domicilio;
    this.negocioGuardar.consumo_sitio = this.negocioTO.consumo_sitio;
    this.negocioGuardar.entrega_sitio = this.negocioTO.entrega_sitio;
    this.negocioGuardar.alcance_entrega = this.negocioTO.alcance_entrega;
    this.negocioGuardar.tiempo_entrega_kilometro = this.negocioTO.tiempo_entrega_kilometro;
    this.negocioGuardar.costo_entrega = this.negocioTO.costo_entrega;
    this.negocioGuardar.telefono = this.negocioTO.telefono;
    this.negocioGuardar.celular = this.negocioTO.celular;
    this.negocioGuardar.correo = this.negocioTO.correo;
    this.negocioGuardar.id_facebook = this.negocioTO.id_facebook;
    this.negocioGuardar.twitter = this.negocioTO.twitter;
    this.negocioGuardar.instagram = this.negocioTO.instagram;
    this.negocioGuardar.youtube = this.negocioTO.youtube;
    this.negocioGuardar.tiktok = this.negocioTO.tiktok;
    this.negocioGuardar.det_domicilio.calle = this.negocioTO.det_domicilio.calle;
    this.negocioGuardar.det_domicilio.numero_int = this.negocioTO.det_domicilio.numero_int;
    this.negocioGuardar.det_domicilio.numero_ext = this.negocioTO.det_domicilio.numero_ext;
    this.negocioGuardar.det_domicilio.id_estado = this.negocioTO.det_domicilio.id_estado;
    this.negocioGuardar.det_domicilio.id_municipio = this.negocioTO.det_domicilio.id_municipio;
    this.negocioGuardar.det_domicilio.id_localidad = this.negocioTO.det_domicilio.id_localidad;
    this.negocioGuardar.det_domicilio.colonia = this.negocioTO.det_domicilio.colonia;
    if (this.negocioTO.det_domicilio.id_domicilio != null) {
      this.negocioGuardar.det_domicilio.id_domicilio = this.negocioTO.det_domicilio.id_domicilio;
    }
    this.negocioGuardar.dias = this.negocioTO.dias;
  }

  eliminarHorario(i) {
    this.negocioTO.dias.splice(i);
  }
  editarHorario(horario, i) {
    let objFecha = new Date();
    this.posicionHorario = i;
    this.horarioini = moment.parseZone(objFecha).format("YYYY-MM-DDT" + horario.hora_inicio + ":ssZ");
    this.horariofin = moment.parseZone(objFecha).format("YYYY-MM-DDT" + horario.hora_fin + ":ssZ");
    this.nuevoHorario.dias = horario.dias;
    this.nuevoHorario.id_horario = horario.id_horario;
  }
  validarHoraInicio(evento) {
    if (evento.detail.value !== '' ||
      evento.detail.value !== undefined ||
      evento.detail.value !== null) {
      this.blnActivaHoraF = false;
    }
  }
  validarHoraFinal(evento) {
    if (evento.detail.value !== '' ||
      evento.detail.value !== undefined ||
      evento.detail.value !== null) {
      this.blnActivaDias = false;
    }
  }
  cancelarHorario(){
    this.horarioini = '';
    this.horariofin = '';
    this.nuevoHorario = new HorarioNegocioModel;
  }
  async presentAlertEliminar(i) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro que desa Eliminar el registro?',
      message: 'Recuerde que la acción es ireversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          role: 'destructive',
          text: 'Confirmar',
          handler: () => {
            this.eliminarHorario(i);
          }
        }
      ]
    });
    await alert.present();
  }
  
}

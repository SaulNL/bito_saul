import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormularioNegocioGuard } from './../../../../api/formulario-negocio-guard.service';
import { ArchivoComunModel } from './../../../../Modelos/ArchivoComunModel';
import { CatOrganizacionesModel } from './../../../../Modelos/CatOrganizacionesModel';
import { ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { NegocioService } from "../../../../api/negocio.service";
import { UtilsCls } from './../../../../utils/UtilsCls';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from "../../../../components/recorte-imagen/recorte-imagen.component";
import { ActionSheetController } from "@ionic/angular";
import { HorarioNegocioModel } from '../../../../Modelos/HorarioNegocioModel';
import * as moment from 'moment';

@Component({
  selector: 'app-formulario-negocio',
  templateUrl: './formulario-negocio.page.html',
  styleUrls: ['./formulario-negocio.page.scss'],
})
export class FormularioNegocioPage implements OnInit {
  public segmentModel = 'informacion';
  public negocioTO: any;
  public negtag: boolean;
  public negLugar: boolean;
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
  public lugaresEntrega: string;
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
  public metodosPago = [
    { id: 1, metodo: "Transferencia Electrónica", value: null },
    { id: 2, metodo: "Tajeta de Crédito", value: null },
    { id: 3, metodo: "Tajeta de Débito", value: null },
    { id: 4, metodo: "Efectivo", value: null }
  ]
  public copyPago = [];
  public loader: boolean;
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
  public tipoOrgAux: any;
  public blnActivaNegocioFisico: boolean;
  public msj = 'Guardando';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private negocioServico: NegocioService,
    private actionSheetController: ActionSheetController,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController
  ) {
    this.listCategorias = [];
    this.listTipoNegocio = [];
    this.usuario = JSON.parse(localStorage.getItem("u_data"));
    this.negtag = false;
    this.negLugar = false;
    this.negocioGuardar = new NegocioModel();
    this.nuevoHorario = new HorarioNegocioModel();
    this.blnActivaHoraF = true;
    this.blnActivaDias = true;
    this.blnActivaHorario = true;
    this.loader = false;
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        let datos = JSON.parse(params.special);
        this.negocioTO = datos.info;
        this.negocioGuardar = datos.pys;
        this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
        this.blnActivaNegocioFisico = this.negocioTO.tipo_negocio;
      }
    });

    this.buscarNegocio(this.negocioTO.id_negocio);
    this.metodosPago = [
      { id: 1, metodo: "Transferencia Electrónica", value: this.negocioTO.tipo_pago_transferencia },
      { id: 2, metodo: "Tajeta de Crédito", value: this.negocioTO.tipo_pago_tarjeta_credito },
      { id: 3, metodo: "Tajeta de Débito", value: this.negocioTO.tipo_pago_tarjeta_debito },
      { id: 4, metodo: "Efectivo", value: this.negocioTO.tipo_pago_efectivo }
    ]
    this.setarPago();
  }

  setarPago() {
    this.metodosPago.forEach(i => {
      if (i.value === 1) {
        this.copyPago.push(i);
      }
    });
  }
  async consumoSitioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Consumo en Sitio',
      message: 'Activa esta opción para que tus clientes realicen pedidos estando en tu establecimiento',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  async entregaSitioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Entrega en Sitio',
      message: ' Activa esta opción para que tus clientes realicen pedidos y pasen a recogerlos a tu establecimiento',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  async entregaDomicilioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Entrega Domicilio',
      message: 'Activa esta opción para que tus clientes realicen pedidos y tú se los entregues a domicilio',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  abrirModalCambio() {
    let objetoAux;
    objetoAux = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(objetoAux);
    this.router.navigate(['/tabs/home/negocio/card-negocio/info-negocio/solicitud-cambio-url'], { queryParams: { special: navigationExtras } });
  }

  async cancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estas seguro?',
      message: 'Se cancelara todo el proceso?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['/tabs/home/negocio'], { queryParams: { special: true } });
          }
        }
      ]
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    console.log(event);
  }

  public buscarNegocio(id: any) {
    if (this.negocioTO.id_negocio === null || this.negocioTO.id_negocio === undefined) {
      this.notificaciones.error('No se pudo cargar tu negocio');
    } else {
      this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          this.negocioTO = response.data;
          this.obtenerTipoNegocio();
          this.obtenerCatOrganizaciones();
          console.log(this.negocioTO);
          const archivo = new ArchivoComunModel();
          archivo.archivo_64 = this.negocioTO.url_logo;
          archivo.nombre_archivo = this.negocioTO.id_negocio.toString();
          this.negocioTO.logo = archivo;
          this.negocioTO.local = archivo;
          this.categoriaPrincipal({ value: this.negocioTO.id_tipo_negocio });
          this.subcategorias({ value: this.negocioTO.id_giro });
        },
        error => {
        }
      );
    }
  }
  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
      response => {
        this.listTipoNegocio = response.data;
        if (this.negocioTO.id_negocio != null) {
          this.listTipoNegocio.forEach(element => {
            if (element.id_tipo_negocio == this.negocioTO.id_tipo_negocio) {
              this.tipoNegoAux = element.nombre;
            }
          });
        }
      },
      error => {
        this.listTipoNegocio = [];
      }
    );
  }
  categoriaPrincipal(evento) {
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
        if (this.negocioTO.id_negocio != null) {
          this.listCategorias.forEach(element => {
            if (element.id_giro == this.negocioTO.id_giro) {
              this.tipoGiroAux = element.nombre;
            }
          });
        }
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
              this.tipoSubAux = element.nombre;
            }
          });
        }
      }
    );
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
              this.abrirModal(img.src, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = nombre_archivo,
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
  agregarLugaresEntrega(lugaresEntrega: string[]) {
    this.negLugar = true;
    this.lugaresEntrega = lugaresEntrega.join();
  }
  public obtenerCatOrganizaciones() {
    this.negocioServico.obtenerCatOrganizaciones().subscribe((response) => {
      this.lstOrganizaciones = Object.values(response.data);
      if (this.negocioTO.id_negocio != null) {
        this.lstOrganizaciones.forEach((element) => {
          this.negocioTO.organizaciones.forEach((elements) => {
            if (element.id_organizacion == elements) {
              this.tipoOrgAux = element.nombre;
            }
          });
        });
      }
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

  entregasDomicilio(evento) {
    this.blnActivaEntregas = evento.detail.value;
  }
  esNegocioFisico(evento) {
    this.blnActivaNegocioFisico = evento.detail.value;
  }
  diasSeleccionado(evento) {
    if (evento.detail.value.length > 0) {
      this.nuevoHorario.dias = evento.detail.value;
      this.blnActivaHorario = false;
    } else {
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
      if (this.posicionHorario >= 0) {
        this.negocioTO.dias[this.posicionHorario] = this.nuevoHorario;
      } else {
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
  cancelarHorario() {
    this.horarioini = '';
    this.horariofin = '';
    this.nuevoHorario = new HorarioNegocioModel;
  }
  cambiarPago(event) {
    let lista = event.detail.value;
    let credito = 0, debito = 0, efectivo = 0, transferencia = 0;
    lista.forEach(element => {
      if (element.id === 1) {
        transferencia = 1;
      } else if (element.id === 2) {
        credito = 1;
      } else if (element.id === 3) {
        debito = 1;
      } else if (element.id === 4) {
        efectivo = 1;
      }
    });
    this.negocioTO.tipo_pago_transferencia = transferencia;
    this.negocioTO.tipo_pago_tarjeta_credito = credito;
    this.negocioTO.tipo_pago_tarjeta_debito = debito;
    this.negocioTO.tipo_pago_efectivo = efectivo;
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

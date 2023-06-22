import { Component, OnInit } from '@angular/core';
import { EventosModel } from '../../../Modelos/eventos/EventosModel'
import { EventoUrlImagen } from '../../../Modelos/eventos/EventoUrlImagen';
import { NegocioService } from '../../../api/negocio.service';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import { EventoService } from '../../../api/evento/evento.service';
import { GeneralServicesService } from '../../../api/general-services.service';
import { UtilsCls } from '../../../utils/UtilsCls';
import { ArchivoComunModel } from './../../../Modelos/ArchivoComunModel';
import { element } from 'protractor';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from '../../../components/recorte-imagen/recorte-imagen.component';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-modal-eventos',
  templateUrl: './modal-eventos.page.html',
  styleUrls: ['./modal-eventos.page.scss'],
})
export class ModalEventosPage implements OnInit {
  public eventData = new EventosModel();
  public usuario: any;
  public lstNegocios: any;
  public tipoPago: any[];
  public pagoSeleccionado: any[];
  public tipoEvento: any;
  public eventoSelect: any;
  public recurrencia: any;
  public list_cat_estado: any[];
  public list_cat_municipio: any[];
  public list_cat_localidad: any[];
  public estado: string;
  public municipio: string;
  public localidad: string;
  public resizeToWidth = 0;
  public resizeToHeight = 0;
  public edit = null;
  public eventoInfo: any;
  public eventoInfo_imagen = null;
  public negtag: boolean;
  public tags: any;
  loader: boolean;
  public msj = 'Cargando';
  public activoBTN: boolean = false;
  public confirmacionBTN: boolean = false;

  constructor(
    private negocio_service: NegocioService,
    private _notificacionService: ToadNotificacionService,
    private eventoService: EventoService,
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    public modalController: ModalController,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.loader = true;
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.edit = localStorage.getItem("editEvent");
    if (this.edit != null || this.edit != undefined) {
      this.obtenerDataEvent(this.edit);
      localStorage.removeItem("editEvent");
    }
    this.tipoPago =
      [
        { id: 1, tipo: "Efectivo" },
        { id: 2, tipo: "Transferencia" },
        { id: 3, tipo: "Tarjeta credito" },
        { id: 4, tipo: "Tarjeta debito" }
      ]
    this.obtenerNegocios();
    this.obtenerEventoTipo();
    this.obtenerRecurrencia();
    this.obtenerEstados();
  }

  obtenerNegocios() {
    this.negocio_service.misNegocios(this.usuario.proveedor.id_proveedor).subscribe(
      response => {
        this.lstNegocios = response.data;
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }
  obtenerEventoTipo() {
    this.eventoService.tipoEvento().subscribe(
      res => {
        this.tipoEvento = res.data;
      }
    )
  }
  obtenerEstados() {
    if (this.edit == null) this.loader = false;
    this._general_service.getEstadosWS().subscribe(response => {
      console.log("estado", response)
      if (this._utils_cls.is_success_response(response.code)) {
        this.list_cat_estado = response.data.list_cat_estado;
        // this.loader = false;
      }
    },
      error => {
        this._notificacionService.error(error);
      }
    );
  }
  obtenerMunicipio(event) {
    let idE;
    if (event.type === 'ionChange') {
      // this.negocioTO.det_domicilio.id_municipio = [];
      idE = event.detail.value;
    } else {
      if (event.value == undefined) {
        idE = event
      } else {
        idE = event.value;
      }
    }
    if (idE > 0) {
      this._general_service.getMunicipiosAll(idE).subscribe(response => {
        console.log("municipio", response)
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_municipio = response.data.list_cat_municipio;
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
  obtenerLocalidad(event) {
    let idE;
    if (event.type === 'ionChange') {
      // this.negocioTO.det_domicilio.id_localidad = [];
      idE = event.detail.value;
    } else {
      if (event.value == undefined) {
        idE = event
      } else {
        idE = event.value;
      }
    }
    if (idE > 0) {
      this._general_service.getLocalidadAll(idE).subscribe(response => {
        console.log("localidad", response)
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_localidad = response.data.list_cat_localidad;
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
      this.list_cat_localidad = [];
    }
  }
  obtenerRecurrencia() {
    this.eventoService.tipoRecurrencia().subscribe(
      res => {
        this.recurrencia = res.data;
      }
    )
  }
  obtenerDataEvent(id) {
    let body = {
      id_evento: id
    }
    this.eventoService.eventoInfo(body).subscribe(
      res => {
        this.asignarValoresEvent(res.data[0])
        // this.eventoInfo = res.data;
        // this.eventoInfo_imagen = res.data.url_imagens
      }
    )
  }

  asignarValoresEvent(data) {
    console.log("data", data)
    let pagos = [];

    setTimeout(async () => {
      this.eventData.activo = data.activo
      this.activoBTN = data.activo == 1 ? true : false;
      this.eventData.requiere_confirmacion = data.requiere_confirmacion;
      this.confirmacionBTN = data.requiere_confirmacion == 1 ? true : false;
      this.eventData.id_evento = data.id_evento;
      this.eventData.evento = data.evento;
      this.eventData.id_negocio = data.id_negocio;
      this.eventData.id_estado = await data.id_estado;
      if (this.eventData.id_estado != "") {
        await this.obtenerMunicipio(this.eventData.id_estado)
      }
      setTimeout(async () => {
        this.eventData.id_municipio = await data.id_municipio;
        // this.obtenerLocalidad(this.eventData.id_municipio)
        setTimeout(async () => {
          this.eventData.id_localidad = await data.id_localidad;
        }, 1500);
      }, 1500);

      this.eventData.fecha = data.fecha;
      this.eventData.tipo_pago_transferencia = data.tipo_pago_transferencia;
      this.eventData.tipo_pago_tarjeta_credito = data.tipo_pago_tarjeta_credito;
      this.eventData.tipo_pago_tarjeta_debito = data.tipo_pago_tarjeta_debito;
      this.eventData.tipo_pago_efectivo = data.tipo_pago_efectivo;
      this.eventData.telefono = data.telefono;
      this.eventData.id_tipo_recurrencia = data.id_tipo_recurrencia;
      this.eventData.tipo_evento = data.tipo_evento;
      this.eventData.tags = data.tags;
      this.eventoInfo_imagen = data.url_imagen;

      if (data.tipo_pago_transferencia == 1) pagos.push(2);
      if (data.tipo_pago_tarjeta_credito == 1) pagos.push(3);
      if (data.tipo_pago_tarjeta_debito == 1) pagos.push(4);
      if (data.tipo_pago_efectivo == 1) pagos.push(1);
      setTimeout(() => {
        this.pagoSeleccionado = pagos;
        this.eventoSelect = data.tipo_evento.split(",");
      }, 2000)

      // this.eventData.id_municipio = data.id_municipio;
      // this.eventData.id_localidad = data.id_localidad;
      console.log("asignado", this.eventData)
      this.loader = false;
    }, 1000)
  }

  async submit() {
    this.loader = true;
    let urlImg = new EventoUrlImagen;
    if (this.eventData.imagen.archivo_64 == null && this.eventoInfo_imagen != null) {
      urlImg.archivo_64 = null;
      urlImg.nombre_archivo = null;
      urlImg.url_archivo = this.eventoInfo_imagen;
      this.eventData.imagen = await urlImg;
    }
    this.guardarEvento(this.eventData)
  }

  guardarEvento(data) {
    console.log("datos a guardar", data)
    this.eventoService.guardarEvento(data).subscribe(res => {
      console.log(res)
      if (res.code == 200) {
        this.loader = false
        this._notificacionService.exito('Evento Guardado');
        this._router.navigate(["/tabs/mis-eventos"])
      }
    }),
      error => {
        //   this._notificacionService.pushError(error);
        this._notificacionService.error(error);
      }
  }

  onPagoSeleccionado() {
    this.eventData.tipo_pago_efectivo = this.pagoSeleccionado.find(element => element == 1) ? 1 : 0;
    this.eventData.tipo_pago_transferencia = this.pagoSeleccionado.find(element => element == 2) ? 1 : 0;
    this.eventData.tipo_pago_tarjeta_credito = this.pagoSeleccionado.find(element => element == 3) ? 1 : 0;
    this.eventData.tipo_pago_tarjeta_debito = this.pagoSeleccionado.find(element => element == 4) ? 1 : 0;
  }
  onEventoSeleccionado() {
    let varString = "";
    this.eventoSelect.forEach((element, index) => {
      if (index == 0) {
        varString = element
      } else {
        if (this.eventoSelect.length == index + 1) {
          varString = varString + "," + element;
          this.eventData.tipo_evento = varString;
        } else {
          varString = varString + "," + element;
        }
      }
    });
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
                    this.eventData.imagen = archivo;
                    // console.log("esto se debe guardar", archivo)
                    /*  this.formGroup1.patchValue({
                        archivo: archivo
                      });*/
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
                  this.eventData.imagen = archivo;
                  // console.log("esto se debe guardar 2", archivo)
                  // this.blnImgCuadrada = false;
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
    console.log("desde el Modal:", tags)
    this.negtag = true;
    this.tags = tags.join(', ');
    console.log("tags?", tags)
    this.eventData.tags = this.tags;
  }

  verificarActivo(evento, tipo) {
    console.log(evento.detail.checked)
    console.log(this.activoBTN)
    if (tipo) {
      this.eventData.activo = evento.detail.checked == false ? 0 : 1;
    }
    if (!tipo) {
      this.eventData.requiere_confirmacion = evento.detail.checked == false ? 0 : 1;
    }

  }

}

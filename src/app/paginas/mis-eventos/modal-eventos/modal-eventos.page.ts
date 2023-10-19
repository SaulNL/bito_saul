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
import {ModalController, Platform} from '@ionic/angular';
import { RecorteImagenComponent } from '../../../components/recorte-imagen/recorte-imagen.component';
import { Router } from '@angular/router';
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
  public diaSemana: any;
  public tipoEventoTxt: boolean = false;
  public descripcionEvento: boolean = false;
  public msj = 'Cargando';
  public activoBTN: boolean = false;
  public confirmacionBTN: boolean = false;
  public fotografiasArray: any;
  public videosArray: any;
  public fotosArrayAgregar: any;
  public videosArrayAgregar: any;
  public numeroFotos: number;
  public numeroFotosEdit: number;
  public numeroVideosEdit: number;
  public numeroVideos: number;
  public galeriaFull = false;
  base64Video = null;
  public isIos: boolean;
  public mensaje: string;
  public bandera: boolean;
  public mapaForm: boolean = false;
  public frecuenciaSemanal: boolean;
  numeroFotosPermitidas: number;
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };

  constructor(
    private negocio_service: NegocioService,
    private _notificacionService: ToadNotificacionService,
    private eventoService: EventoService,
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    public modalController: ModalController,
    private _router: Router,
    private notificaciones: ToadNotificacionService,
    private platform: Platform,
  ) {
    this.fotografiasArray = [];
    this.videosArray = [];
    this.videosArrayAgregar = [];
    this.fotosArrayAgregar = [];
    this.isIos = this.platform.is("ios");
    this.bandera = true;
  }

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
        this.eventoInfo = res.data[0];
        // this.eventoInfo_imagen = res.data.url_imagens
      }
    )
  }

  asignarValoresEvent(data) {
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

      this.eventData.fecha = data.fecha !== null ? new Date(data.fecha).toISOString() : null;

      this.eventData.tipo_pago_transferencia = data.tipo_pago_transferencia;
      this.eventData.tipo_pago_tarjeta_credito = data.tipo_pago_tarjeta_credito;
      this.eventData.tipo_pago_tarjeta_debito = data.tipo_pago_tarjeta_debito;
      this.eventData.tipo_pago_efectivo = data.tipo_pago_efectivo;
      this.eventData.telefono = data.telefono;
      this.eventData.id_tipo_recurrencia = data.id_tipo_recurrencia;
      this.frecuenciaSemanal = data.id_tipo_recurrencia == 3 ? true : false;
      this.eventData.tipo_evento = data.tipo_evento;
      this.eventData.descripcion_evento = data.descripcion_evento
      this.eventData.tags = data.tags;
      this.fotografiasArray = data.fotografias;
      this.videosArray = data.videos;

      this.fotografiasArray = this.fotografiasArray.map(foto => {
        // Iteramos sobre cada propiedad del objeto
        for (const prop in foto) {
          // Verificamos si el valor es igual a la cadena "null" y lo convertimos a null
          if (foto[prop] === "null") {
            foto[prop] = null;
          }
        }
        return foto;
      });

      this.numeroFotos = this.fotografiasArray.length;

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
      this.loader = false;
    }, 1000)
  }

  asignarValoresMapa(event) {
    this.mapaForm = true;
    this.eventData.codigo_postal = event.cP;
    this.eventData.calle = event.calle;
    this.eventData.colonia = event.colonia;
    this.eventData.id_tipo_recurrencia = event.frecuencia
    if (event.frecuencia == 3) {
      this.eventData.dias = event.dias ? JSON.stringify(event.dias) : null;
      this.eventData.fecha = null;
    } else {
      this.eventData.dias = null;
      this.eventData.fecha = event.fecha;
    }
    this.eventData.tipo_evento = event.tipoEvento;
    this.eventData.longitud = event.long;
    this.eventData.latitud = event.lt;
    this.eventData.numero_ext = event.numExterior;
    this.eventData.numero_int = event.numInterior;
    this.eventData.id_estado = event.estado;
    this.eventData.id_municipio = event.municipio;
    this.eventData.id_localidad = event.localidad;
    this.eventData.tipo_evento = event.tipoEvento; 
  }

  asignarValoresNoEdicion() {
    if (!this.mapaForm) {
      this.eventData.codigo_postal = this.eventoInfo.codigo_postal
      this.eventData.calle = this.eventoInfo.calle
      this.eventData.colonia = this.eventoInfo.colonia
      this.eventData.dias = this.eventoInfo.dias
      this.eventData.id_tipo_recurrencia = this.eventoInfo.id_tipo_recurrencia
      this.eventData.fecha = this.eventoInfo.fecha
      this.eventData.tipo_evento = this.eventoInfo.tipo_evento
      this.eventData.longitud = this.eventoInfo.longitud
      this.eventData.latitud = this.eventoInfo.latitud
      this.eventData.numero_ext = this.eventoInfo.numero_ext
      this.eventData.numero_int = this.eventoInfo.numero_int
      this.eventData.id_estado = this.eventoInfo.id_estado
      this.eventData.id_municipio = this.eventoInfo.id_municipio
      this.eventData.id_localidad = this.eventoInfo.id_localidad
      this.eventData.tipo_evento =  this.eventoInfo.tipo_evento
    }
  }

  async submit() {
    // this.loader = true;
    this.asignarValoresNoEdicion()
    let urlImg = new EventoUrlImagen;
    if (this.eventData.imagen.archivo_64 == null && this.eventoInfo_imagen != null) {
      urlImg.archivo_64 = null;
      urlImg.nombre_archivo = null;
      urlImg.url_archivo = this.eventoInfo_imagen;
      this.eventData.imagen = await urlImg;
    }
    this.eventData.fotografias.push(...this.fotografiasArray);
    this.eventData.fotografias.push(...this.fotosArrayAgregar);
    this.eventData.videos.push(...this.videosArray);
    this.eventData.videos.push(...this.videosArrayAgregar);
    this.guardarEvento(this.eventData);
  }
  inputTipoEvento() {
    this.tipoEventoTxt = this.eventData.tipo_evento.length >= 49 ? true : false;
  }

  inputDescripcion(event) {
    this.descripcionEvento = event.target.value.length == 100 ? true : false;
  }

  guardarEvento(data) {
    this.eventoService.guardarEvento(data).subscribe(res => {
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
        this.eventData.tipo_evento = this.eventoSelect.length <= 1 ? element : ""
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
    this.negtag = true;
    this.tags = tags.join(', ');
    this.eventData.tags = this.tags;
  }

  verificarActivo(evento, tipo) {
    if (tipo) {
      this.eventData.activo = evento.detail.checked == false ? 0 : 1;
    }
    if (!tipo) {
      this.eventData.requiere_confirmacion = evento.detail.checked == false ? 0 : 1;
    }

  }

  selectFechaEvento(event: any) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms).toISOString();
    this.eventData.fecha = fecha;
  }

  public agregarFoto(event) {
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
                      this.fotosArrayAgregar.push(archivo);
                      this.numeroFotos++;
                      if (this.numeroFotos >= this.numeroFotosPermitidas) {
                        this.galeriaFull = true;
                      }
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
                      this.fotosArrayAgregar.push(archivo);
                      this.numeroFotos++;
                      if (this.numeroFotos >= this.numeroFotosPermitidas) {
                        this.galeriaFull = true;
                      }
                    }
                  }
              );
            }
          };
        };
      }
    }
  }

  public borrarFotoEdit(posicion: number) {
    this.fotografiasArray.splice(posicion, 1);
    this.numeroFotosEdit--;
    if (this.numeroFotosEdit < 3) {
      this.galeriaFull = false;
    }
  }

  public borrarVideoEdit(posicion: number){
    this.videosArray.splice(posicion, 1);
    this.numeroVideosEdit--;
  }

  public borrarFoto(posicion: number) {
    this.fotosArrayAgregar.splice(posicion, 1);
    this.numeroFotos--;
  }

  public borrarVideo(posicion: number){
    this.videosArrayAgregar.splice(posicion, 1);
    this.numeroVideos--;
  }

  public seleccionarVideo(event: any) {
    if (event.target.files && event.target.files.length) {

      let archivo = event.target.files[0];
      if (archivo.size < 100000000) {

        let utl = new UtilsCls();
        let nombre_video = null;
        if (this.isIos) {
          let quitarExtension = archivo.name.toString().slice(0, -3);
          nombre_video = quitarExtension + 'mp4';
        } else {
          nombre_video = archivo.name;
        }


        utl.getBase64(archivo).then((data) => {
          let base64Video = null;
          if (this.isIos) {
            let cortarData = data.toString().slice(20);
            base64Video = 'data:video/mp4' + cortarData;
          } else {
            base64Video = data;
          }

          let video = new ArchivoComunModel();
          video.nombre_archivo = this._utils_cls.convertir_nombre(nombre_video);
          video.archivo_64 = base64Video;
          this.base64Video = video;
          this.videosArrayAgregar.push(this.base64Video);
        });
      } else {
        this._notificacionService.alerta("Lo sentimos, el archivo supera los 100 MB");
      }
    }
  }

  async obtenerImg(){
    if (this.bandera === true){
      this.mensaje = "(Inténtelo de nuevo)"
    }

    const result = await FilePicker.pickImages({
      multiple: false,
      readData: true
    });
    this.bandera = false;
    this.mensaje = null;

    // const contents = await Filesystem.readFile({
    //   path: result.files[0].path,
    // });

    let imgPrueba = `data:image/png;base64,${result.files[0].data}`

    this.resizeToWidth = 400;
    this.resizeToHeight = 400;
    this.abrirModal(imgPrueba, this.resizeToWidth, this.resizeToHeight).then(r => {
      if (r !== undefined) {
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = result.files[0].name,
        archivo.archivo_64 = r.data;
        this.fotosArrayAgregar.push(archivo);
        this.numeroFotos++;
        if (this.numeroFotos >= this.numeroFotosPermitidas) {
          this.galeriaFull = true;
          }
          }
        }
    );
  }

  async obtenerVideo(){
    if (this.bandera === true){
      this.mensaje = "(Inténtelo de nuevo)"
    }
    const result = await FilePicker.pickVideos({
      multiple: false,
      readData: true
    });
    this.bandera = false;
    this.mensaje = null;
    
    if (result.files[0].size < 100000000) {
      let video = new ArchivoComunModel();
            video.nombre_archivo = result.files[0].name;
            video.archivo_64 = `data:image/png;base64,${result.files[0].data}`
            this.videosArrayAgregar.push(video);
    }else {
        this._notificacionService.alerta("Lo sentimos, el archivo supera los 100 MB");
      }
  }

  tipoFrecuencia(tipo) {
    this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true ;
  }

}

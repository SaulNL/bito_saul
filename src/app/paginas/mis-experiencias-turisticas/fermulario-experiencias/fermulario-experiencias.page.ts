import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienciasTuristicasService } from 'src/app/api/experienciasTuristicas/experiencias-turisticas.service';
import moment from 'moment';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { ArchivoComunModel } from './../../../Modelos/ArchivoComunModel';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { ModalController, Platform } from '@ionic/angular';
import { RecorteImagenComponent } from 'src/app/components/recorte-imagen/recorte-imagen.component';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { NegocioService } from 'src/app/api/negocio.service';
import { Router } from '@angular/router';
import { FormularioEtProductoComponent } from './formulario-et-producto/formulario-et-producto.component';

@Component({
  selector: 'app-fermulario-experiencias',
  templateUrl: './fermulario-experiencias.page.html',
  styleUrls: ['./fermulario-experiencias.page.scss'],
})
export class FermularioExperienciasPage implements OnInit {

  public loader: boolean = false;
  public msj = 'Cargando';
  public edit: any;
  public datosExperiencias: any;
  public frecuenciaSemanal: boolean = false;
  public vistaFecha: string = 'none';
  public vistaDias: string = 'none';
  public recurrencia: any;
  public tipoPago: any[];
  public tags: any;
  public fotografiasArray: any;
  public numeroFotos: number;
  public numeroFotosEdit: number;
  public galeriaFull = false;
  public fotosArrayAgregar: any;
  public numeroFotosPermitidas: number;
  public resizeToWidth = 0;
  public resizeToHeight = 0;
  public bandera: boolean;
  public mensaje: string;
  public videosArray: any;
  public numeroVideosEdit: number;
  public videosArrayAgregar: any;
  public numeroVideos: number;
  public isIos: boolean;
  public base64Video = null;
  public datosUsuario: any;
  public lstNegocios: any;
  public sihayImg: any;

  experienciasForm: FormGroup;
  pagoSelect: FormGroup;
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };
  

  constructor(
    private formBuilder: FormBuilder,
    private experienciasService: ExperienciasTuristicasService,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController,
    private platform: Platform,
    private negocio_service: NegocioService,
    private _router: Router,
  ) {
    this.datosUsuario = JSON.parse(localStorage.getItem('u_data'))
    this.experienciasForm = this.formBuilder.group({
      titulo_experiencia: ['', [Validators.required,Validators.maxLength(50)]],
      id_experiencia_turistica: [''],
      id_negocio: ['', [Validators.required]],
      descripcion_experiencia: ['', [Validators.required,Validators.maxLength(100)]],
      id_estado: ['', [Validators.required]],
      id_municipio: ['', [Validators.required]],
      id_localidad: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numero_ext: ['', [Validators.required]],
      numero_int: [''],
      colonia: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required]],
      latitud: ['', [Validators.required]],
      longitud: ['', [Validators.required]],
      fecha_inicio_experiencia: [''],
      fecha_fin_experiencia: [null],
      hora_inicio_experiencia: ['', [Validators.required]],
      hora_fin_experiencia: [null],
      telefono_experiencia: ['', [Validators.required]],
      tags_experiencia: [''],
      tipo_experiencia: ['', [Validators.required,Validators.maxLength(50)]],
      tipo_pago_transferencia: ['', [Validators.required]],
      tipo_pago_tarjeta_debito: ['', [Validators.required]],
      tipo_pago_tarjeta_credito: ['', [Validators.required]],
      tipo_pago_efectivo: ['', [Validators.required]],
      id_tipo_recurrencia_experiencia: ['', [Validators.required]],
      requiere_confirmacion: false,
      activo: false,
      eliminado: 0,
      fotografias: [''],
      videos: [''],
      dias: null ,
      conceptos:[null,[Validators.required]],
    });
    this.pagoSelect = this.formBuilder.group({
      pagoSelect: [''],
    });
    this.tipoPago =
      [
        { id: 1, tipo: "Efectivo" },
        { id: 2, tipo: "Transferencia" },
        { id: 3, tipo: "Tarjeta credito" },
        { id: 4, tipo: "Tarjeta debito" }
    ]

    this.fotografiasArray = [];
    this.fotosArrayAgregar = [];
    this.bandera = true;
    this.videosArray = [];
    this.videosArrayAgregar = [];
    this.isIos = this.platform.is("ios");

    }

  ngOnInit() {
    if (localStorage.getItem('editExperiencias')) {
      this.loader = true;
      let id = localStorage.getItem('editExperiencias')
      this.obtenerInformacionExperiencia(id)
      localStorage.removeItem('editExperiencias')
    } else {
      this.experienciasForm.addControl('metodosPago', this.formBuilder.control(''))
    }
    this.obtenerTipoRecuerrencia();
    this.obtenerNegocios();
  }
  asignarValores(data) {
    this.experienciasForm.patchValue({
      titulo_experiencia: data.titulo_experiencia,
      id_experiencia_turistica: data.id_experiencia_turistica,
      id_negocio: data.id_negocio,
      descripcion_experiencia: data.descripcion_experiencia,
      fecha_inicio_experiencia: data.fecha_inicio_experiencia,
      fecha_fin_experiencia: data.fecha_fin_experiencia,
      hora_inicio_experiencia: data.hora_inicio_experiencia,
      hora_fin_experiencia: data.hora_fin_experiencia,
      telefono_experiencia: data.telefono_experiencia,
      tags_experiencia: data.tags_experiencia,
      tipo_experiencia: data.tipo_experiencia,
      tipo_pago_transferencia: data.tipo_pago_transferencia,
      tipo_pago_tarjeta_debito: data.tipo_pago_tarjeta_debito,
      tipo_pago_tarjeta_credito: data.tipo_pago_tarjeta_credito,
      tipo_pago_efectivo: data.tipo_pago_efectivo,
      id_tipo_recurrencia_experiencia: data.id_tipo_recurrencia_experiencia,
      requiere_confirmacion: data.requiere_confirmacion == 1 ? true : false,
      activo: data.activo == 1 ? true : false,
      eliminado: 0,
      // fotografias: data.fotografias,
      // videos: data.videos,
      dias: data.dias ? JSON.parse(data.dias) : null,
      conceptos: data.conceptos,
    })
    this.frecuenciaSemanal = this.datosExperiencias.id_tipo_recurrencia_experiencia == 3 ? true : false;
    this.vistaDias = this.datosExperiencias.id_tipo_recurrencia_experiencia == 3 ? 'initial' : 'none';
    this.vistaFecha = this.datosExperiencias.id_tipo_recurrencia_experiencia == 1 ? 'initial' : 'none';
    this.experienciasForm.addControl('metodosPago', this.formBuilder.control(''))
    let metodoDePago = [];
    metodoDePago.push(data.tipo_pago_efectivo == 1 ? 1:0)
    metodoDePago.push(data.tipo_pago_transferencia == 1 ? 2:0)
    metodoDePago.push(data.tipo_pago_tarjeta_credito == 1 ? 3:0)
    metodoDePago.push(data.tipo_pago_tarjeta_debito == 1 ? 4:0)

    this.experienciasForm.get('metodosPago').setValue(metodoDePago)
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
    this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
    this.loader = false
  }

  asignarUbicacion(datosUbicacion) {
    this.experienciasForm.patchValue({
      id_estado: datosUbicacion.id_estado,
      id_municipio: datosUbicacion.id_municipio,
      id_localidad: datosUbicacion.id_localidad,
      calle: datosUbicacion.calle,
      numero_ext: datosUbicacion.numero_ext,
      numero_int: datosUbicacion.numero_int,
      colonia: datosUbicacion.colonia,
      codigo_postal: datosUbicacion.codigo_postal,
      latitud: datosUbicacion.latitud,
      longitud: datosUbicacion.longitud,
    })
  }

  async guardarExperiencia() {
    let dias = this.experienciasForm.get('dias').value == 'null' || this.experienciasForm.get('dias').value == null ? null : JSON.stringify(this.experienciasForm.get('dias').value);
    let Activo = this.experienciasForm.get('activo').value ? 1 : 0;
    this.experienciasForm.get('activo').setValue(Activo);
    let Confirmacion = this.experienciasForm.get('requiere_confirmacion').value ? 1 : 0;
    this.experienciasForm.get('requiere_confirmacion').setValue(Confirmacion);
    let fotos = [];
    fotos.push(...this.fotografiasArray);
    fotos.push(...this.fotosArrayAgregar)
    this.experienciasForm.get('fotografias').setValue(fotos);
    let videos = []
    videos.push(...this.videosArray);
    videos.push(...this.videosArrayAgregar);
    this.experienciasForm.get('videos').setValue(videos);
    this.loader = true;
    this.experienciasForm.get('dias').setValue(dias)
    this.experienciasForm.removeControl('metodosPago');
    let conceptos = await this.asignarFotografiaProductos(this.experienciasForm.get('conceptos').value)
    this.experienciasForm.get('conceptos').setValue(await conceptos)
    this.experienciaGuardar(this.experienciasForm.value);
  }


  async asignarFotografiaProductos(conceptos) {
    const conceptosModificados = [];

    for (const [index, element] of conceptos.entries()) {
      if (!element.fotografia) {
        let nuevoProducto = { ...element };
        let nuevoJson = {
            concepto: element.concepto,
            descripcion_concepto: element.descripcion_concepto,
            precio: element.precio,
            existencia: element.existencia,
            cantidad_disponibles: element.cantidad_disponibles,
            activo: element.activo,
            porcentaje_descuento: element.porcentaje_descuento,
            id_organizacion: null,
            fotografia: null
        }
        
        let foto = {
          "id_det_experiencia_turistica_concepto": element.id_det_experiencia_turistica_concepto,
          "url_imagen": element.url_imagen
        };
        
        nuevoJson.fotografia = [foto];
        nuevoJson.id_organizacion = !element.id_organizacion ? null : element.id_organizacion;

        conceptosModificados.push(nuevoJson);
      } else {
        conceptosModificados.push(element);
      }
    }

    return conceptosModificados;
  }

  obtenerInformacionExperiencia(body) {
    try {
      this.experienciasService.experienciaDetalle(body).subscribe(res => {
        if (res.code == 200) {
          this.datosExperiencias = res.data[0]
          this.asignarValores(res.data[0]);
        } else if (res.code == 500) {
          this.loader = false
          this.notificaciones.error('Error al obtener la experiencia');
        }
      }),error => {
        console.log(error)
      }
    } catch (error) {
      this.loader = false
      this.notificaciones.error('Error al obtener la experiencia');
    }
  }

  tipoFrecuencia(tipo) {
    this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true;
    this.vistaDias = tipo.detail.value == 3 ? 'initial' : 'none';
    this.vistaFecha = tipo.detail.value == 1 ? 'initial' : 'none';
    let fechas = tipo.detail.value == 1 ? this.experienciasForm.get('fecha_inicio_experiencia').value : null;
    let dias = tipo.detail.value == 3 ? JSON.stringify(this.experienciasForm.get('dias').value) : null;
    this.experienciasForm.get('fecha_inicio_experiencia').setValue(fechas)
    this.experienciasForm.get('dias').setValue(dias)
  }

  obtenerTipoRecuerrencia() {
    this.experienciasService.tipoRecurrencia().subscribe(res => {
      if (res.code == 200) {
        this.recurrencia = res.data;
      }
    }),error => {
          console.log(error)
    }
  }
  experienciaGuardar(body) {
    try {
      this.experienciasService.guardarExperiencia(body).subscribe(res => {
        if (res.code == 200) {
          this.loader = false
          this.notificaciones.exito('Experiencia Guardada');
          this._router.navigate(["/tabs/mis-experiencias-turisticas"])
        } else if (res.code == 500) {
          this.loader = false
          this.notificaciones.error('Error al Guardar');
        }
      }),error => {
        console.log(error)
      }
    } catch (error) {
      this.loader = false
      this.notificaciones.error('Error al Guardar');
    }
  }

  selectFechaEvento(event: any) {
    let fecha = event.detail.value;
    let ms = Date.parse(fecha);
    fecha = new Date(ms).toISOString();
    this.experienciasForm.get('fecha_inicio_experiencia').setValue(fecha);
  }

  seleccionarHora(event) {
    let hora = moment(event.detail.value)
    let horaFormateada = hora.format('HH:mm');
    this.experienciasForm.get('hora_inicio_experiencia').setValue(horaFormateada);
  }

  onPagoSeleccionado(evento) {
    this.experienciasForm.get('tipo_pago_efectivo').setValue(evento.detail.value.find(element => element == 1) ? 1 : 0);
    this.experienciasForm.get('tipo_pago_transferencia').setValue(evento.detail.value.find(element => element == 2) ? 1 : 0);
    this.experienciasForm.get('tipo_pago_tarjeta_credito').setValue(evento.detail.value.find(element => element == 3) ? 1 : 0);
    this.experienciasForm.get('tipo_pago_tarjeta_debito').setValue(evento.detail.value.find(element => element == 4) ? 1 : 0);
  }

  agregarTags(tags: string[]) {
    this.tags = tags.join(', ');
    this.experienciasForm.get('tags_experiencia').setValue(this.tags);
  }

  verificarActivo(evento, tipo) {
    if (tipo) {
      this.experienciasForm.get('activo').setValue(evento.detail.checked == false ? 0 : 1);
    }
    if (!tipo) {
      this.experienciasForm.get('requiere_confirmacion').setValue(evento.detail.checked == false ? 0 : 1);
    }

  }

  public borrarFotoEdit(posicion: number) {
    this.fotografiasArray.splice(posicion, 1);
    this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
    this.numeroFotosEdit--;
    if (this.numeroFotosEdit < 3) {
      this.galeriaFull = false;
    }
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
                      this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
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
                      this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
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

   public borrarFoto(posicion: number) {
    this.fotosArrayAgregar.splice(posicion, 1);
    this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
    this.numeroFotos--;
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
        this.sihayImg = this.fotografiasArray.length > 0 || this.fotosArrayAgregar.length > 0 ? true : false;
        this.numeroFotos++;
        if (this.numeroFotos >= this.numeroFotosPermitidas) {
          this.galeriaFull = true;
          }
          }
        }
    );
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

  public borrarVideoEdit(posicion: number){
    this.videosArray.splice(posicion, 1);
    this.numeroVideosEdit--;
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
        this.notificaciones.alerta("Lo sentimos, el archivo supera los 100 MB");
      }
    }
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
        this.notificaciones.alerta("Lo sentimos, el archivo supera los 100 MB");
      }
  }

  obtenerNegocios() {
    this.negocio_service.misNegocios(this.datosUsuario.proveedor.id_proveedor).subscribe(
      response => {
        this.lstNegocios = response.data;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }

  validarFormulario() {
    let dias = JSON.stringify(this.experienciasForm.get('dias').value)
    let Activo = this.experienciasForm.get('activo').value ? 1 : 0;
    this.experienciasForm.get('activo').setValue(Activo);
    let Confirmacion = this.experienciasForm.get('requiere_confirmacion').value ? 1 : 0;
    this.experienciasForm.get('requiere_confirmacion').setValue(Confirmacion);
    let fotos = [];
    fotos.push(...this.fotografiasArray);
    fotos.push(...this.fotosArrayAgregar)
    this.experienciasForm.get('fotografias').setValue(fotos);
    let videos = []
    videos.push(...this.videosArray);
    videos.push(...this.videosArrayAgregar);
    this.experienciasForm.get('videos').setValue(videos);
    this.experienciasForm.get('dias').setValue(dias)
    this.experienciasForm.removeControl('metodosPago');
  }

  async agregarProducto(productoInfo, id) {
    const modal = await this.modalController.create({
      component: FormularioEtProductoComponent,
      componentProps: {
        productoDatos: {
          data: productoInfo,
          id: id,
        }
      }
    });
    modal.present();

    const { data, role, posicion } = await (modal.onWillDismiss() as Promise<{
      data?: any;
      role?: string;
      posicion?: any;
    }>)
    if (data.role === 'confirm') {
      if (data.data.fotografia[0].url_imagen) {
        data.data.url_imagen = data.data.fotografia[0].url_imagen
        data.data.id_det_experiencia_turistica_concepto = data.data.fotografia[0].id_det_experiencia_turistica_concepto
        data.data.fotografia = null;
      }
      let productos = []
      productos = this.experienciasForm.get('conceptos').value ? this.experienciasForm.get('conceptos').value : [];
      if (data.posicion == null) {
        productos.push(data.data)
      } else {
        productos.splice( data.posicion, 1, data.data )
      }
      this.experienciasForm.get('conceptos').setValue(productos)
    }
  }

  eliminarProducto(posicion) {
    let productos = this.experienciasForm.get('conceptos').value;
    productos.splice(posicion, 1)
    this.experienciasForm.get('conceptos').setValue(productos)
  }

  // tipoFrecuencia(tipo) {
  //   this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true ;
  // }
}

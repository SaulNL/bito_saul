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
      requiere_confirmacion: [''],
      activo: [''],
      eliminado: [''],
      fotografias: [''],
      videos: [''],
      dias:['']
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
    this.obtenerTipoRecuerrencia();
    this.obtenerNegocios();
  }
  asignarValores(data) {
    this.frecuenciaSemanal = this.datosExperiencias.id_tipo_recurrencia_experiencia == 3 ? true : false;
    this.vistaDias = this.datosExperiencias.id_tipo_recurrencia_experiencia == 3 ? 'initial' : 'none';
    this.vistaFecha = this.datosExperiencias.id_tipo_recurrencia_experiencia == 1 ? 'initial' : 'none';
    this.fotografiasArray = this.datosExperiencias.fotografias;
    this.videosArray = this.datosExperiencias.videos;
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

  guardarExperiencia() {
    let fotos = [];
    fotos.push(...this.fotografiasArray);
    fotos.push(...this.fotosArrayAgregar)
    this.experienciasForm.get('fotografias').setValue(fotos);
    let videos = []
    videos.push(...this.videosArray);
    videos.push(...this.videosArrayAgregar);
    this.experienciasForm.get('videos').setValue(videos);
    console.log('guardadoEx', this.experienciasForm.value)
    this.loader = true;
    this.experienciaGuardar(this.experienciasForm.value);
  }

  tipoFrecuencia(tipo) {
    this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true;
    this.vistaDias = tipo.detail.value == 3 ? 'initial' : 'none';
    this.vistaFecha = tipo.detail.value == 1 ? 'initial' : 'none';
    let fechas = tipo.detail.value == 1 ? this.experienciasForm.get('fecha').value : null;
    let dias = tipo.detail.value == 3 ? this.experienciasForm.get('dias').value : null;
    this.experienciasForm.get('fecha').setValue(fechas)
    this.experienciasForm.get('dias').setValue (dias)
  }

  obtenerTipoRecuerrencia() {
    this.experienciasService.tipoRecurrencia().subscribe(res => {
      if (res.code == 200) {
        this.recurrencia = res.data;
        console.log('tipoRecuerrencia',res)
      }
    }),error => {
          console.log(error)
    }
  }
  experienciaGuardar(body) {
    this.experienciasService.guardarExperiencia(body).subscribe(res => {
      console.log('guardar',res)
      if (res.code == 200) {
        this.loader = false
        this.notificaciones.exito('Evento Guardado');
        this._router.navigate(["/tabs/mis-experiencias-turisticas"])
      }
    }),error => {
      console.log(error)
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
    console.log(evento)
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

   public borrarFoto(posicion: number) {
    this.fotosArrayAgregar.splice(posicion, 1);
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
    console.log(this.experienciasForm.valid,this.experienciasForm.value)
  }

  // tipoFrecuencia(tipo) {
  //   this.frecuenciaSemanal = tipo.detail.value == 1 ? false : true ;
  // }
}

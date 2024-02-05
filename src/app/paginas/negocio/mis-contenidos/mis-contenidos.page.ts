import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioModel } from 'src/app/Modelos/NegocioModel';
import { NegocioService } from 'src/app/api/negocio.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IContenidosNegocio } from 'src/app/interfaces/IContenidosNegocio';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { RecorteImagenComponent } from 'src/app/components/recorte-imagen/recorte-imagen.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-mis-contenidos',
  templateUrl: './mis-contenidos.page.html',
  styleUrls: ['./mis-contenidos.page.scss'],
})
export class MisContenidosPage implements OnInit {
  public negocioTO: NegocioModel;
  public datos: any;
  public loader: boolean;
  loaderGuardar: boolean;
  public listaContenidos: any;
  blnAgregarContenidos: boolean;
  blnMostrarListaContenidos: boolean;
  formRegistro: FormGroup;
  contenidoReducido: { nombre_archivo: string | null; archivo_64: string | null; };
  contenidoCompleto: { nombre_archivo: string | null; archivo_64: string | null; };
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };
  public videosArrayAgregar: any;
  public numeroVideos: number;
  public isIos: boolean;
  bandera: boolean;
  fotografiasArray: { nombre_archivo: string | null; archivo_64: string | null; };
  fotografiasUrl: any;
  resizeToWidth: number;
  resizeToHeight: number;
  mensaje: string;
  tags: string;
  carta: null;
  loadPdf: boolean;
  contenidoReducidoUrl: string | any;
  contenidoCompletoUrl: string | any;
  

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private negocioService: NegocioService,
    private notificacionService: ToadNotificacionService,
    private platform: Platform,
    public modalController: ModalController,
    public alertController: AlertController,
    private iab: InAppBrowser) {
      this.loader = false;
      this.blnAgregarContenidos = false
      this.blnMostrarListaContenidos = true;
      this.formRegistro = this.iniciarFormularioRegistro();
      this.bandera = true;
      this.isIos = this.platform.is("ios");
      this.carta = null;
      this.loadPdf = false;
     }


    get tituloContenidoForm() {
      return this.formRegistro.get('titulo_contenido');
    }

    get descripcionContenidoForm() {
      return this.formRegistro.get('descripcion_contenido');
    }

    get precioContenidoForm() {
      return this.formRegistro.get('precio');
    }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.datos = JSON.parse(params.special);
        this.negocioTO = this.datos.info;
      }
    });

    this.obtenerContenidos();
  }

  public obtenerContenidos() {
    this.loader = true;
    this.negocioService.obtenerContenidosNegocio(this.negocioTO.id_negocio)
      .subscribe(
        (respuesta) => {
          this.listaContenidos = respuesta.data;
          console.log(this.listaContenidos);
        },
        (error) => {
          
        },
        () => {
          this.loader = false;
        }
      );
  }

  agregarContenidos(){
    this.blnAgregarContenidos = true;
    this.blnMostrarListaContenidos = false;
    this.iniciarFormularioRegistro();

  }

  editarRegistro(contenido){
    this.blnAgregarContenidos = true;
    this.blnMostrarListaContenidos = false;
    this.setearContenido(contenido);

  }

  setearContenido(data: IContenidosNegocio){
    this.formRegistro.patchValue({
      id_contenido: data.id_contenido,
      id_negocio: data.id_negocio,
      titulo_contenido: data.titulo_contenido,
      descripcion_contenido: data.descripcion_contenido,
      precio: data.precio,
      tags_contenido: data.tags_contenido ? data.tags_contenido.join(', ') : '',
      activo: data.activo
    })

    this.contenidoReducidoUrl = data.url_contenido_reducido;
    this.contenidoCompletoUrl = data.url_contenido_completo;
    this.fotografiasUrl = data.fotografias[0];
  }

  async alertContentDelete(contenido: IContenidosNegocio){
      const alert = await this.alertController.create({
        header: "Eliminar",
        message: `¿Estás seguro de que deseas eliminar el producto: ${contenido.titulo_contenido}?`,
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => { },
          },
          {
            text: "Aceptar",
            handler: () => {
              this.eliminarContenido(contenido);
            },
          },
        ],
      });
  
      await alert.present();
  }

  eliminarContenido(contenido){
    this.negocioService.eliminarContenidoNegocio(contenido.id_contenido).subscribe(
      (respuesta) => {
        this.regresarLista();
        
        this.obtenerContenidos();
        console.log(respuesta);
      },
      (error) => {
        console.log(error);
        
      },
      () => {
        this.loader = false;
        this.notificacionService.exito("Contenido eliminado con éxito");
      }
    );
  }

  iniciarFormularioRegistro() {
    const formTmp: FormGroup | null = new FormGroup({
      id_contenido: new FormControl(null),
      id_negocio: new FormControl(null),
      titulo_contenido: new FormControl(null, [Validators.required]),
      descripcion_contenido: new FormControl(null, [Validators.required]),
      url_contenido_reducido: new FormControl(null),
      url_contenido_completo: new FormControl(null),
      precio: new FormControl(null,[Validators.required]),
      tags_contenido:new FormControl(null),
      fotografias: new FormControl(null),
      videos: new FormControl(null),
      fecha_contenido: new FormControl(null),
      activo: new FormControl(null)
    });

  

    return formTmp;
  }


  
  async subirImagen(){
    if (this.bandera === true){
      this.mensaje = "(Inténtelo de nuevo)"
    }

    const result = await FilePicker.pickImages({
      multiple: false,
      readData: true
    });

    this.bandera = false;
    this.mensaje = null;

    let imgPrueba = `data:image/png;base64,${result.files[0].data}`

    this.resizeToWidth = result.files[0].width;
    this.resizeToHeight = result.files[0].height;
    this.abrirModal(imgPrueba, this.resizeToWidth, this.resizeToHeight).then(r => {
      if (r !== undefined) {
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = result.files[0].name,
        archivo.archivo_64 = r.data;
        this.fotografiasArray = {
          nombre_archivo: archivo.nombre_archivo,
          archivo_64: archivo.archivo_64
        };
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

  async subirContenidoReducido(){
    this.mensaje = "(Inténtelo de nuevo)";
    const result = await FilePicker.pickFiles({
      types: ['application/pdf'],
      multiple: false,
      readData: true
    });
    this.mensaje = null;

    if (result.files[0].size < 3145728) {
      const archivo = new ArchivoComunModel();
      archivo.nombre_archivo = result.files[0].name;
      archivo.archivo_64 = `data:image/png;base64,${result.files[0].data}`
      this.contenidoReducido = {
        nombre_archivo : archivo.nombre_archivo,
        archivo_64 : archivo.archivo_64
      }
    }else {
      this.notificacionService.alerta("El archivo sobrepasa los 3 MB");
    }
    
  }

  async subirContenidoCompleto(){
    const result = await FilePicker.pickFiles({
      types: ['application/pdf'],
      multiple: false,
      readData: true
    });

    if (result.files[0].size < 23145728) {
      const archivo = new ArchivoComunModel();
      archivo.nombre_archivo = result.files[0].name;
      archivo.archivo_64 = `data:image/png;base64,${result.files[0].data}`
      this.contenidoCompleto = {
        nombre_archivo : archivo.nombre_archivo,
        archivo_64 : archivo.archivo_64
      }
    }else {
      this.notificacionService.alerta("El archivo sobrepasa los 20 MB");
    }
    
  }


  agregarTags(tags: string[]) {
    this.tags = tags.join(', ');
    this.formRegistro.get('tags_contenido').setValue(this.tags);
  }

  guardarSubmit(){
    if (this.formRegistro.invalid) {
      return Object.values(this.formRegistro.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((con) => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }else{
      this.loaderGuardar = true;
      let fotos = [];
      fotos.push(this.fotografiasArray ? this.fotografiasArray : this.fotografiasUrl);
      this.formRegistro.get('fotografias').setValue(fotos);
      this.formRegistro.get('id_negocio').setValue(this.negocioTO.id_negocio);
      this.formRegistro.get('url_contenido_reducido').setValue(this.contenidoReducido ? this.contenidoReducido : this.contenidoReducidoUrl);
      this.formRegistro.get('url_contenido_completo').setValue(this.contenidoCompleto ? this.contenidoCompleto : this.contenidoCompletoUrl);
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toISOString().slice(0, 10); // Obtiene la fecha en formato "YYYY-MM-DD"
      
      this.formRegistro.get('fecha_contenido').setValue(fechaFormateada);
      
      console.log(this.formRegistro.value);

      this.negocioService.guardarContenidoNegocio(this.formRegistro.value).subscribe(
        (respuesta) => {
          if(respuesta.code == 200){
            this.regresarLista();
            this.notificacionService.exito("Contenido guardado con éxito");
            this.obtenerContenidos();
            this.loaderGuardar = false;
          }else{
            this.loaderGuardar = false;
            this.notificacionService.error("Hubo un problema al guardar el contenido");
          }
          
          console.log(respuesta);
        },
        (error) => {
          console.log(error);
          this.loaderGuardar = false;
          
        },
        () => {
          this.loader = false;
          this.loaderGuardar = false;
        }
      );
    }
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  public regresarLista() {
    this.blnMostrarListaContenidos = true;
    this.blnAgregarContenidos = false;
    this.formRegistro.reset();
    this.contenidoReducidoUrl = null;
    this.contenidoCompletoUrl = null
    this.fotografiasArray = null;
    this.fotografiasUrl = null;
    this.contenidoCompleto = null;
    this.contenidoReducido = null;
  }

  verContenido(ruta) {
    this.iab.create('https://docs.google.com/viewer?url=' + ruta);
  }
  

}

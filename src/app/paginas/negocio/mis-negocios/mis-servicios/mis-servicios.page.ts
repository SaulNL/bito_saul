import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { DtosMogoModel } from '../../../../Modelos/DtosMogoModel';
import { DatosNegocios } from '../../../../Modelos/DatosNegocios';
import { NegocioService } from '../../../../api/negocio.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { GeneralServicesService } from '../../../../api/general-services.service';
import { UtilsCls } from '../../../../utils/UtilsCls';
import { ArchivoComunModel } from  '../../../../Modelos/ArchivoComunModel';
import { NgForm } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalClasificacionComponent } from '../../../../componentes/modal-clasificacion/modal-clasificacion.component';
import { AlertController } from '@ionic/angular';
import { RecorteImagenComponent } from '../../../../components/recorte-imagen/recorte-imagen.component';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.page.html',
  styleUrls: ['./mis-servicios.page.scss'],
})
export class MisServiciosPage implements OnInit {

  public negocioTO: NegocioModel;
  public iden: number;
  public datos: any;
  public loader: boolean;
  public ocultar: boolean;
  public loadPdf: boolean;
  public agregarClas: boolean;
  private datosUsuario: any;
  public blnImgCuadrada: boolean;
  public agregarServicio: boolean;
  public mostrarListaServicios: boolean;
  public carta: SafeUrl;
  public blnNuevaCategoria: boolean;
  public blnformMobile: boolean;
  private blnEditando: boolean;
  public servicioE: DtosMogoModel;
  public listaCategorias: any;
  public datosNegocio: DatosNegocios;
  public listaVista: any;
  private fileImgGaleria: FileList;
  public servicioTags: Array<string>;
  public nuevaCategoria: any;
  public maximoServicios: number;
  public editarCategoria: any;
  public banderaGuardar: boolean;
  public listaServicios: any;
  private categoriaSeleccionada: any;
  public servicioNuevo: DtosMogoModel;
  private isEdicion: boolean;
  public opcion: number;
  private indexModificar: number;
  public procesando_img: boolean;
  public maintainAspectRatio: boolean = false;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public tipoImagen: number = 0;
  public imageChangedEvent: any = '';
  public blnImgRectangulo: boolean;
  public blnImgPoster: boolean;
  public almacenarRegistro: any;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private sercicioNegocio: NegocioService,
    private sanitizer: DomSanitizer,
    private notificacionService: ToadNotificacionService,
    private generalServicio: GeneralServicesService,
    private utilscls: UtilsCls,
    public modalController: ModalController,
    public alertController: AlertController
  ) { 
      this.carta = null;
      this.blnNuevaCategoria = false;
      this.blnformMobile = false;
      this.blnEditando = false;
      this.servicioE = new DtosMogoModel();
      this.listaCategorias = [];
      this.listaVista = [];
      this.servicioTags = [];
  }

  ngOnInit() {
    this.active.queryParams.subscribe( params => {
      if (params && params.special) {
        this.ocultar = false;
        this.mostrarListaServicios = false;
        this.agregarServicio = false;
        this.agregarClas = false;
        this.loadPdf = false;
        this.loader = false;
        this.datosUsuario = JSON.parse(localStorage.getItem('u_data'));
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO  = this.datos.info;
        this.blnImgCuadrada = true;
        this.servicioNuevo = new DtosMogoModel()
        this.buscarDatos();
        this.buscarCategoriasProductos();
        this.nuevaCategoria = {
          activo: 1,
          nombre: '',
          id_categoria: null,
          id_categoria_negocio: null,
          tipo_categoria: 0
        }
        this.sercicioNegocio.obtenerNumMaxServicios().subscribe(
          respuesta => {
            this.maximoServicios = respuesta.data;
          },
          error => {
            this.notificacionService.error(error);
            this.maximoServicios = 0;
          }
        );
        
      }
    });
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }

  public regresarLista() {
    this.mostrarListaServicios = true;
    this.agregarServicio = false;
  }

  eliminarCarta() {
    (document.getElementById('imagenCarta') as HTMLInputElement).value = '';
    this.carta =  null;
    this.datosNegocio.cartaServicio = '';
    this.guardarDatos();
  }

  guardarDatos() {
    if (this.datosNegocio.cartaServicio.archivo_64 !== undefined){
      this.loadPdf = true;
    }
    this.sercicioNegocio.guardarProductoServio(this.datosNegocio).subscribe(
      repsuesta => {
        this.datosNegocio = repsuesta.data;
        if ( this.datosNegocio.cartaServicio !== undefined && this.datosNegocio.cartaServicio !== null && this.datosNegocio.cartaServicio !== '') {
          this.carta = this.cleanURL(this.datosNegocio.cartaServicio);
        }
        if (this.loadPdf){
          this.notificacionService.exito('Carta guardada con éxito');
        }
      }, error => {
      },
      () => {
        this.loadPdf = false;
      }
    );
  }

  cleanURL(oldURL ): SafeUrl {
    return   this.sanitizer.bypassSecurityTrustResourceUrl(oldURL);
  }

  private buscarDatos() {
    this.loader = true;
    this.sercicioNegocio.buscarProductosServios(this.negocioTO.id_negocio, 1).subscribe(
      response => {
        this.datosNegocio = response.data;
        if (this.datosNegocio === undefined || this.datosNegocio === null ||this.datosNegocio._id === undefined) {
          this.datosNegocio = new DatosNegocios();
          this.datosNegocio.domicilio = this.negocioTO.det_domicilio;
          this.datosNegocio.id_negocio = this.negocioTO.id_negocio;
          this.datosNegocio.idProveedor = this.datosUsuario.proveedor.id_proveedor;
          this.sercicioNegocio.guardarProductoServio(this.datosNegocio).subscribe(
            response => {
              this.datosNegocio = response.data;
            },
            error => {
              console.log(error);
            }
          );
        }
        this.loader = false;
        this.listaVista = response.data.categorias !== undefined ? response.agrupados : [];
        if ( this.datosNegocio.cartaServicio !== undefined && this.datosNegocio.cartaServicio !== null && this.datosNegocio.cartaServicio !== '') {
          this.carta = this.cleanURL(this.datosNegocio.cartaServicio);
        }
      },
      error => {
        this.loader = false;
      }
    );
  }

  buscarCategoriasProductos() {
    this.listaCategorias = [];
    this.generalServicio.obtenerListaCategopriasProducto(this.negocioTO.id_categoria_negocio, 1).subscribe(
      respuesta => {
        this.listaCategorias = respuesta.data;
        // console.info(this.listaCategorias);
      },
      error => {
        this.notificacionService.error(error);
      }
    );
  }

  public subirCarta(event) {
    console.log(event);
    this.fileImgGaleria = event.target.files;
    const fileName = this.fileImgGaleria[0].name;
    const file = this.fileImgGaleria[0];
    console.log(file.size);
    if (file.size < 3145728) {
    let file64: any;
    const utl = new UtilsCls();
      console.log('llegue');
    utl.getBase64(file).then(
      data => {
        file64 = data;
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = this.utilscls.convertir_nombre(fileName);
        archivo.archivo_64 = file64;
        console.log(archivo);
        this.datosNegocio.cartaServicio = archivo;
        this.guardarDatos();
      }
    );
    } else {
      this.notificacionService.alerta('El archivo sobrepasa los 3 MB');
    }
  }

  agregarTags(tags: string[]) {
    this.servicioTags = tags;
    this.datosNegocio.serviciosTags = this.servicioTags;
    this.guardarDatos();
  }

  agregarClasificacion() {
    this.agregarClas = true;
  }

  public guardar(form: NgForm){
    if ( form.invalid ) {
      return Object.values( form.controls ).forEach( control => {
        if (control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      let exist = false;
      this.listaVista.map(item => {
        if (item.nombre === this.nuevaCategoria.nombre) {
          exist = true;
          this.notificacionService.alerta('La categoría ya existe');
        }
      });
      if( !exist ) {
        this.nuevaCategoria.id_categoria = null;
        this.nuevaCategoria.id_categoria_negocio = null;
        this.nuevaCategoria.tipo_categoria = 1;
        const enviar = {
          id_negocio: this.negocioTO.id_negocio,
          id_proveedor: this.datosUsuario.proveedor.id_proveedor,
          categoria: this.nuevaCategoria
        };
        this.sercicioNegocio.agregarCategoria(enviar).subscribe(
          response => {
            const cat = response;
            cat.servicios = [];
            this.listaVista.push(cat);
            this.nuevaCategoria = {
              activo: 1,
              nombre: '',
              id_categoria: null,
              id_categoria_negocio: null,
              tipo_categoria: 1
            }
            this.agregarClas = false;
            this.blnNuevaCategoria = false;
          },
          error => {
            console.error(error);
          }, () => {
            this.notificacionService.exito('Se agrego la categoría con éxito');
          }
        );
      }
    }
  }

  get obtenerServicios() {

    if (this.listaVista != undefined && this.listaVista !== null) {
      let total = 0;
      this.listaVista.forEach(it => {
        if (it.activo && it.servicios !== undefined) {
          it.servicios.forEach(ser => {
            if (ser.existencia) {
              total++;
            }
          });
        }
      });

      return total;
    } else {
      return 0;
    }
  }

  async modalClasificacion(item) {
    const modal = await this.modalController.create({
      component: ModalClasificacionComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        modalEditarCat:  JSON.parse(JSON.stringify(item)),
        datosNegocio: this.datosNegocio,
        listaVista: this.listaVista
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.buscarDatos();
      this.sercicioNegocio.obtenerNumMaxServicios().subscribe(
        respuesta => {
          this.maximoServicios = respuesta.data;
        },
        error => {
          this.notificacionService.error(error);
          this.maximoServicios = 0;
        }
      );
    }
  }

  eliminarCat(item) {
    this.editarCategoria = JSON.parse(JSON.stringify(item));
    this.editarCategoria.nombreActual = item.nombre;
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: `Estas seguro de que deseas eliminar la categoria: ${this.editarCategoria.nombreActual}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarCategoria();
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarCategoria() {

    this.banderaGuardar = true;
    this.editarCategoria.id_proveedor = this.datosNegocio.idProveedor;
    this.editarCategoria.id_negocio = this.datosNegocio.id_negocio;
    this.sercicioNegocio.eliminarCategoria(this.editarCategoria).subscribe(
      repsuesta => {

        if (repsuesta.code === 200) {
          const indexCat = this.listaVista.findIndex(cat => cat.id_categoria === this.editarCategoria.id_categoria);
          this.listaVista.splice(indexCat, 1);

          this.notificacionService.exito('Se eliminó la categoría con éxito');
        } else {
          this.notificacionService.error(repsuesta.message);
        }
      },
      error => {
        this.notificacionService.error('Ocurrio un error al eliminar la categoría, intenta más tarde');
      }, () => {
        this.banderaGuardar = false;
      }
    );
  }

  public mostrarProductos(item) {
    this.listaServicios = item;
    console.log(item);
    console.log(this.listaVista);
    this.mostrarListaServicios = !this.mostrarListaServicios;
  }

  public agregarProductos() {
    this.mostrarListaServicios = !this.mostrarListaServicios;
    this.agregarServicio = true;
    this.categoriaSeleccionada = this.listaVista;
    this.servicioNuevo = new DtosMogoModel();
    this.blnformMobile = true;
    this.isEdicion = false;
    this.opcion = 1;
  }

  public crearProducto(form: NgForm) {
    if ( form.invalid ) {
      return Object.values( form.controls ).forEach( control => {
        if (control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( con => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      if ( this.opcion === 2) {
        this.blnEditando = true;
        this.indexModificar = this.servicioNuevo.index;
        this.servicioE = this.servicioNuevo;
        this.actualizar(this.servicioNuevo);
      }
      if( this.opcion === 1 ) {
        this.agregar(this.listaServicios);
      }
    }
  }

  agregar(item) {

    const cat = {
      id_categoria: item.id_categoria,
      nombre: item.nombre,
      id_categoria_negocio: item.id_categoria_negocio,
    }
    this.servicioNuevo.categoria = cat;
    this.servicioNuevo.id_categoria = item.id_categoria;
    this.blnEditando = false;
    this.setNegocioProducto();
    this.guardarProducto();
  }

  setNegocioProducto() {
    this.servicioNuevo.negocio.idNegocio = this.datosNegocio.id_negocio;
    this.servicioNuevo.negocio.nombre = this.negocioTO.nombre_comercial;
    this.servicioNuevo.negocio.dirección = this.datosNegocio.domicilio.id_domicilio;
    this.servicioNuevo.negocio.logo = this.negocioTO.url_logo;
  }

  guardarProducto() {
    if (this.servicioNuevo.nombre === undefined
      || this.servicioNuevo.nombre === null
      || this.servicioNuevo.nombre === '') {
      this.notificacionService.error('El nombre es requerido para guardar el producto');
      return;
    }

    if (this.servicioNuevo.descripcion === undefined
      || this.servicioNuevo.descripcion === null
      || this.servicioNuevo.descripcion === '') {
      this.notificacionService.error('La descripción es requerida para guardar el producto');
      return;
    }

    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);
    
    if (this.blnEditando) {
      datosAEnviar.servicios[this.indexModificar] = this.servicioNuevo;
    } else {
      this.servicioNuevo.nombre_categoria1 = this.servicioNuevo.categoria.nombre;
      datosAEnviar.servicios.push(this.servicioNuevo);
    }
    this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
      response => {
        console.log(response);
        this.buscarCategoriasProductos();
        this.datosNegocio = response.data;
        this.listaVista.map(item => {
          if (item.id_categoria === this.servicioNuevo.id_categoria) {
            this.servicioNuevo = this.datosNegocio.servicios[this.datosNegocio.servicios.length - 1];
            this.servicioNuevo.index = this.datosNegocio.servicios.length - 1;

            // @ts-ignore
            this.servicioNuevo.editar = false;
            item.servicios.push(this.servicioNuevo);
          }
        });
      },
      error => {

      }, () => {
        this.banderaGuardar = false;
        this.regresarLista();
      }
    );
  }

  public subirArchivo(event) {
    this.subir_imagen_cuadrada(event);
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
            if (width === 400 &&  height === 400) {
              this.procesando_img = true;
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                  data => {
                    file_64 = data;
                    const imagen = new ArchivoComunModel();
                    imagen.nombre_archivo = this.utilscls.convertir_nombre(file_name);
                    imagen.archivo_64 = file_64;
                    this.servicioNuevo.imagen = imagen;
                    this.procesando_img = false;
                    this.blnImgCuadrada = false;
                  }
                );
              } else {
                this.notificacionService.alerta('archivo pesado');
              }
            }else{
              this.maintainAspectRatio = true;
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.tipoImagen = 1;
              this.fileChangeEvent(event);
              this.abrirModalImagen();
            }
          };
        };
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async abrirModalImagen() {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'actualTo': this.servicioNuevo,
        'imageChangedEvent': this.imageChangedEvent,
        'maintainAspectRatio': this.maintainAspectRatio,
        'resizeToWidth': this.resizeToWidth,
        'resizeToHeight': this.resizeToHeight,
        'tipoImagen': this.tipoImagen,
         'blnImgCuadrada': this.blnImgCuadrada,
        'blnImgRectangulo' : this.blnImgRectangulo,
        'blnImgPoster': this.blnImgPoster,
        'procesando_img': this.procesando_img
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != null) {
    	const imagen = new ArchivoComunModel();
      imagen.nombre_archivo = data.nombre_archivo;
      imagen.archivo_64 = data.data;

    	if(this.tipoImagen === 1) {
        this.servicioNuevo.imagen = imagen;
    	  this.blnImgCuadrada = false;
    	}
    }
  }

  editarRegistro(produc: any) {
    this.mostrarListaServicios = !this.mostrarListaServicios;
    this.agregarServicio = true;
    this.almacenarRegistro = JSON.parse(JSON.stringify(produc));
    produc.editar = true;
    this.servicioNuevo = produc;
    this.opcion = 2;
  }

  actualizar(produc) {
    
    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);

    if (this.blnEditando) {
      datosAEnviar.servicios[this.indexModificar] = this.servicioE;
    }
    this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
      repsuesta => {
        this.buscarCategoriasProductos();
        // this.modalReference.close();
        this.datosNegocio = repsuesta.data;
        if (repsuesta.code === 402) {
          this.notificacionService.alerta(repsuesta.message);
        }
        // this.armarListaVista();
        this.listaVista.map(item => {
          if (this.servicioE.id_categoria === item.id_categoria) {
            item.servicios.map(p => {
              if (p.index === this.servicioE.index) {
                p = this.servicioE;
              }
            });
          }
        });

        produc.editar = false
        this.indexModificar = undefined;
        this.blnEditando = false;
        this.blnformMobile = false;
      },
      error => {
        console.error(error);
      }, () => {
        this.banderaGuardar = false;
        this.notificacionService.exito('Se actualizo correctamente el producto');
        this.regresarLista();
      }
    );
  }

}

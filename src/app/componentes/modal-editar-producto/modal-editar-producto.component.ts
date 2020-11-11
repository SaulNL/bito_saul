import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilsCls } from '../../utils/UtilsCls';
import { ArchivoComunModel } from '../../Modelos/ArchivoComunModel';
import { FormGroup } from '@angular/forms';
import { DtosMogoModel } from '../../Modelos/DtosMogoModel';
import { DatosNegocios } from '../../Modelos/DatosNegocios';
import { NegocioService } from '../../api/negocio.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { GeneralServicesService } from '../../api/general-services.service';
import { RecorteImagenComponent } from '../../components/recorte-imagen/recorte-imagen.component';

@Component({
  selector: 'app-modal-editar-producto',
  templateUrl: './modal-editar-producto.component.html',
  styleUrls: ['./modal-editar-producto.component.scss'],
  providers: [
    UtilsCls
  ]
})
export class ModalEditarProductoComponent implements OnInit {

  @Input() public lista: any;
  @Input() public datosNegocio: any;
  @Input() public listaVista: any;
  @Input() public negicio: any;
  @Input() public opcion: number;
  private fileImgGaleria: FileList;
  public blnNuevaCategoria: boolean;
  private blnEditando: boolean;
  private indexModificar: number;
  public productoE: DtosMogoModel;
  public banderaGuardar: boolean;
  public blnformMobile: boolean;
  public listaCategorias: any;
  public nombreActual: string;
  public procesando_img: boolean;
  public blnImgCuadrada: boolean;
  public maintainAspectRatio: boolean = false;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public tipoImagen: number = 0;
  public imageChangedEvent: any = '';
  public blnImgRectangulo: boolean;
  public blnImgPoster: boolean;

  constructor(
    public modalController: ModalController,
    private utilscls: UtilsCls,
    private sercicioNegocio: NegocioService,
    public notificacionService: ToadNotificacionService,
    private generalServicio: GeneralServicesService,
  ) {
    this.blnNuevaCategoria = false;
    this.blnEditando = false;
    this.productoE = new DtosMogoModel();
    this.blnformMobile = false;
    this.listaCategorias = [];
  }

  ngOnInit() {
    this.nombreActual = this.lista.nombre;
    this.blnImgCuadrada = true;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      lista : this.lista
    });
  }

  public guardar(form: NgForm) {
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
        this.indexModificar = this.lista.index;
        this.productoE = this.lista;
        this.actualizar(this.lista);
      }
      if( this.opcion === 1 ) {
        this.agregar(this.listaVista);
      }
    }
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
                    this.lista.imagen = imagen;
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
        'actualTo': this.lista,
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
        this.lista.imagen = imagen;
    	  this.blnImgCuadrada = false;
    	}
    }
  }

  verificarExistenCambios() {
    let cambiosProductos = false;

    if (this.lista.nombre !== undefined && this.lista.nombre !== null && this.lista.nombre.trim() !== '') {
      cambiosProductos = true;
    }

    if (this.lista.precio !== undefined && this.lista.precio !== null && this.lista.precio !== '') {
      cambiosProductos = true;
    }

    if (this.lista.existencia !== undefined && this.lista.existencia !== null && this.lista.existencia) {
      cambiosProductos = true;
    }

    if (this.lista.descripcion !== undefined && this.lista.descripcion !== null && this.lista.descripcion.trim() !== '') {
      cambiosProductos = true;
    }

    if (this.lista.imagen.archivo_64 !== undefined && this.lista.imagen.archivo_64 !== null && this.lista.imagen.archivo_64.trim() !== '') {
      cambiosProductos = true;
    }

    if (this.blnNuevaCategoria || this.blnEditando) {
      cambiosProductos = true;
    }
  }

  actualizar(produc) {
    
    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);

    if (this.blnEditando) {
      datosAEnviar.productos[this.indexModificar] = this.productoE;
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
          if (this.productoE.id_categoria === item.id_categoria) {
            item.productos.map(p => {
              if (p.index === this.productoE.index) {
                p = this.productoE;
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
        this.dismiss();
      }
    );
  }

  buscarCategoriasProductos() {
    this.listaCategorias = [];
    this.generalServicio.obtenerListaCategopriasProducto(this.negicio.id_categoria_negocio, 0).subscribe(
      respuesta => {
        this.listaCategorias = respuesta.data;
        // console.info(this.listaCategorias);
      },
      error => {
        this.notificacionService.error(error);
      }
    );
  }

  guardarByForm(event: any) {
    this.agregar(this.listaVista);
  }

  agregar(item) {

    const cat = {
      id_categoria: item.id_categoria,
      nombre: item.nombre,
      id_categoria_negocio: item.id_categoria_negocio,
    }
    this.lista.categoria = cat;
    this.lista.id_categoria = item.id_categoria;
    this.blnEditando = false;
    this.setNegocioProducto();
    this.guardarProducto();
  }

  setNegocioProducto() {
    this.lista.negocio.idNegocio = this.datosNegocio.id_negocio;
    this.lista.negocio.nombre = this.negicio.nombre_comercial;
    this.lista.negocio.dirección = this.datosNegocio.domicilio.id_domicilio;
    this.lista.negocio.logo = this.negicio.url_logo;
  }

  guardarProducto() {
    if (this.lista.nombre === undefined
      || this.lista.nombre === null
      || this.lista.nombre === '') {
      this.notificacionService.error('El nombre es requerido para guardar el producto');
      return;
    }

    if (this.lista.descripcion === undefined
      || this.lista.descripcion === null
      || this.lista.descripcion === '') {
      this.notificacionService.error('La descripción es requerida para guardar el producto');
      return;
    }

    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);

    if (this.blnEditando) {
      datosAEnviar.productos[this.indexModificar] = this.lista;
    } else {
      this.lista.nombre_categoria1 = this.lista.categoria.nombre;
      datosAEnviar.productos.push(this.lista);
    }
    this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
      repsuesta => {
        this.buscarCategoriasProductos();
        this.datosNegocio = repsuesta.data;
        this.blnformMobile = false;
        // this.armarListaVista();
        this.notificacionService.exito('Se guardó el producto con éxito');
        this.indexModificar = undefined;
        this.blnEditando = false;
        this.lista = new DtosMogoModel();
      },
      error => {

      }, () => {
        this.banderaGuardar = false;
        this.verificarExistenCambios();
        this.dismiss();
      }
    );
  }

}

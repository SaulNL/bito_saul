import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NegocioService } from '../../../../api/negocio.service';
import { DatosNegocios } from '../../../../Modelos/DatosNegocios';
import { UtilsCls } from '../../../../utils/UtilsCls';
import { ArchivoComunModel } from  '../../../../Modelos/ArchivoComunModel';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { ModalClasificacionComponent } from '../../../../componentes/modal-clasificacion/modal-clasificacion.component';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ModalProductosComponent } from '../../../../componentes/modal-productos/modal-productos.component';
import { isNull } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-mis-productos-servicios',
  templateUrl: './mis-productos-servicios.page.html',
  styleUrls: ['./mis-productos-servicios.page.scss'],
})
export class MisProductosServiciosPage implements OnInit {

  public negocioTO: NegocioModel;
  public iden: number;
  public datos: any;
  public carta: SafeUrl;
  public loader: boolean;
  public datosNegocio: DatosNegocios;
  private datosUsuario: any;
  public listaVista: any;
  public loadPdf: boolean;
  private fileImgGaleria: FileList;
  public productoTags: Array<string>;
  public agregarClas: boolean;
  public maximoProductos: number;
  public editarCategoria: any;
  public banderaGuardar: boolean;
  public nuevaCategoria: any;
  public blnNuevaCategoria: boolean;
  public mostrarListaProductos: boolean;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private sercicioNegocio: NegocioService,
    private sanitizer: DomSanitizer,
    private utilscls: UtilsCls,
    private notificacionService: ToadNotificacionService,
    public modalController: ModalController,
    public alertController: AlertController
    ) {
      this.carta = null;
      this.listaVista = [];
      this.productoTags = [];
      this.blnNuevaCategoria = false;
    }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.mostrarListaProductos = false;
        this.agregarClas = false;
        this.loadPdf = false;
        this.loader = false;
        this.datosUsuario = JSON.parse(localStorage.getItem('u_data'));
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO  = this.datos.info;
        this.buscarDatos();
        this.sercicioNegocio.obtenerNumMaxProductos(this.negocioTO.id_negocio).subscribe(
          respuesta => {
            this.maximoProductos = respuesta.data;
          },
          error => {
            this.notificacionService.error(error);
            this.maximoProductos = 0;
          }
        );
      }
    });
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Agregar nueva clasificación",
          role: "save",
          handler: () => {
            //
          },
        },
        {
          text: "Guardar",
          role: "save",
          handler: () => {
            //
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }

  datosProductosServicios(tre){
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    
   let all = {
     inden: this.iden,
      info: this.negocioTO,
       pys: tre
      };

    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/mis-productos-servicios/datos-productos-servicios"], {
      queryParams: { special: navigationExtras },
    });
  }

  private buscarDatos() {
    this.loader = true;
    this.sercicioNegocio.buscarProductosServios(this.negocioTO.id_negocio, 0).subscribe(
      repsuesta => {
        this.datosNegocio = repsuesta.data;
        this.productoTags = this.datosNegocio.productoTags;
        if (this.datosNegocio === undefined || this.datosNegocio === null || this.datosNegocio._id === undefined) {
          this.datosNegocio = new DatosNegocios();
          this.datosNegocio.domicilio = this.negocioTO.det_domicilio;
          this.datosNegocio.id_negocio = this.negocioTO.id_negocio;
          this.datosNegocio.idProveedor = this.datosUsuario.proveedor.id_proveedor;
          this.sercicioNegocio.guardarProductoServio(this.datosNegocio).subscribe(
            repsuesta => {
              this.datosNegocio = repsuesta.data;
            },
            error => {
            }
          );
        }
        this.loader = false;
        this.listaVista = repsuesta.data.categorias !== undefined ? repsuesta.agrupados : [];
        // this.armarListaVista();
        if (this.datosNegocio.cartaProducto !== undefined && this.datosNegocio.cartaProducto !== null && this.datosNegocio.cartaProducto !== '') {
          this.carta = this.cleanURL(this.datosNegocio.cartaProducto);
          console.log(this.carta, 'al iniciar');
        }else {
          this.carta = null;
        }
      },
      error => {
        this.loader = false;
      }
    );
  }

  cleanURL(oldURL ): SafeUrl {
    return   this.sanitizer.bypassSecurityTrustResourceUrl(oldURL);
  }

  public subirCarta(event) {
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
        this.datosNegocio.cartaProducto = archivo;
        this.guardarDatos();
      }
    );
    } else {
      this.notificacionService.alerta('El archivo sobrepasa los 3 MB');
    }
  }

  guardarDatos() {
    if (this.datosNegocio.cartaProducto.archivo_64 !== undefined){
      this.loadPdf = true;
    }
    this.sercicioNegocio.guardarProductoServio(this.datosNegocio).subscribe(
      repsuesta => {
        this.datosNegocio = repsuesta.data;
        if ( this.datosNegocio.cartaProducto !== undefined && this.datosNegocio.cartaProducto !== null && this.datosNegocio.cartaProducto !== '') {
          this.carta = this.cleanURL(this.datosNegocio.cartaProducto);
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

  eliminarCarta() {
    (document.getElementById('imagenCarta') as HTMLInputElement).value = '';
    this.carta =  null;
    this.datosNegocio.cartaProducto = '';
    this.guardarDatos();
  }

  agregarTags(tags: string[]) {
    this.productoTags = tags;
    this.datosNegocio.productoTags = this.productoTags;
    this.guardarDatos();
  }

  agregarClasificacion() {
    this.agregarClas = true;
  }

  get obtenerProductos() {
    if (this.listaVista !== undefined && this.listaVista !== null) {
      let total = 0;
      this.listaVista.forEach(it => {
        if (it.activo && it.productos !== undefined) {
          it.productos.forEach(p => {
            if (p.existencia) {
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
        modalEditarCat: item,
        datosNegocio: this.datosNegocio,
        listaVista: this.listaVista
      }
    });
    return await modal.present();
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
            this.eliminarCategoria()
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
      if (this.nuevaCategoria !== undefined) {
        let exist = false;
        this.listaVista.map(item => {
          if (item.id_categoria === this.nuevaCategoria.id_categoria) {
            exist = true;
          }
        });
        if (!exist) {
          const cat = {
            id_categoria: null,
            nombre: this.nuevaCategoria,
            id_categoria_negocio: this.negocioTO.id_categoria_negocio,
            tipo_categoria: 0
          }
          const enviar = {
            id_negocio: this.negocioTO.id_negocio,
            id_proveedor: this.datosUsuario.proveedor.id_proveedor,
            categoria: cat
          };
          this.sercicioNegocio.agregarCategoria(enviar).subscribe(
            respuesta => {
              const cat = respuesta;
              cat.productos = [];
              this.listaVista.push(cat);
              this.nuevaCategoria = undefined;
              this.blnNuevaCategoria = false;
            },
            error => {
              console.error(error);
            }, () => {
              this.notificacionService.exito('Se agrego correctamente la categoria');
            }
          );
        } else {
          this.notificacionService.alerta('Usted ya cuenta con esta clasificación');
        }
      } else {
        this.notificacionService.alerta('No a seleccionado una clasificación');
      }
    }
  }

  public mostrarProductos(item) {
    this.mostrarListaProductos = !this.mostrarListaProductos;
    this.modalProductos(item);
  }

  async modalProductos(item) {
    const modal = await this.modalController.create({
      component: ModalProductosComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        lista: item,
        datosNegocio: this.datosNegocio,
        listaVista: this.listaVista,
        negicio: this.negocioTO
      }
    });
    return await modal.present();
  }

  

}

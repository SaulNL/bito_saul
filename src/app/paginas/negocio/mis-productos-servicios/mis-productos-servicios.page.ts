import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NegocioService } from "../../../api/negocio.service";
import { DatosNegocios } from "../../../Modelos/DatosNegocios";
import { UtilsCls } from "../../../utils/UtilsCls";
import { ArchivoComunModel } from "../../../Modelos/ArchivoComunModel";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { ModalController } from "@ionic/angular";
import { ModalClasificacionComponent } from "../../../componentes/modal-clasificacion/modal-clasificacion.component";
import { AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { DtosMogoModel } from "../../../Modelos/DtosMogoModel";
import { RecorteImagenComponent } from "../../../components/recorte-imagen/recorte-imagen.component";
import { GeneralServicesService } from "../../../api/general-services.service";

@Component({
  selector: "app-mis-productos-servicios",
  templateUrl: "./mis-productos-servicios.page.html",
  styleUrls: ["./mis-productos-servicios.page.scss"],
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
  public ocultar: boolean;
  public listaProductos: any;
  public agregarProducto: boolean;
  public productoNuevo: DtosMogoModel;
  private categoriaSeleccionada: any;
  public blnformMobile: boolean;
  private isEdicion: boolean;
  public procesando_img: boolean;
  public blnImgCuadrada: boolean;
  public maintainAspectRatio: boolean = false;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public tipoImagen: number = 0;
  public imageChangedEvent: any = "";
  public blnImgRectangulo: boolean;
  public blnImgPoster: boolean;
  public opcion: number;
  private blnEditando: boolean;
  private indexModificar: number;
  public productoE: DtosMogoModel;
  public listaCategorias: any;
  public almacenarRegistro: any;
  public tamano: any;
  public segtamano: any;
  public static: any;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private sercicioNegocio: NegocioService,
    private sanitizer: DomSanitizer,
    private utilscls: UtilsCls,
    private notificacionService: ToadNotificacionService,
    public modalController: ModalController,
    public alertController: AlertController,
    private generalServicio: GeneralServicesService
  ) {
    this.carta = null;
    this.listaVista = [];
    this.productoTags = [];
    this.blnNuevaCategoria = false;
    this.blnformMobile = false;
    this.blnEditando = false;
    this.productoE = new DtosMogoModel();
    this.listaCategorias = [];
    this.productoNuevo = new DtosMogoModel();
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.ocultar = false;
        this.mostrarListaProductos = false;
        this.agregarProducto = false;
        this.agregarClas = false;
        this.loadPdf = false;
        this.loader = false;
        this.datosUsuario = JSON.parse(localStorage.getItem("u_data"));
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO = this.datos.info;
        this.blnImgCuadrada = true;
        this.nuevaCategoria = {
          activo: 1,
          nombre: "",
          id_categoria: null,
          id_categoria_negocio: null,
          tipo_categoria: 0,
        };
        this.buscarDatos();
        this.buscarCategoriasProductos();
        this.sercicioNegocio
          .obtenerNumMaxProductos(this.negocioTO.id_negocio)
          .subscribe(
            (respuesta) => {
              this.maximoProductos = respuesta.data;
            },
            (error) => {
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
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  private buscarDatos() {
    this.loader = true;
    let valores;
    switch (this.iden) {
      case 1:
        valores = 0;
        break;
      case 2:
        valores = 1;
        break;
    }
    this.sercicioNegocio
      .buscarProductosServios(this.negocioTO.id_negocio, valores)
      .subscribe(
        (repsuesta) => {
          this.datosNegocio = repsuesta.data;

          if (this.iden === 2) {
            this.productoTags = this.datosNegocio.serviciosTags;
          }
          if (this.iden === 1) {
            this.productoTags = this.datosNegocio.productoTags;
          }

          if (
            this.datosNegocio === undefined ||
            this.datosNegocio === null ||
            this.datosNegocio._id === undefined
          ) {
            this.datosNegocio = new DatosNegocios();
            this.datosNegocio.domicilio = this.negocioTO.det_domicilio;
            this.datosNegocio.id_negocio = this.negocioTO.id_negocio;
            this.datosNegocio.idProveedor =
              this.datosUsuario.proveedor.id_proveedor;
            this.sercicioNegocio
              .guardarProductoServio(this.datosNegocio)
              .subscribe(
                (repsuesta) => {
                  this.datosNegocio = repsuesta.data;
                  this.static = repsuesta.data;
                },
                (error) => {}
              );
          }
          this.loader = false;
          this.listaVista =
            repsuesta.data.categorias !== undefined ? repsuesta.agrupados : [];
          // this.armarListaVista();
          if (this.iden === 1) {
            if (
              this.datosNegocio.cartaProducto !== undefined &&
              this.datosNegocio.cartaProducto !== null &&
              this.datosNegocio.cartaProducto !== ""
            ) {
              this.carta = this.cleanURL(this.datosNegocio.cartaProducto);
            } else {
              this.carta = null;
            }
          }
          if (this.iden === 2) {
            if (
              this.datosNegocio.cartaServicio !== undefined &&
              this.datosNegocio.cartaServicio !== null &&
              this.datosNegocio.cartaServicio !== ""
            ) {
              this.carta = this.cleanURL(this.datosNegocio.cartaServicio);
            } else {
              this.carta = null;
            }
          }
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  cleanURL(oldURL): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(oldURL);
  }

  public subirCarta(event) {
    this.fileImgGaleria = event.target.files;
    const fileName = this.fileImgGaleria[0].name;
    const file = this.fileImgGaleria[0];
    if (file.size < 3145728) {
      let file64: any;
      const utl = new UtilsCls();
      utl.getBase64(file).then((data) => {
        file64 = data;
        const archivo = new ArchivoComunModel();
        archivo.nombre_archivo = this.utilscls.convertir_nombre(fileName);
        archivo.archivo_64 = file64;
        switch (this.iden) {
          case 1:
            this.datosNegocio.cartaProducto = archivo;
            break;
          case 2:
            this.datosNegocio.cartaServicio = archivo;
            break;
        }
        this.guardarDatos();
      });
    } else {
      this.notificacionService.alerta("El archivo sobrepasa los 3 MB");
    }
  }

  guardarDatos() {
    if (this.datosNegocio.cartaProducto.archivo_64 !== undefined) {
      this.loadPdf = true;
    }
    if (this.datosNegocio.cartaServicio.archivo_64 !== undefined) {
      this.loadPdf = true;
    }
    this.sercicioNegocio.guardarProductoServio(this.datosNegocio).subscribe(
      (repsuesta) => {
        this.datosNegocio = repsuesta.data;
        switch (this.iden) {
          case 1:
            if (
              this.datosNegocio.cartaProducto !== undefined &&
              this.datosNegocio.cartaProducto !== null &&
              this.datosNegocio.cartaProducto !== ""
            ) {
              this.carta = this.cleanURL(this.datosNegocio.cartaProducto);
            }
            if (this.loadPdf) {
              this.notificacionService.exito("Carta guardada con éxito");
            }
            break;
          case 2:
            if (
              this.datosNegocio.cartaServicio !== undefined &&
              this.datosNegocio.cartaServicio !== null &&
              this.datosNegocio.cartaServicio !== ""
            ) {
              this.carta = this.cleanURL(this.datosNegocio.cartaServicio);
            }
            if (this.loadPdf) {
              this.notificacionService.exito("Carta guardada con éxito");
            }
            break;
        }
      },
      (error) => {},
      () => {
        this.loadPdf = false;
      }
    );
  }

  eliminarCarta() {
    (document.getElementById("imagenCarta") as HTMLInputElement).value = "";
    this.carta = null;
    switch (this.iden) {
      case 1:
        this.datosNegocio.cartaProducto = "";
        break;
      case 2:
        this.datosNegocio.cartaServicio = "";
        break;
      default:
        break;
    }

    this.guardarDatos();
  }

  agregarTags(tags: string[]) {
    this.productoTags = tags;
    if (this.iden === 2) {
      this.datosNegocio.serviciosTags = tags;
    }
    if (this.iden === 1) {
      this.datosNegocio.productoTags = tags;
    }
    this.guardarDatos();
  }

  agregarClasificacion() {
    this.agregarClas = true;
  }

  async modalClasificacion(item) {
    const modal = await this.modalController.create({
      component: ModalClasificacionComponent,
      cssClass: "my-custom-class",
      componentProps: {
        modalEditarCat: item,
        datosNegocio: this.datosNegocio,
        listaVista: this.listaVista,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.buscarDatos();
      this.sercicioNegocio
        .obtenerNumMaxProductos(this.negocioTO.id_negocio)
        .subscribe(
          (respuesta) => {
            this.maximoProductos = respuesta.data;
          },
          (error) => {
            this.notificacionService.error(error);
            this.maximoProductos = 0;
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
      header: "Eliminar",
      message: `Estas seguro de que deseas eliminar la categoria: ${this.editarCategoria.nombreActual}?`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Aceptar",
          handler: () => {
            this.eliminarCategoria();
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarCategoria() {
    this.banderaGuardar = true;
    this.editarCategoria.id_proveedor = this.datosNegocio.idProveedor;
    this.editarCategoria.id_negocio = this.datosNegocio.id_negocio;
    this.sercicioNegocio.eliminarCategoria(this.editarCategoria).subscribe(
      (repsuesta) => {
        if (repsuesta.code === 200) {
          const indexCat = this.listaVista.findIndex(
            (cat) => cat.id_categoria === this.editarCategoria.id_categoria
          );
          this.listaVista.splice(indexCat, 1);

          this.notificacionService.exito("Se eliminó la categoría con éxito");
        } else {
          this.notificacionService.error(repsuesta.message);
        }
      },
      (error) => {
        this.notificacionService.error(
          "Ocurrio un error al eliminar la categoría, intenta más tarde"
        );
      },
      () => {
        this.banderaGuardar = false;
      }
    );
  }

  public guardar(form: NgForm) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((con) => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      let exist = false;
      this.listaVista.map((item) => {
        if (item.nombre === this.nuevaCategoria.nombre) {
          exist = true;
          this.notificacionService.alerta("La categoría ya existe");
        }
      });
      if (!exist) {
        this.nuevaCategoria.id_categoria = null;
        this.nuevaCategoria.id_categoria_negocio = null;
        switch (this.iden) {
          case 1:
            this.nuevaCategoria.tipo_categoria = 0;
            break;
          case 2:
            this.nuevaCategoria.tipo_categoria = 1;
            break;
          default:
            break;
        }
        const enviar = {
          id_negocio: this.negocioTO.id_negocio,
          id_proveedor: this.datosUsuario.proveedor.id_proveedor,
          categoria: this.nuevaCategoria,
        };
        this.sercicioNegocio.agregarCategoria(enviar).subscribe(
          (response) => {
            const cat = response;
            cat.productos = [];
            cat.servicios = [];
            this.listaVista.push(cat);
            this.nuevaCategoria = {
              activo: 1,
              nombre: "",
              id_categoria: null,
              id_categoria_negocio: null,
              tipo_categoria: null,
            };
            this.agregarClas = false;
            this.blnNuevaCategoria = false;
          },
          () => {},
          () => {
            this.notificacionService.exito("Se agrego la categoría con éxito");
          }
        );
      }
    }
  }

  public mostrarProductos(item) {
    this.listaProductos = item;
    this.mostrarListaProductos = !this.mostrarListaProductos;
  }

  public agregarProductos() {
    this.mostrarListaProductos = !this.mostrarListaProductos;
    this.agregarProducto = true;
    this.categoriaSeleccionada = this.listaVista;
    this.productoNuevo = new DtosMogoModel();
    this.blnformMobile = true;
    this.isEdicion = false;
    this.opcion = 1;
    this.productoNuevo = JSON.parse(JSON.stringify(this.productoNuevo));
  }

  public regresarLista() {
    this.mostrarListaProductos = true;
    this.agregarProducto = false;
  }

  public subir_imagen_cuadrada(imgen: any) {
    const event = imgen.event;
    const position = imgen.posicion;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this.utilscls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 400 && height === 400) {
              this.procesando_img = true;
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then((data) => {
                  file_64 = data;
                  const imagen = new ArchivoComunModel();
                  if (file_name != null) {
                    imagen.nombre_archivo =
                      this.utilscls.convertir_nombre(file_name) + ".jpg";
                    imagen.archivo_64 = file_64;
                  }
                  this.productoNuevo.imagen[position] = imagen;
                  this.procesando_img = false;
                  this.blnImgCuadrada = false;
                });
              } else {
                this.notificacionService.alerta("archivo pesado");
              }
            } else {
              this.maintainAspectRatio = true;
              this.resizeToWidth = 400;
              this.resizeToHeight = 400;
              this.tipoImagen = 1;
              this.fileChangeEvent(event);
              const fName = archivo.name + ".jpg";
              const newImagen = {
                i: img.src,
                p: position,
                fn: fName,
              };
              this.abrirModalImagen(
                newImagen,
                this.resizeToWidth,
                this.resizeToHeight
              );
            }
          };
        };
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async abrirModalImagen(img, width, heigh) {
    const evento = img.i;
    const position = img.p;
    const fileName = img.fn;
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: "my-custom-class",
      componentProps: {
        actualTo: this.productoNuevo,
        imageChangedEvent: evento,
        maintainAspectRatio: this.maintainAspectRatio,
        resizeToWidth: width,
        resizeToHeight: heigh,
        tipoImagen: this.tipoImagen,
        blnImgCuadrada: this.blnImgCuadrada,
        blnImgRectangulo: this.blnImgRectangulo,
        blnImgPoster: this.blnImgPoster,
        procesando_img: this.procesando_img,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != null) {
      const imagen = new ArchivoComunModel();
      imagen.nombre_archivo = this.utilscls.convertir_nombre(fileName);
      imagen.archivo_64 = data.data;

      if (this.tipoImagen === 1) {
        this.productoNuevo.imagen[position] = imagen;
        this.blnImgCuadrada = false;
      }
    }
  }

  public crearProducto(form: NgForm) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((con) => con.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    } else {
      if (this.opcion === 2) {
        this.blnEditando = true;
        this.indexModificar = this.productoNuevo.index;
        this.productoE = this.productoNuevo;

        this.actualizar(this.productoNuevo);
      }
      if (this.opcion === 1) {
        this.agregar(this.listaProductos);
      }
    }
  }

  agregar(item) {
    const cat = {
      id_categoria: item.id_categoria,
      nombre: item.nombre,
      id_categoria_negocio: this.negocioTO.id_categoria_negocio,
    };
    this.productoNuevo.categoria = cat;
    this.productoNuevo.id_categoria = item.id_categoria;
    this.blnEditando = false;
    this.setNegocioProducto();
    this.guardarProducto();
  }

  setNegocioProducto() {
    this.productoNuevo.negocio.idNegocio = this.datosNegocio.id_negocio;
    this.productoNuevo.negocio.nombre = this.negocioTO.nombre_comercial;
    this.productoNuevo.negocio.direccion =
      this.datosNegocio.domicilio.id_domicilio;
    this.productoNuevo.negocio.logo = this.negocioTO.url_logo;
  }

  guardarProducto() {
    if (
      this.productoNuevo.nombre === undefined ||
      this.productoNuevo.nombre === null ||
      this.productoNuevo.nombre === ""
    ) {
      this.notificacionService.error(
        "El nombre es requerido para guardar el producto"
      );
      return;
    }

    if (
      this.productoNuevo.descripcion === undefined ||
      this.productoNuevo.descripcion === null ||
      this.productoNuevo.descripcion === ""
    ) {
      this.notificacionService.error(
        "La descripción es requerida para guardar el producto"
      );
      return;
    }

    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);
    this.productoNuevo.imagen = JSON.parse(
      JSON.stringify(this.productoNuevo.imagen)
    );
    // this.productoNuevo.imagen.nombre_archivo = this.productoNuevo.nombre + ".jpg";
    this.productoNuevo.negocio.direccion =
      this.negocioTO.det_domicilio.id_domicilio;
    if (this.blnEditando) {
      datosAEnviar.productos[this.indexModificar] = this.productoNuevo;
    } else {
      this.productoNuevo.nombre_categoria1 =
        this.productoNuevo.categoria.nombre;
      switch (this.iden) {
        case 1:
          datosAEnviar.productos.push(this.productoNuevo);
          break;
        case 2:
          datosAEnviar.servicios.push(this.productoNuevo);
          break;
      }
    }
    switch (this.iden) {
      case 1:
        if (datosAEnviar.productos.length > 1) {
          this.tamano = datosAEnviar.productos.length - 1;
        } else {
          if (datosAEnviar.productos.length > 0) {
            this.tamano = datosAEnviar.productos.length - 1;
          } else {
            this.tamano = 0;
          }
        }
        break;
      case 2:
        if (datosAEnviar.servicios.length > 1) {
          this.tamano = datosAEnviar.servicios.length - 1;
        } else {
          if (datosAEnviar.servicios.length > 0) {
            this.tamano = datosAEnviar.servicios.length - 1;
          } else {
            this.tamano = 0;
          }
          //this.segtamano = 0;
        }
        break;
    }

    switch (this.iden) {
      case 1:
        this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
          (repsuesta) => {
            this.buscarCategoriasProductos();
            this.datosNegocio = repsuesta.data;
            this.blnformMobile = false;
            this.listaVista.map((item) => {
              if (item.id_categoria === this.productoNuevo.id_categoria) {
                this.productoNuevo =
                  this.datosNegocio.productos[
                    this.datosNegocio.productos.length - 1
                  ];
                this.productoNuevo.index =
                  this.datosNegocio.productos.length - 1;
                // @ts-ignore
                this.productoNuevo.editar = false;
                item.productos.push(this.productoNuevo);
              }
            });
            this.notificacionService.exito("Se guardó el producto con éxito");
            this.indexModificar = undefined;
            this.blnEditando = false;
            this.productoNuevo = new DtosMogoModel();
          },
          (error) => {},
          () => {
            this.banderaGuardar = false;
            this.regresarLista();
          }
        );
        break;

      case 2:
        this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
          (repsuesta) => {
            this.buscarCategoriasProductos();
            this.datosNegocio = repsuesta.data;
            this.blnformMobile = false;
            this.listaVista.map((item) => {
              if (item.id_categoria === this.productoNuevo.id_categoria) {
                this.productoNuevo =
                  this.datosNegocio.servicios[
                    this.datosNegocio.servicios.length - 1
                  ];
                this.productoNuevo.index =
                  this.datosNegocio.servicios.length - 1;
                // @ts-ignore
                this.productoNuevo.editar = false;
                item.servicios.push(this.productoNuevo);
              }
            });
            this.notificacionService.exito("Se guardó el producto con éxito");
            this.indexModificar = undefined;
            this.blnEditando = false;
            this.productoNuevo = new DtosMogoModel();
          },
          (error) => {},
          () => {
            this.banderaGuardar = false;
            this.regresarLista();
          }
        );

        break;
      default:
        this.notificacionService.alerta(
          "Por favor seleccione productos o servicios"
        );
        break;
    }
  }

  buscarCategoriasProductos() {
    this.listaCategorias = [];
    this.generalServicio
      .obtenerListaCategopriasProducto(this.negocioTO.id_categoria_negocio, 0)
      .subscribe(
        (respuesta) => {
          this.listaCategorias = respuesta.data;
          this.nuevaCategoria.nombre = "";
          this.nuevaCategoria.id_categoria = null;
        },
        (error) => {
          this.notificacionService.error(error);
        }
      );
  }

  editarRegistro(produc: any) {
    this.mostrarListaProductos = !this.mostrarListaProductos;
    this.agregarProducto = true;
    this.almacenarRegistro = JSON.parse(JSON.stringify(produc));
    produc.editar = true;
    this.productoNuevo = produc;
    if (!Array.isArray(this.productoNuevo.imagen)) {
      const imagens = this.productoNuevo.imagen;
      this.productoNuevo.imagen = [imagens];
    }
    this.opcion = 2;
  }

  actualizar(produc) {
    this.banderaGuardar = true;
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);

    if (this.blnEditando) {
      switch (this.iden) {
        case 1:
          datosAEnviar.productos[this.indexModificar] = this.productoE;
          break;
        case 2:
          datosAEnviar.servicios[this.indexModificar] = this.productoE;
          break;
      }
    }

    this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
      (repsuesta) => {
        
        this.buscarCategoriasProductos();
        // this.modalReference.close();
        this.datosNegocio = repsuesta.data;
        if (repsuesta.code === 402) {
          this.notificacionService.alerta(repsuesta.message);
        }
        /* this.armarListaVista();
        this.listaVista.map((item) => {
          if (this.productoE.id_categoria === item.id_categoria) {
            item.productos.map((p) => {
              if (p.index === this.productoE.index) {
                p = this.productoE;
              }
            });
          }
        });
*/
        produc.editar = false;
        this.indexModificar = undefined;
        this.blnEditando = false;
        this.blnformMobile = false;
      },
      () => {},
      () => {
        this.banderaGuardar = false;
        this.notificacionService.exito(
          "Se actualizo correctamente el producto"
        );
        this.regresarLista();
      }
    );
  }
  public subirImgs(event: any) {
    this.subirArchivo(event);
  }

  public subirArchivo(event: any) {
    this.subir_imagen_cuadrada(event);
  }
  public updateBorrado(event: any) {
    this.productoNuevo.imagen.splice(event.po, 1);
  }

  public isService(type: number) {
    return type == 2 ? "servicio" : "producto";
  }

  public isServices(type: number) {
    return type == 2 ? "servicios" : "productos";
  }

  public isMayusculaService(type: number) {
    return type == 2 ? "Servicios" : "Productos";
  }
  public obtenerTotalProductosOrServicios(type: number) {
    let selection: Array<DtosMogoModel>;
    if (type == 2) {
      selection = Array.isArray(this.datosNegocio.servicios)
        ? this.datosNegocio.servicios
        : [];
      return this.obtenerTotal(selection);
    }
    
    let productosActivos = [];
    this.datosNegocio.productos.forEach((element) => {
      if (element.existencia) {
        productosActivos.push(element);
      }
    });
    selection = Array.isArray(this.datosNegocio.productos)
      ? productosActivos
      : [];
    return this.obtenerTotal(selection);
  }

  private obtenerTotal(lista: Array<DtosMogoModel>) {
    return lista.length;
  }

  eliminarProducto(produc: any, tipo:string) {
    let datosAEnviar: DatosNegocios;
    const datos = JSON.stringify(this.datosNegocio);
    datosAEnviar = JSON.parse(datos);

    if (tipo === 'producto') {
      let productIndex = datosAEnviar.productos.map(function(e) { return e.idProducto; }).indexOf(produc.idProducto);
      datosAEnviar.productos.splice(productIndex, 1);
    }else{
      let productIndex = datosAEnviar.servicios.map(function(e) { return e.idProducto; }).indexOf(produc.idProducto);
      datosAEnviar.servicios.splice(productIndex, 1);
    }
    
       this.sercicioNegocio.guardarProductoServio(datosAEnviar).subscribe(
        (respuesta) => {
          if (respuesta.code === 200) {
            if (tipo === 'producto') {
              this.notificacionService.exito(
                "Se eliminó correctamente el producto " + produc.nombre, 
              );
            }else{
              this.notificacionService.exito(
                "Se eliminó correctamente el servicio " + produc.nombre
              );
            }
            location.reload();
          } else {
            this.notificacionService.error(respuesta.message);
          }
        },
        (error) => {
          this.notificacionService.error(
            "Ocurrio un error al eliminar el producto, por favor inténtalo más tarde"
          );
        },
    );
  }

  async alertProductDelete(produc: any, tipo:string) {
    const alert = await this.alertController.create({
      header: "Eliminar",
      message: tipo === 'producto' ?  `¿Estás seguro de que deseas eliminar el producto: ${produc.nombre}?` :  `¿Estás seguro de que deseas eliminar el servicio: ${produc.nombre}?`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Aceptar",
          handler: () => {
            this.eliminarProducto(produc,tipo);
          },
        },
      ],
    });

    await alert.present();
  }
}
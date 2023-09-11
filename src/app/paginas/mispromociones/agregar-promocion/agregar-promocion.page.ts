import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PromocionesModel } from "../../../Modelos/PromocionesModel";
import { NegocioModel } from "../../../Modelos/NegocioModel";
import { NgForm } from "@angular/forms";
import { NegocioService } from "../../../api/negocio.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { PublicacionesModel } from "../../../Modelos/PublicacionesModel";
import { UtilsCls } from "../../../utils/UtilsCls";
import { ArchivoComunModel } from "../../../Modelos/ArchivoComunModel";
import { RecorteImagenComponent } from "../../../components/recorte-imagen/recorte-imagen.component";
import { ModalController, Platform } from "@ionic/angular";
import { PromocionesService } from "../../../api/promociones.service";
import { LoadingController } from "@ionic/angular";
import { CatOrganizacionesModel } from './../../../Modelos/CatOrganizacionesModel';
import { DiasPromoArray } from '../../../Modelos/DiasPromoArray';

import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { HorarioNegocioModel } from '../../../Modelos/HorarioNegocioModel';
import { HorarioPromocionModel } from '../../../Modelos/HorarioPromocionModel';
import { GeneralServicesService } from './../../../api/general-services.service';
import {FilePicker} from "@capawesome/capacitor-file-picker";

@Component({
  selector: "app-agregar-promocion",
  templateUrl: "./agregar-promocion.page.html",
  styleUrls: ["./agregar-promocion.page.scss"],
  providers: [UtilsCls],
})
export class AgregarPromocionPage implements OnInit {
  public seleccionTo: PromocionesModel;
  public tags = [];
  public lstNegocios: Array<NegocioModel>;
  public loaderNegocios = false;
  public usuario: any;
  public publicacion: PublicacionesModel;
  public descripcionString: string;
  public btnCambiarImagen: boolean;
  public blnImgCuadrada: boolean;
  public blnVideoCuadrada: boolean;
  public procesando_img: boolean;
  public procesando_vid: boolean;
  public maintainAspectRatio: boolean = false;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public tipoImagen: number = 0;
  public imageChangedEvent: any = "";
  public blnImgRectangulo: boolean;
  public blnImgPoster: boolean;
  public loader: any;
  public msj: "Guardando";
  public msj2: "Cargando video...";
  @ViewChild("inputTarjeta") inputTar: ElementRef;
  @ViewChild("inputBanner") inputBanner: ElementRef;
  public loading;
  lstTipoPromo: any;
  mostrarAnuncio: boolean;
  mostrarPromo: boolean;
  tipoPromo: any;
  tipoPlazaAfi: any;
  promo: number;
  lstAlcance: any;
  validoPara: { id: number; name: string; }[];
  plzAflcn: number;
  public lstPlazas: Array<CatOrganizacionesModel>;
  public lstDias: Array<DiasPromoArray>;
  lstPlaza: any;
  lstOrg: any[];
  verSeleccion: any;
  lstPlazaOrg: any[];
  public data: any;
  public loaderGuardar = false;
  public nuevoRegistro = false;
  loaderVideo = false;
  nombre_video: any;
  public mostrarVideo: boolean;
  base64Video = null;
  negocioVip: any;
  vip: any;
  public arreglo: any;
  public caracteristicasNegocios: { id_caracteristica: number; cantidad: number; }[];
  public banderaPromocionCompleta: boolean;
  public editAnuncioPromocion: boolean;

  public diasArray = [
    { id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null },
    { id: 2, dia: 'Martes', horarios: [], hi: null, hf: null },
    { id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null },
    { id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null },
    { id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null },
    { id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null },
    { id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null },
  ];
  productos: any;
  cats: any[];
  prod: any[];
  tipoAplicable: number;
  namePlzAfl: any;
  ngModelPlzAfl: any;
  public horarioini: string;
  public blnActivaHoraF: boolean;
  public horariofin: string;
  public blnActivaDias: boolean;
  public nuevoHorario: HorarioPromocionModel;
  public blnActivaHorario: boolean;
  public posicionHorario: number;
  public isIos: boolean;
  producto: number[] = [];
  categoria: string[] = [];
  tipoPromocion: any;
  tipoCate: string;
  tipoProd: string;
  org: number[] = [];
  lstAfl: any;
  arrayDias: any;
  lstConvenio: any[];
  tipoCvn: string[];
  plz: number[] = [];
  cnv: number[] = [];
  v: any;
  logs: string[] = [];
  currentFood = undefined;
  permitirGuardarAnuncioPromo: boolean;

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private _negocio_service: NegocioService,
    public _notificacionService: ToadNotificacionService,
    private _utils_cls: UtilsCls,
    public modalController: ModalController,
    private _router: Router,
    private _promociones_service: PromocionesService,
    public loadingController: LoadingController,
    private platform: Platform,
    private generalService: GeneralServicesService
  ) {
    this.isIos = this.platform.is("ios");
    this.seleccionTo = new PromocionesModel();
    this.publicacion = new PublicacionesModel();
    this.loader = false;
    this.blnActivaHoraF = true;
    this.blnActivaDias = true;
    this.blnActivaHorario = true;
    this.nuevoHorario = new HorarioPromocionModel();
    this.banderaPromocionCompleta = true;
    this.mostrarVideo = true;
    this.editAnuncioPromocion = false;
  }

  ngOnInit() {
    this.obtenerCatOrganizaciones();
    this.obtenerCaPlazas();
    this.obtenerConvenio();
    this.route.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.seleccionTo = JSON.parse(params.special);
      }
    });
    if (this.seleccionTo.id_promocion === 0) {
      this.seleccionTo.id_promocion = null;
    } else {
      this.obtenerCaracteristicasPromocion(this.seleccionTo.id_negocio);
    }

    if (this.seleccionTo.id_alcance_promocion != null || this.seleccionTo.id_alcance_promocion != undefined) {
      if (this.seleccionTo.id_alcance_promocion === 2) {
        this.productosCategoriasObtener();
      }
      if (this.seleccionTo.id_alcance_promocion === 3) {
        this.categoriasProductos();
      }
    }

    if (this.seleccionTo.productos.length > 0) {

      for (const item of this.seleccionTo.productos) {

        if (item.id_producto != null) {
          this.producto.push(item.id_producto);
        }
        if (item.id_categoria != null) {
          this.categoria.push(item.id_categoria);
        }

        this.seleccionTo.categorias = this.categoria;

        this.seleccionTo.productos = this.producto;

      }
    }

    for (const item of this.seleccionTo.organizaciones) {
      this.org.push(item.id_organizacion);
    }

    for (const item of this.seleccionTo.plazas) {
      this.plz.push(item.id_organizacion);
    }

    for (const item of this.seleccionTo.convenios) {
      this.cnv.push(item.id_organizacion);
    }


    if (this.seleccionTo.dias.length > 0) {
      this.arrayDias = this.seleccionTo.dias;
      this.seleccionTo.dias = [];
      this.arrayDias.forEach(dia => {
        let diasArr = dia.dias.split(',');
        const dias = {
          "id_horario_promocion": dia.id_horario_promocion,
          "dias": diasArr,
          "hora_inicio": dia.hora_inicio,
          "hora_fin": dia.hora_fin,
          "activo": true,
        }

        this.seleccionTo.dias.push(dias);
      });

    }

    this.usuario = JSON.parse(localStorage.getItem("u_data"));
    this.btnCambiarImagen = true;
    this.blnImgCuadrada = true;
    this.blnImgCuadrada = !(this.seleccionTo.url_imagen !== "");
    this.blnImgRectangulo = !(this.seleccionTo.url_imagen_banner !== "");
    this.blnImgPoster = !(this.seleccionTo.url_imagen_poster !== "");
    this.buscarNegocios();
    this.obtenerTipoPromocion();
    this.obtenerAlcancePromocion();

    if (this.seleccionTo.id_tipo_promocion === '') {
      this.seleccionTo.id_tipo_promocion = 1;
    } else {
      //cuando se edita la promocion
      this.seleccionTo.id_tipo_promocion = this.seleccionTo.id_tipo_promocion;
      this.editAnuncioPromocion = true;
    }
    this.base64Video = null;
    this.seleccionTo.video = null;
    this.seleccionTo.id_promocion == null ? this.nuevoRegistro = true : this.nuevoRegistro = false;
  }

  public agregarTags(event) {
    this.tags = event;
  }
  pushLog(msg) {
    this.logs.unshift(msg);
  }

  buscarNegocios() {
    this.loaderNegocios = true;
    this._negocio_service
      .misNegocios(this.usuario.proveedor.id_proveedor)
      .subscribe(
        (response) => {
          this.lstNegocios = response.data;
          this.loaderNegocios = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  obtenerTipoPromocion() {

    this._negocio_service
    this._promociones_service.obtenerTipoPromocion()
      .subscribe(
        (response) => {
          this.lstTipoPromo = response.data?.list_cat_tipo_promocion;
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  obtenerAlcancePromocion() {

    this._promociones_service.obtenerAlcancePromocion()
      .subscribe(
        (response) => {
          this.lstAlcance = response.data?.list_cat_alcance_promocion;

          if (this.seleccionTo.id_alcance_promocion != null) {
            this.lstAlcance.forEach((element) => {
              if (element.id_alcance_promocion == this.seleccionTo.id_alcance_promocion) {
                this.tipoPromocion = element.nombre;
              }

            });
          }
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  decripcionSelect() {
    if (this.publicacion.id_negocio.toString() !== "undefined") {
      this.lstNegocios.map((valor) => {
        if (valor.id_negocio === Number(this.publicacion.id_negocio)) {
          this.descripcionString = valor.descripcion;
        }
      });
    } else {
      this.descripcionString = undefined;
    }
  }

  async seleccionarVideo(){
    const result = await FilePicker.pickVideos({
      multiple: false,
      readData: true
    });

    if (result.files[0].size < 100000000) {
      let video = new ArchivoComunModel();
      video.nombre_archivo = result.files[0].name;
      video.archivo_64 = `data:video/png;base64,${result.files[0].data}`
      this.base64Video = video;
      this.seleccionTo.video = this.base64Video;
    }else{
      this._notificacionService.alerta("Lo sentimos, el archivo supera los 100 MB");
    }
  }

  /*
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
          this.seleccionTo.video = this.base64Video;
        });
      } else {
        this._notificacionService.alerta("Lo sentimos, el archivo supera los 100 MB");
      }
    }
  }
   */

  /*
  public subir_imagen_cuadrada(event) {
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this._utils_cls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          const img = new Image();
          const file_name = archivo.name;
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;

            if (width === 500 && height === 500) {
              this.procesando_img = true;

              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then((data) => {
                  file_64 = data;
                  const imagen = new ArchivoComunModel();
                  imagen.nombre_archivo =
                    this._utils_cls.convertir_nombre(file_name);

                  imagen.archivo_64 = file_64;
                  this.seleccionTo.imagen = imagen;

                  this.procesando_img = false;
                  this.blnImgCuadrada = false;
                });
              } else {
                this._notificacionService.alerta("archivo pesado");
              }
            } else {
              this.maintainAspectRatio = true;
              this.resizeToWidth = 500;
              this.resizeToHeight = 500;
              this.tipoImagen = 1;
              this.fileChangeEvent(event);
              this.abrirModalImagen(
                img.src,
                file_name,
                this.resizeToWidth,
                this.resizeToHeight
              );
            }
          };
        };
      }
    }
  }

   */

  async subir_imagen_cuadrada() {
    const result = await FilePicker.pickImages({
      multiple: false,
      readData: true
    })
    if (result.files && result.files.length) {
      for (const archivo of result.files) {
        const img = new Image();
        const file_name = archivo.name;
        img.src = `data:image/png;base64,${archivo.data}`
        img.onload = () => {

          this.maintainAspectRatio = true;
          this.resizeToWidth = 500;
          this.resizeToHeight = 500;
          this.tipoImagen = 1;
          this.fileChangeEvent(result);
          this.abrirModalImagen(
              img.src,
              file_name,
              this.resizeToWidth,
              this.resizeToHeight
          );
        };
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async abrirModalImagen(evento, nombre, wi, he) {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: "my-custom-class",
      componentProps: {
        actualTo: this.seleccionTo,
        imageChangedEvent: evento,
        maintainAspectRatio: this.maintainAspectRatio,
        resizeToWidth: wi,
        resizeToHeight: he,
        tipoImagen: this.tipoImagen,
        blnImgCuadrada: this.blnImgCuadrada,
        blnImgRectangulo: this.blnImgRectangulo,
        blnImgPoster: this.blnImgPoster,
        procesando_img: this.procesando_img,
        procesando_vid: this.procesando_vid,
        blnVideoCuadrada: this.blnVideoCuadrada,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      const imagen = new ArchivoComunModel();
      imagen.nombre_archivo = nombre;
      imagen.archivo_64 = data.data;
      if (this.tipoImagen === 1) {
        this.seleccionTo.imagen = imagen;
        this.blnImgCuadrada = false;
      }
      if (this.tipoImagen === 2) {
        this.seleccionTo.imagenBanner = imagen;
        this.blnImgRectangulo = false;
      }
      if (this.tipoImagen === 3) {
        this.seleccionTo.video = imagen;
        this.blnVideoCuadrada = false;
      }
    }
  }

  async subir_imagen_rectangulo() {
    const result = await FilePicker.pickImages({
      multiple: false,
      readData: true
    })

    if (result.files && result.files.length) {
      for (const archivo of result.files) {
        const img = new Image();
        const file_name = archivo.name;
        img.src = `data:image/png;base64,${archivo.data}`
        img.onload = () => {
          this.maintainAspectRatio = true;
          this.resizeToWidth = 1500;
          this.resizeToHeight = 300;
          this.tipoImagen = 2;
          this.fileChangeEvent(result);
          this.abrirModalImagen(
              img.src,
              file_name,
              this.resizeToWidth,
              this.resizeToHeight
          );
        };
      }
    }
  }

  regresar() {
    this._router.navigate(["/tabs/home/promociones"]);
  }

  public guardar(form?: NgForm) {
    this.loader = true;
    this.msj = 'Guardando';
    if (
      (this.seleccionTo.imagen === undefined ||
        this.seleccionTo.imagen === null ||
        this.seleccionTo.imagen === "") &&
      (this.seleccionTo.url_imagen === undefined ||
        this.seleccionTo.url_imagen === "") &&
      (this.seleccionTo.imagenBanner === undefined ||
        this.seleccionTo.imagenBanner === null,
        this.seleccionTo.imagenBanner === "") &&
      (this.seleccionTo.url_imagen_banner === undefined ||
        this.seleccionTo.url_imagen_banner === "") &&
      (this.seleccionTo.imagenBanner === "")
    ) {
      this.loader = false;
      this._notificacionService.error(
        "Se requiere al menos una imagen, ya sea la tarjeta o el banner"
      );
      this.inputTar.nativeElement.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (form.valid && this.seleccionTo.id_negocio > 0) {
      this.seleccionTo.id_proveedor = this.usuario.proveedor.id_proveedor;
      this.seleccionTo.tags = this.tags;
      if (this.seleccionTo.tags.length === 0) {
        this.seleccionTo.tags = [];
      }

      this._promociones_service.guardar(this.seleccionTo).subscribe(
        (response) => {
          if (this._utils_cls.is_success_response(response.code)) {
            form.resetForm();
            this._router.navigate(["/tabs/home/promociones"], {
              queryParams: { special: true },
            });
            this._notificacionService.exito("Se guardó correctamente");
            this.base64Video = null;
            this.loader = false;
          }
        },
        (error) => {
          this.loader = false;
          this._notificacionService.error(error);
        }
      );
    } else {
      this.loader = false;
      this._notificacionService.error(
        "Es requerido que llenes todos los campos obligatorios"
      );
    }
    this.obtenerTipoPromocion();
    this.obtenerAlcancePromocion();
  }

  cancelarEdicion() {
    this._router.navigate(["/tabs/home/promociones"]);
  }

  cambiarTipo(evento) {
    this.seleccionTo.id_tipo_promocion = parseInt(evento.detail.value);
    if (this.seleccionTo.id_tipo_promocion === 2) {
      this.promo = 2;
    }
    if (this.seleccionTo.id_tipo_promocion === 1) {
      this.promo = 1;
    }
  }



  promoAplicable(event) {
    this.tipoAplicable = parseInt(event.detail.value);
    if (this.tipoAplicable === 2) {
      this.productosCategoriasObtener();
    }
    if (this.tipoAplicable === 3) {
      this.categoriasProductos();
    }
  }

  public obtenerCaPlazas() {
    this._negocio_service.obtenerPlazas()
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.lstPlazas = Object.values(response.data);

            if (this.seleccionTo.plazas.length > 0) {
              this.lstPlazas.forEach((element) => {
                this.seleccionTo.plazas.forEach((elements) => {
                  if (element.id_organizacion == elements.id_organizacion) {
                    this.seleccionTo.plazas = this.plz;
                  }
                });
              });
            }

          } else {
            this.lstPlazas = [];
          }
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  public obtenerConvenio() {
    this._negocio_service.obtenerConvenio().subscribe((response) => {

      if (response.code === 200) {

        this.lstConvenio = Object.values(response.data);

        if (this.seleccionTo.convenios.length > 0) {
          this.lstConvenio.forEach((element) => {
            this.seleccionTo.convenios.forEach((elements) => {
              if (element.id_organizacion == elements.id_organizacion) {
                this.seleccionTo.convenios = this.cnv;
              }
            });
          });
        }

      } else {
        this.lstConvenio = [];
      }

    },
      (error) => {
        this._notificacionService.error(error);
      }
    );
  }

  public obtenerCatOrganizaciones() {
    this._negocio_service.obtenerCatOrganizaciones()
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.lstAfl = Object.values(response.data);

            if (this.seleccionTo.organizaciones.length > 0) {
              this.lstAfl.forEach((element) => {
                this.seleccionTo.organizaciones.forEach((elements) => {
                  if (element.id_organizacion == elements.id_organizacion) {
                    this.seleccionTo.organizaciones = this.org;
                  }
                });
              });
            }


          } else {
            this.lstPlazas = [];
          }
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }


  public productosCategoriasObtener() {

    this._promociones_service.obtenerDetalleDeNegocio(this.seleccionTo.id_negocio).subscribe(
      response => {
        if (response.code === 200 && response.agrupados != null) {
          this.productos = response.agrupados;
          this.cats = [];
          this.prod = [];

          if (this.productos !== undefined) {
            let id = this.productos.map((x: any) => {

              x.productos.map(y => {
                this.prod.push({
                  idProducto: y.idProducto,
                  nombre: y.nombre
                })
                if (this.producto.length > 0) {
                  this.prod.forEach((element) => {
                    this.producto.forEach((elements) => {
                      if (element.idProducto == elements) {
                        this.tipoProd = element.nombre;


                      }
                    });
                  });
                }
              })

            })
          };
        }
      },
      error => {
        this._notificacionService.error(error);
      },);
  }

  public categoriasProductos() {
    this._promociones_service.obtenerDetalleDeNegocio(this.seleccionTo.id_negocio).subscribe(
      response => {
        if (response.code === 200 && response.agrupados != null) {
          const productos = response.agrupados;

          const cats = [];
          this.prod = [];

          if (productos !== undefined) {
            productos.map(catprod => {

              if (catprod.activo) {

                const productos3 = [];
                catprod.productos.map(pro => {
                  if (pro.existencia) {
                    productos3.push(pro);
                  }
                });
                catprod.productos = productos3;
                if (productos3.length > 0) {
                  this.prod.push({
                    id_categoria: catprod.id_categoria,
                    nombre: catprod.nombre
                  });


                  if (this.categoria.length > 0) {
                    this.prod.forEach((element) => {
                      this.categoria.forEach((elements) => {
                        if (element.id_categoria == elements) {
                          this.tipoCate = element.nombre;


                        }
                      });
                    });
                  }

                }
              }

            });
          }
        }

      },
      error => {
        this._notificacionService.error(error);
      },);
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

  diasSeleccionado(evento) {
    if (evento.detail.value.length > 0) {
      this.nuevoHorario.dias = evento.detail.value;
      this.blnActivaHorario = false;
    } else {
      this.blnActivaHorario = true;
    }
  }

  cancelarHorario() {
    this.horarioini = '';
    this.horariofin = '';
    this.nuevoHorario = new HorarioPromocionModel;
  }

  agregarHorario() {
    if (this.nuevoHorario.id_horario_promocion === null || this.nuevoHorario.id_horario_promocion === undefined) {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format("HH:mm");
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format("HH:mm");
      this.nuevoHorario.activo = true;
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.id_horario_promocion = null;
      if (this.posicionHorario >= 0) {
        this.seleccionTo.dias[this.posicionHorario] = this.nuevoHorario;
      } else {
        this.seleccionTo.dias.push(this.nuevoHorario);
      }
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioPromocionModel;
      this.posicionHorario = -1;
    } else {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format("HH:mm");
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format("HH:mm");
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.dias = this.nuevoHorario.dias;
      this.nuevoHorario.activo = true;
      this.seleccionTo.dias[this.posicionHorario] = this.nuevoHorario;
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioPromocionModel;
      this.posicionHorario = -1;
    }
  }

  editarHorario(horario, i) {
    let objFecha = new Date();
    this.posicionHorario = i;
    this.horarioini = moment.parseZone(objFecha).format("YYYY-MM-DDT" + horario.hora_inicio + ":ssZ");
    this.horariofin = moment.parseZone(objFecha).format("YYYY-MM-DDT" + horario.hora_fin + ":ssZ");
    this.nuevoHorario.dias = horario.dias;
    this.nuevoHorario.id_horario_promocion = horario.id_horario_promocion;
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

  eliminarHorario(i) {
    this.seleccionTo.dias.splice(i, 1);
  }

  obtenerCaracteristicasPromocion(idNegocio: number) {
    this.mostrarVideo = true;
    this.banderaPromocionCompleta = true;
    this.permitirGuardarAnuncioPromo = true;

    this.obtenerPromoYanunciosCreados(idNegocio);

    this.generalService.features(idNegocio)
      .subscribe(
        (response) => {
          this.caracteristicasNegocios = response.data;

          for (const feature of this.caracteristicasNegocios) {

            if (feature.id_caracteristica === 3) this.banderaPromocionCompleta = false;

            if (feature.id_caracteristica === 6) this.mostrarVideo = false;

          }
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  obtenerPromoYanunciosCreados(idNegocio: number) {
    this._promociones_service
      .obtenerNumeroAnunciosYPromoPorNegocio(idNegocio)
      .subscribe(
        (response) => {
          let data = response.data;
          if (data.numPromocionesRegistradas < data.numPromocionesPermitidas) {
            this.permitirGuardarAnuncioPromo = false;
          } else {

            this._notificacionService.toastInfo(
              `El negocio llego al limite de anuncios y/o promociones registrados (${data.numPromocionesRegistradas} / ${data.numPromocionesPermitidas}), actualiza tu plan de suscripción`);
          }
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

}

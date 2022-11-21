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
import { ModalController } from "@ionic/angular";
import { PromocionesService } from "../../../api/promociones.service";
import { LoadingController } from "@ionic/angular";
import { CatOrganizacionesModel } from './../../../Modelos/CatOrganizacionesModel';
import { DiasPromoArray } from '../../../Modelos/DiasPromoArray';

import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { HorarioNegocioModel } from '../../../Modelos/HorarioNegocioModel';
import { HorarioPromocionModel } from '../../../Modelos/HorarioPromocionModel';

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
  @ViewChild("inputTarjeta") inputTar: ElementRef;
  @ViewChild("inputBanner") inputBanner: ElementRef;
  public loading;
  lstTipoPromo: any;
  mostrarAnuncio: boolean;
  mostrarPromo: boolean;
  tipoPromo: any;
  tipoPlazaAfi:any;
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
  public data:any;
 public video:any;
 public nombre_video;
 public arreglo: any;

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
  
  producto: number[] =[];
  categoria: string[] = [];
  tipoPromocion: any;
  tipoCate: string;
  tipoProd: string;
  org: number[] =[];
  lstAfl: any;
  arrayDias: any;
  lstConvenio: any[];
  tipoCvn: string[];
  plz: number[] = [];
  cnv: number[] = [];  
  
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
  ) {
    this.seleccionTo = new PromocionesModel();
    this.publicacion = new PublicacionesModel();
    this.loader = false;
    this.blnActivaHoraF = true;
    this.blnActivaDias = true;
    this.blnActivaHorario = true;
    this.nuevoHorario = new HorarioPromocionModel();
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
    }

    if(this.seleccionTo.id_alcance_promocion !=null || this.seleccionTo.id_alcance_promocion !=undefined){
      if (this.seleccionTo.id_alcance_promocion=== 2 ) {
        this.productosCategoriasObtener();
      }
      if (this.seleccionTo.id_alcance_promocion=== 3) {
        this.categoriasProductos();
      }
    }
    
    if(this.seleccionTo.productos.length>0){
      
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

    for( const item of this.seleccionTo.organizaciones){
      this.org.push(item.id_organizacion);
    }
    
    for( const item of this.seleccionTo.plazas){
      this.plz.push(item.id_organizacion);
    }
    
    for( const item of this.seleccionTo.convenios){
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
    this.blnVideoCuadrada = true;
    this.blnVideoCuadrada = !(this.seleccionTo.url_video !== "");
    this.blnImgRectangulo = !(this.seleccionTo.url_imagen_banner !== "");
    this.blnImgPoster = !(this.seleccionTo.url_imagen_poster !== "");
    this.buscarNegocios();
    this.obtenerTipoPromocion();
    this.obtenerAlcancePromocion();

    if(this.seleccionTo.id_tipo_promocion===''){
      this.seleccionTo.id_tipo_promocion =1;
    }else{
      this.seleccionTo.id_tipo_promocion = this.seleccionTo.id_tipo_promocion;
    }
    
  }

  public agregarTags(event) {
    this.tags = event;
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
          this.lstTipoPromo = response.data.list_cat_tipo_promocion;
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
          this.lstAlcance = response.data.list_cat_alcance_promocion;

          if (this.seleccionTo.id_alcance_promocion !=null) {
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
  public videoo($event:any) {
    let fileList: FileList = $event.target.files;
    this.data = {};
    if (fileList.length > 0) {
        let file: File = fileList[0];
        console.log('video seleccionado', file);
        console.log('video nombre', file.name);
        this.nombre_video=file.name;
        console.log('NOMBRE: ', file.name);
  
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = (loadEvent: any) => {
            console.log('video', myReader.result);
            this.data.video = myReader.result;
  
            this.data.type = file.type;
            console.log('video---', this.data.video);
        };
        myReader.readAsDataURL(file);
    }
  }
  public fileChangeListener($event) {
   
    for (const archivo of $event.target.files) {
     const reader = this._utils_cls.getFileReader();
     reader.readAsDataURL(archivo);
     reader.onload = () => {
       this.nombre_video = archivo.name;
       console.log("NOMBRE VIDEO- " + JSON.stringify(this.nombre_video));
   
    this.arreglo = JSON.parse(localStorage.getItem('u_sistema'));
      console.log("ARREGLO ", JSON.stringify(this.arreglo));
      
     ;
     let fileList: FileList = $event.target.files;
     this.data = {};
     if (fileList.length > 0) {
         let file: File = fileList[0];
       
         console.log('video seleccionado', file);
        // console.log("video selecionado" + JSON.stringify(file));
         this.seleccionTo.url_video=this.nombre_video;
         console.log("NOMBRE VIDEO: " + JSON.stringify(this.seleccionTo));
         this.video = true;
         this.seleccionTo.video = file;
         console.log("VIDEO FILE: " + JSON.stringify(this.seleccionTo));

         let myReader: FileReader = new FileReader();
         let that = this;
         myReader.onload = () => {
             console.log('video', myReader.result);
            
             this.data.video = myReader.result;
             this.data.type = file.type;
         };
         myReader.readAsDataURL(file);
         console.log("video selecionado2" + JSON.stringify(file));
 
       }
     } 

     }
   
 }
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
                  console.log("IMAGEN JAJA" + JSON.stringify(this.seleccionTo));
 
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

  public subir_video(event) {
    for (const archivo of event.target.files) {
      const reader = this._utils_cls.getFileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => {
        this.nombre_video = archivo.name;
        console.log("NOMBRE VIDEO- " + JSON.stringify(this.nombre_video));
      
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this._utils_cls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          const vid = new Image();
          const file_name = archivo.name;
          vid.src = reader.result as string;
          vid.onload = () => {
            height = vid.naturalHeight;
            width = vid.naturalWidth;

            if (width === 500 && height === 500) {
              this.procesando_vid = true;

              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then((data) => {
                  file_64 = data;
                  const video = new ArchivoComunModel();
                  video.nombre_archivo =
                    this._utils_cls.convertir_nombre(file_name);

                  video.archivo_64 = file_64;
                  this.seleccionTo.video = video;
                  console.log("VIDEO JAJA" + JSON.stringify(this.seleccionTo));
 
                  this.procesando_vid = false;
                  this.blnVideoCuadrada = false;
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
                vid.src,
                file_name,
                this.resizeToWidth,
                this.resizeToHeight
              );
            }
          };
        };
      }
    }
      }}
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
    }
  }

  public subir_imagen_rectangulo(event) {
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

            if (width === 1500 && height === 300) {
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
                  this.seleccionTo.imagenBanner = imagen;
                  this.procesando_img = false;
                  this.blnImgRectangulo = false;
                });
              } else {
                this._notificacionService.alerta("error de imagen");
              }
            } else {
              this.maintainAspectRatio = true;
              this.resizeToWidth = 1500;
              this.resizeToHeight = 300;
              this.tipoImagen = 2;
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

  public guardar(form: NgForm) {
    this.loader = true;
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
        this.seleccionTo.url_imagen_banner === "")
    ) {
      this.loader = false;
      this._notificacionService.error(
        "Se requiere al menos una imagen, ya sea la tarjeta o el banner"
      );
      this.inputTar.nativeElement.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (form.valid) {
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
            console.log("GUARDADO: " + JSON.stringify(this.seleccionTo));
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
    if (this.seleccionTo.id_tipo_promocion=== 2) {
      this.promo=2;
    }
    if (this.seleccionTo.id_tipo_promocion=== 1) {
        this.promo=1;
    }
  }

 
  
  promoAplicable(event){
    this.tipoAplicable = parseInt(event.detail.value);
    if (this.tipoAplicable=== 2  ) {
      this.productosCategoriasObtener();
    }
    if (this.tipoAplicable=== 3) {
      this.categoriasProductos();
    }
  }

  public obtenerCaPlazas() {
      this._negocio_service.obtenerPlazas()
        .subscribe(
          (response) => {
            if (response.code === 200) {
              this.lstPlazas= Object.values(response.data);
             
              if (this.seleccionTo.plazas.length >0) {
                this.lstPlazas.forEach((element) => {
                  this.seleccionTo.plazas.forEach((elements) => {
                    if (element.id_organizacion == elements.id_organizacion) {
                      this.seleccionTo.plazas=this.plz;
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
       
        if (this.seleccionTo.convenios.length >0) {
          this.lstConvenio.forEach((element) => {
            this.seleccionTo.convenios.forEach((elements) => {
              if (element.id_organizacion == elements.id_organizacion) {
                this.seleccionTo.convenios=this.cnv;
              }
            });
          });
        }
     
      }else {
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

              if (this.seleccionTo.organizaciones.length >0) {
                this.lstAfl.forEach((element) => {
                  this.seleccionTo.organizaciones.forEach((elements) => {
                    if (element.id_organizacion == elements.id_organizacion) {
                      this.seleccionTo.organizaciones=this.org;
                    }
                  });
                });
              }

             
            } else {
              this.lstPlazas= [];
            }
          },
          (error) => {
            this._notificacionService.error(error);
          }
        );
  }


  public productosCategoriasObtener(){
    
    this._promociones_service.obtenerDetalleDeNegocio(this.seleccionTo.id_negocio).subscribe(
      response => {
        if (response.code === 200 && response.agrupados != null) {
          this.productos = response.agrupados;
         this.cats = [];
         this.prod = [];

          if (this.productos !== undefined) {
            let id=this.productos.map((x:any) => {

                x.productos.map(y=> {
                  this.prod.push({
                    idProducto: y.idProducto,
                    nombre:y.nombre
                  })
                  if (this.producto.length >0) {
                    this.prod .forEach((element) => {
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
                    id_categoria:catprod.id_categoria,
                    nombre:catprod.nombre});


                    if (this.categoria.length >0) {
                      this.prod .forEach((element) => {
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
    this.seleccionTo.dias.splice(i,1);
  }


}

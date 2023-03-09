import { SolicitarCambioUrlComponent } from './../../../componentes/solicitar-cambio-url/solicitar-cambio-url.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ArchivoComunModel } from './../../../Modelos/ArchivoComunModel';
import { CatOrganizacionesModel } from './../../../Modelos/CatOrganizacionesModel';
import { ActivatedRoute } from '@angular/router';
import { NegocioModel } from '../../../Modelos/NegocioModel';
import { NegocioService } from '../../../api/negocio.service';
import { UtilsCls } from './../../../utils/UtilsCls';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from '../../../components/recorte-imagen/recorte-imagen.component';
import { ActionSheetController } from '@ionic/angular';
import { HorarioNegocioModel } from '../../../Modelos/HorarioNegocioModel';
import moment from 'moment';
import { CatLocalidadModel } from './../../../Modelos/CatLocalidadModel';
import { CatMunicipioModel } from './../../../Modelos/CatMunicipioModel';
import { CatEstadoModel } from './../../../Modelos/CatEstadoModel';
import { Map, tileLayer, marker, Marker, latLng } from 'leaflet';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
import { GeneralServicesService } from './../../../api/general-services.service';
import { LoadingController } from '@ionic/angular';
import { UbicacionMapa } from '../../../api/ubicacion-mapa.service';
import { CatDistintivosModel } from 'src/app/Modelos/CatDistintivosModel';
import { SeleccionarSucripcionComponent } from 'src/app/components/seleccionar-suscripcion/seleccionar-suscripcion.component';

@Component({
  selector: 'app-formulario-negocio',
  templateUrl: './formulario-negocio.page.html',
  styleUrls: ['./formulario-negocio.page.scss'],
})
export class FormularioNegocioPage implements OnInit {

  public segmentModel = 'informacion';
  public maximoProductos: number;
  public id_proveedor: number;
  public lstNegocios: Array<NegocioModel>;
  public totalProductosServicios: number;
  public mostrarListaProductos: boolean;
  public idNegocioMatriz: number;
  public listaVista: any;
  public listaProductos: any;
  public iden: number;
  public colorProductos: any;
  public negocioTO: any;
  public negtag: boolean;
  public negLugar: boolean;
  public listTipoNegocio: any;
  public listCategorias: any;
  public listaSubCategorias: any;
  public resizeToWidth = 0;
  public resizeToHeight = 0;
  private usuario: any;
  public entregas = [
    { id: true, respuesta: 'Si' },
    { id: false, respuesta: 'No' }
  ];
  public tags: string;
  public lugaresEntrega: string;
  public lstOrganizaciones: Array<CatOrganizacionesModel>;
  public lstDistintivos: Array<CatDistintivosModel>;
  public lstPlazas: Array<CatOrganizacionesModel>;
  public urlNegocioLibre = true;
  public controladorTiempo: any;
  public blnActivaEntregas: boolean;
  public diasArray = [
    { id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null },
    { id: 2, dia: 'Martes', horarios: [], hi: null, hf: null },
    { id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null },
    { id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null },
    { id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null },
    { id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null },
    { id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null },
  ];
  public metodosPago = [
    { id: 1, metodo: 'Transferencia Electrónica', value: null },
    { id: 2, metodo: 'Tajeta de Crédito', value: null },
    { id: 3, metodo: 'Tajeta de Débito', value: null },
    { id: 4, metodo: 'Efectivo', value: null }
  ];
  public copyPago = [];
  public loader: boolean;
  public negocioGuardar: any;
  public horarioini: string;
  public horariofin: string;
  public nuevoHorario: HorarioNegocioModel;
  public posicionHorario: number;
  public blnActivaHoraF: boolean;
  public blnActivaDias: boolean;
  public blnActivaHorario: boolean;
  public tipoNegoAux: any;
  public tipoGiroAux: any;
  public tipoSubAux: any;
  public tipoOrgAux: any;
  public tipoDistAux: any;
  public tipoPlzAux: any;
  public blnActivaNegocioFisico: boolean;
  public msj = 'Guardando';
  public valido: boolean;
  private marker: Marker<any>;
  map: Map;
  public latitud: any;
  public longitud: any;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public btnEstado: boolean;
  public btnMuncipio: boolean;
  public btnLocalidad: boolean;
  public estadoAux: any;
  public municiAux: any;
  public localiAux: any;
  public loadion: any;
  public cargadoMapa: any;
  public colorInfo: any;
  public colorDomicilio: any;
  public colorContacto: any;
  public lstConvenio: any;
  public tipoCnvn: any;
  public convenio_date: any;
  public cnvn_date: any;
  public dateObject: any;
 public seEstaClonando = false;
 public nombreAnterior: any;
 public direccionAnterior: any;
 public fotografiasArray: any[];
 public galeriaFull = false;
 public numeroFotos: number;
 public logo: any;
  convenioId: number;
  cnvn_fecha: any;
  dateFormat: any;
  convenio: any[];
  nameConvenio: any;
  loaderSubCategoria: boolean;
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };
  features10 = false;
  numeroFotosPermitidas: number;
  features12 = false;
  disabled: boolean;
  disabledPhoto: boolean;
  suscripciones: any;
  dsSuscrip: string;
  constructor(
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private negocioServico: NegocioService,
    private actionSheetController: ActionSheetController,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController,
    private _general_service: GeneralServicesService,
    public getCoordinatesMap: UbicacionMapa,
  ) {
    this.valido = false;
    this.maximoProductos = 0;
    this.totalProductosServicios = 0;
    this.idNegocioMatriz = 0;
    this.iden = 1;
    this.listaVista = [];
    this.listCategorias = [];
    this.listTipoNegocio = [];
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.negtag = false;
    this.negLugar = false;
    this.negocioGuardar = new NegocioModel();
    this.nuevoHorario = new HorarioNegocioModel();
    this.convenio = new Array();
    this.lstNegocios = [];
    this.blnActivaHoraF = true;
    this.blnActivaDias = true;
    this.blnActivaHorario = true;
    this.loader = false;
    this.latitud = 19.4166896;
    this.longitud = -98.1467336;
    this.btnEstado = false;
    this.btnMuncipio = true;
    this.btnLocalidad = true;
    this.loaderSubCategoria = true;
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
  }


  ngOnInit() {
    this.disabled = true;
    this.listaProductos = [];
    this.mostrarListaProductos = false;
    this.disabledPhoto = true;
    this.negocios();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.nuevoNegocio) {
        this.negocioTO = new NegocioModel();
        this.negocioTO.tags = [];
        this.negocioTO.lugares_entrega = [];
        this.obtenerFeatures(this.negocioTO.id_negocio);
        this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
        this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
        this.blnActivaNegocioFisico = this.negocioTO.tipo_negocio;
        // this.setearDireccion();
        this.fotografiasArray = this.negocioTO.fotografias;
        this.numeroFotos = this.fotografiasArray.length;
      }
      else if (params && params.clonar){
        this.seEstaClonando = true;
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        // this.negocioTO = new NegocioModel();
        const datos = JSON.parse(params.special);
        this.negocioTO = datos.info;
        this.obtenerFeatures(this.negocioTO.id_negocio);
        // this.buscarNegocio(this.negocioTO.id_negocio)
        this.fotografiasArray = this.negocioTO.fotografias;
        console.log('fotografiasArray####' + JSON.stringify(this.fotografiasArray));
        this.buscardatos();
        this.numeroFotos = this.fotografiasArray.length;
        if (this.numeroFotos >= this.numeroFotosPermitidas){
          this.galeriaFull = true;
        }
        this.nombreAnterior = this.negocioTO.nombre_comercial;
        this.direccionAnterior = this.negocioTO.det_domicilio;
        this.negocioGuardar = datos.pys;
        this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
        this.blnActivaNegocioFisico = this.negocioTO.tipo_negocio;
        if (this.negocioTO.lugares_entrega !== null) {
          this.negocioTO.lugares_entrega = this.negocioTO.lugares_entrega.filter(function(lugar) {
            return lugar !== '';
          });
        } else {
          this.negocioTO.lugares_entrega = null;
        }
      }
    });


    this.buscarNegocio(this.negocioTO.id_negocio);
    this.metodosPago = [
      { id: 1, metodo: 'Transferencia Electrónica', value: this.negocioTO.tipo_pago_transferencia },
      { id: 2, metodo: 'Tajeta de Crédito', value: this.negocioTO.tipo_pago_tarjeta_credito },
      { id: 3, metodo: 'Tajeta de Débito', value: this.negocioTO.tipo_pago_tarjeta_debito },
      { id: 4, metodo: 'Efectivo', value: this.negocioTO.tipo_pago_efectivo }
    ];
    this.setarPago();
    // this.cagarMapa();
    this.load_cat_estados();
    this.obtenerSuscripciones();
  }

    public buscardatos() {
        this.negocioServico.obtenerDetalleDeNegocio(this.negocioTO.id_negocio, 0, this.usuario.id_persona).subscribe(
            (repsuesta) => {
                const datosNegocio = repsuesta.data;
                let serviciosTags = [];
                let productoTags = [];
                if (this.iden === 2) {
                    serviciosTags = datosNegocio.serviciosTags;
                    this.negocioTO.tags = JSON.stringify(serviciosTags);
                }
                if (this.iden === 1) {
                    productoTags = datosNegocio.productoTags;
                    this.negocioTO.tags = JSON.stringify(productoTags);
                }
                this.listaVista = repsuesta.data.categorias !== undefined ? repsuesta.agrupados : [];
                this.listaVista.forEach(data => {
                    const cantidad = data.productos.length;
                    console.log("cantidadEnviada" + cantidad);
                    this.numerodeservicioproductos(cantidad);
                });
            },
            (error) => {
                this.loader = false;
            }
        );
    }
  setearDireccion() {
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    if (this.usuario != null) {
      this.negocioTO.det_domicilio = this.usuario.domicilio;
      this.negocioTO.det_domicilio.id_domicilio = null;
      this.negocioTO.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
      this.negocioTO.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;
      this.load_cat_estados();
    }
  }
  setarPago() {
    this.metodosPago.forEach(i => {
      if (i.value === 1) {
        this.copyPago.push(i);
      }
    });
  }
  async consumoSitioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Consumo en Sitio',
      message: 'Activa esta opción para que tus clientes realicen pedidos estando en tu establecimiento',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  async entregaSitioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Entrega en Sitio',
      message: ' Activa esta opción para que tus clientes realicen pedidos y pasen a recogerlos a tu establecimiento',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  async entregaDomicilioAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Entrega Domicilio',
      message: 'Activa esta opción para que tus clientes realicen pedidos y tú se los entregues a domicilio',
      buttons: ['Cerrar']
    });
    await alert.present();
  }

    public mostrarProductos(item) {
        this.listaProductos = item;
        if (this.validarvacio(item)){
            this.mostrarListaProductos = !this.mostrarListaProductos;
        }else {
           this.presentAlert('Productos-Categorias', 'La categoria seleccionada no cuenta con productos');
        }
    }

    public validarvacio(arreglo , imagen?){
        if (imagen){
            if (!arreglo.imagen.length){
                return false;
            }
            else {
                return true;
            }
        }
        if (!arreglo.productos.length){
            return false;
        }
        else {
            return true;
        }
    }
    numerodeservicioproductos(cantidad: number){
      this.totalProductosServicios += cantidad;
    }

    public isMayusculaService(type: number) {
        return type === 2 ? 'Servicios' : 'Productos';
    }


    abrirModalCambio() {
    let objetoAux;
    objetoAux = JSON.parse(JSON.stringify(this.negocioTO));
    const navigationExtras = JSON.stringify(objetoAux);
    this.router.navigate(['/tabs/home/negocio/card-negocio/formulario-negocio/solicitud-cambio-url'], { queryParams: { special: navigationExtras } });
    // /tabs/home/negocio/card-negocio
  }

  async cancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estas seguro?',
      message: 'Se cancelara todo el proceso?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['/tabs/home/negocio'], { queryParams: { special: true } });
          }
        }
      ]
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'domicilio') {
      this.cagarMapa();
    }


  }
  public infoNegocio(id: any) {
    console.log('buscar');
    this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          this.negocioTO = response.data;
          this.logo = this.negocioTO.logo.archivo_64;
        },
        error => {
        }
      );
  }
  public buscarNegocio(id: any) {
    console.log('buscar');
    if (this.negocioTO.id_negocio === null || this.negocioTO.id_negocio === undefined) {
      this.obtenerTipoNegocio();
      this.obtenerCatOrganizaciones();
      this.obtenerCaPlazas();
      this.obtenerConvenio();
      this.obtenerCatDistintivos();
      // this.categoriaPrincipal({ value: 0 });
      // this.subcategorias({ value: 0 });
    } else {
      this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          console.log('Datos jale: ', JSON.stringify(response.data));
          this.negocioTO = response.data;
          this.obtenerTipoNegocio();
          this.obtenerCatOrganizaciones();
          this.obtenerCaPlazas();
          this.obtenerConvenio();
          this.obtenerCatDistintivos();

          this.negocioTO.afiliacionesTodo.forEach(element => {

            const afiliacion = {
              id_organizacion: element.id_organizacion,
              fecha_fin: element.fecha_fin,
              nombre: element.organizacion.nombre
             };
            this.convenio.push(afiliacion);

          });
          const archivo = new ArchivoComunModel();
          archivo.archivo_64 = this.negocioTO.url_logo;
          archivo.nombre_archivo = this.negocioTO.id_negocio.toString();
          this.negocioTO.logo = archivo;
          this.negocioTO.local = archivo;
          this.categoriaPrincipal({ value: this.negocioTO.id_tipo_negocio });
          this.subcategorias({ value: this.negocioTO.id_giro });
          // this.logo=this.negocioTO.logo.archivo_64
        },
        error => {
        }
      );
    }
  }
  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
      response => {
        this.listTipoNegocio = response.data;
        if (this.negocioTO.id_negocio != null) {
          this.listTipoNegocio.forEach(element => {
            if (element.id_tipo_negocio == this.negocioTO.id_tipo_negocio) {
              this.tipoNegoAux = element.nombre;
            }
          });
        }
      },
      error => {
        this.listTipoNegocio = [];
      }
    );
  }
  idmatriznegocio( event){
      let idE;
      if (event.type === 'ionChange') {
          idE = event.detail.value;
          if (idE > 0){
              this.negocioTO.idNegocioMatriz = idE;
          }

      } else {
          idE = event.value;
      }

  }
    async presentAlert(head , messag) {
        const alert = await this.alertController.create({
            header: head,
            message: messag,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {},
                }
            ],
        });

        await alert.present();
    }
  categoriaPrincipal(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.id_giro = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    this.negocioServico.categoriaPrincipal(idE).subscribe(
      respuesta => {
        this.listCategorias = respuesta.data;
        if (this.negocioTO.id_negocio != null) {
          this.listCategorias.forEach(element => {
            if (element.id_giro == this.negocioTO.id_giro) {
              this.tipoGiroAux = element.nombre;
            }
          });
        }
      }
    );
  }
  subcategorias(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.id_categoria_negocio = [];
      idE = evento.detail.value;
      if (idE > 0){
        this.loaderSubCategoria = false;
      }

    } else {
      idE = evento.value;
    }

    this.negocioServico.obtenerCategoriasProdServ(idE, this.negocioTO.id_tipo_negocio).subscribe(
      respuesta => {
        this.listaSubCategorias = Array();
        if (respuesta.code === 200) {
          this.loaderSubCategoria = true;
          this.listaSubCategorias = respuesta.data;
          this.listaSubCategorias.forEach(element => {
            if (element.id_categoria == this.negocioTO.id_categoria_negocio) {
              this.tipoSubAux = element.nombre;
            }
          });
        }
      }
    );
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
                    this.negocioTO.logo = archivo;
                    this.negocioTO.local = archivo;
                    /*  this.formGroup1.patchValue({
                        archivo: archivo
                      });*/
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
                  this.negocioTO.logo = archivo;
                  this.negocioTO.local = archivo;
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
  public avisoConvenio(event){
    this.notificaciones.toastInfo('Registra un convenio para poder habilitar esta característica');
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
                    this.fotografiasArray.push(archivo);
                    this.numeroFotos++;
                    if (this.numeroFotos >= this.numeroFotosPermitidas){
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
                  this.fotografiasArray.push(archivo);
                  this.numeroFotos++;
                  if (this.numeroFotos >= this.numeroFotosPermitidas){
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
  public borrarFoto(posicion: number){
    this.fotografiasArray.splice(posicion, 1);
    this.numeroFotos--;
    if (this.numeroFotos < 3){
      this.galeriaFull = false;
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
    this.tags = tags.join();
    this.negocioTO.tags = this.tags;
    this.negocioGuardar.tags = this.tags;
  }
  agregarLugaresEntrega(lugaresEntrega: string[]) {
    this.negLugar = true;
    this.lugaresEntrega = lugaresEntrega.join();
  }
  public obtenerCatOrganizaciones() {
    this.negocioServico.obtenerCatOrganizaciones().subscribe((response) => {
      this.lstOrganizaciones = Object.values(response.data);
      if (this.negocioTO.id_negocio != null) {
        this.lstOrganizaciones.forEach((element) => {
          this.negocioTO.organizaciones.forEach((elements) => {
            if (element.id_organizacion == elements) {
              this.tipoOrgAux = element.nombre;
            }
          });
        });
      }
    });
  }

  public obtenerCatDistintivos() {
    this.negocioServico.obtenerCatDistintivos().subscribe((response) => {
      this.lstDistintivos = Object.values(response.data);
      if (this.negocioTO.id_negocio != null) {
        this.lstDistintivos.forEach((element) => {
          this.negocioTO.distintivos.forEach((elements) => {
            if (element.id_distintivo == elements) {
              this.tipoDistAux = element.nombre;
            }
          });
        });
      }
    });
  }

  public obtenerCaPlazas() {
    this.negocioServico.obtenerPlazas().subscribe((response) => {
      this.lstPlazas = Object.values(response.data);
      if (this.negocioTO.id_negocio != null) {
        this.lstPlazas.forEach((element) => {
          this.negocioTO.plazas.forEach((elements) => {

            if (element.id_organizacion == elements) {
              this.tipoPlzAux = element.nombre;
            }
          });
        });
      }
    });
  }

  public obtenerConvenio() {
    this.negocioServico.obtenerConvenio().subscribe((response) => {
      this.lstConvenio = Object.values(response.data);
      if (this.negocioTO.id_negocio != null) {
        this.lstConvenio.forEach((element) => {
          this.negocioTO.afiliaciones.forEach((elements) => {
            if (element.id_organizacion == elements) {
              this.tipoCnvn = element.nombre;
            }
          });
        });
      }
    });
  }

  /**
     * Funcion para enviar a validar la url del negocio
     * @param evento
     * @author Omar
     */
  confirmarUrlNegocio(evento, entrada = 1) {
    if (this.negocioTO.id_negocio === null){
      let cadena = '';
      if (entrada === 2) {
      cadena = evento.detail.value;
    }
    else {
      cadena = evento;
    }
      clearTimeout(this.controladorTiempo);
      this.controladorTiempo = setTimeout(() => {
      const tem = cadena.replace(/[^a-zA-Z0-9 ]/g, '');
      this.negocioServico.verificarUrlNegocio(tem).subscribe(
        repuesta => {
          if (repuesta.code === 200) {
            this.negocioTO.url_negocio = repuesta.data.url_negocio;
            this.urlNegocioLibre = repuesta.data.url_libre;
          }
        }
      );
      clearTimeout(this.controladorTiempo);
    }, 1000);
    }
  }

  entregasDomicilio(evento) {
    this.blnActivaEntregas = evento.detail.value;
  }
  esNegocioFisico(evento) {
    this.blnActivaNegocioFisico = evento.detail.value;
  }
  diasSeleccionado(evento) {
    if (evento.detail.value.length > 0) {
      this.nuevoHorario.dias = evento.detail.value;
      this.blnActivaHorario = false;
    } else {
      this.blnActivaHorario = true;
    }
  }
  public validateFalse() {
    if (this.negocioTO.dias.length === 0) {
      return false;
    }
    return true;
  }
  agregarHorario() {
    if (this.nuevoHorario.id_horario === null || this.nuevoHorario.id_horario === undefined) {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format('HH:mm');
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format('HH:mm');
      this.nuevoHorario.activo = true;
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.id_horario = null;
      if (this.posicionHorario >= 0) {
        this.negocioTO.dias[this.posicionHorario] = this.nuevoHorario;
      } else {
        this.negocioTO.dias.push(this.nuevoHorario);
      }
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioNegocioModel;
      this.posicionHorario = -1;
    } else {
      this.nuevoHorario.hora_inicio = moment.parseZone(this.horarioini).format('HH:mm');
      this.nuevoHorario.hora_fin = moment.parseZone(this.horariofin).format('HH:mm');
      this.nuevoHorario.dia = this.nuevoHorario.dias.toString();
      this.nuevoHorario.dias = this.nuevoHorario.dias;
      this.nuevoHorario.activo = true;
      this.negocioTO.dias[this.posicionHorario] = this.nuevoHorario;
      this.horarioini = '';
      this.horariofin = '';
      this.nuevoHorario = new HorarioNegocioModel;
      this.posicionHorario = -1;
    }
  }

  eliminarHorario(i) {
    this.negocioTO.dias.splice(i);
  }
  editarHorario(horario, i) {
    const objFecha = new Date();
    this.posicionHorario = i;
    this.horarioini = moment.parseZone(objFecha).format('YYYY-MM-DDT' + horario.hora_inicio + ':ssZ');
    this.horariofin = moment.parseZone(objFecha).format('YYYY-MM-DDT' + horario.hora_fin + ':ssZ');
    this.nuevoHorario.dias = horario.dias;
    this.nuevoHorario.id_horario = horario.id_horario;
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
  cancelarHorario() {
    this.horarioini = '';
    this.horariofin = '';
    this.nuevoHorario = new HorarioNegocioModel;
  }
  cambiarPago(event) {
    const lista = event.detail.value;
    let credito = 0, debito = 0, efectivo = 0, transferencia = 0;
    lista.forEach(element => {
      if (element.id === 1) {
        transferencia = 1;
      } else if (element.id === 2) {
        credito = 1;
      } else if (element.id === 3) {
        debito = 1;
      } else if (element.id === 4) {
        efectivo = 1;
      }
    });
    this.negocioTO.tipo_pago_transferencia = transferencia;
    this.negocioTO.tipo_pago_tarjeta_credito = credito;
    this.negocioTO.tipo_pago_tarjeta_debito = debito;
    this.negocioTO.tipo_pago_efectivo = efectivo;
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
  /**
 * Funcion para cargar el mapa
 */
  public cagarMapa() {
    setTimeout(it => {
      // this.map = new Map("mapId").setView([this.latitud, this.longitud], 16);
      this.map = new Map('mapId').setView([this.latitud, this.longitud], 12);
      this.map.on('click', respuesta => {
        this.getLatLong(respuesta);
      });
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      this.marker = marker([this.latitud, this.longitud], {
        draggable:
          true
      }).addTo(this.map);
      if (this.negocioTO.det_domicilio.latitud !== null) {
        this.locationPredeterminada();
      }
    }, 1000);
  }
  getLatLong(e) {
    const latitude = e.latlng.lat;
    this.negocioTO.det_domicilio.latitud = latitude;
    const longitude = e.latlng.lng;
    this.negocioTO.det_domicilio.longitud = longitude;
    this.map.panTo([latitude, longitude]);
    this.marker.setLatLng([latitude, longitude]);

  }
  public locationPredeterminada() {
    let latitude;
    let longitude;
    latitude = this.negocioTO.det_domicilio.latitud;
    longitude = this.negocioTO.det_domicilio.longitud;
    this.map.setView([latitude, longitude], 12);
    this.marker.setLatLng([latitude, longitude]);
  }

  /**
   * Funcion para obtener la ubicacion actual
   */
  public localizationOption() {
    this.localizacionTiempo();
  }
  async localizacionTiempo() {
    let latitude;
    let longitude;
    const gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
    const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {
      this.negocioTO.det_domicilio.latitud = res.coords.latitude;
      latitude = res.coords.latitude;
      this.negocioTO.det_domicilio.longitud = res.coords.longitude;
      longitude = res.coords.longitude;
      this.map.panTo([latitude, longitude]);
      this.marker.setLatLng([latitude, longitude]);

    }).catch(error => {
      this.notificaciones.error(error);
    }
    );
  }
  /**
* Funcion para obtener el estado
*/
  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          this.list_cat_estado.forEach(element => {
            if (element.id_estado == this.negocioTO.det_domicilio.id_estado) {
              this.estadoAux = element.nombre;

            }
          });
          // this.loader = false;
          if (this.negocioTO.det_domicilio.id_estado > 0) {
            this.get_list_cat_municipio({ value: this.negocioTO.det_domicilio.id_estado });
          }
        }
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  /**
  * Funcion para obtener los municipios
  */
  public get_list_cat_municipio(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      // this.negocioTO.det_domicilio.id_municipio = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderMunicipio = true;
      this._general_service.getMunicipiosAll(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_municipio = response.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio == this.negocioTO.det_domicilio.id_municipio) {
                this.municiAux = element.nombre;


              }
            });
            this.btnMuncipio = false;
            if (this.negocioTO.det_domicilio.id_municipio > 0) {
              this.btnMuncipio = false;
              this.get_list_cat_localidad({ value: this.negocioTO.det_domicilio.id_municipio });
            }
          }
        },
        error => {
          this.notificaciones.error(error);
        },
        () => {
          //  this.loaderMunicipio = false;
        }
      );
    } else {
      this.list_cat_municipio = [];
    }
  }
  /**
 * Obtener localidad
 */
  public get_list_cat_localidad(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      // this.negocioTO.det_domicilio.id_localidad = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;

      this._general_service.getLocalidadAll(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.btnLocalidad = false;
            this.list_cat_localidad = response.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad == this.negocioTO.det_domicilio.id_localidad) {
                this.localiAux = element.nombre;

              }
            });
          }
        },
        error => {
          //   this._notificacionService.pushError(error);
          this.notificaciones.error(error);
        },
        () => {
          //  this.loaderLocalidad = false;
        }
      );
    } else {
      this.list_cat_localidad = [];
    }
  }

  guardar( formulario) {
    const formularioInfo = document.getElementById('formNegocio');
    this.loader = true;
    if (this.negocioTO.logo === null ||
      this.negocioTO.logo === undefined ||
      this.negocioTO.logo.archivo_64 === '' ||
      this.negocioTO.logo.archivo_64 === null ||
      this.negocioTO.logo.archivo_64 === undefined) {
      this.notificaciones.alerta('Agregue la foto de su negocio');
      this.loader = false;

    } else {
      this.datos();
      if (this.seEstaClonando === true){
        this.negocioGuardar.id_negocio = null;
        const dirActual = this.negocioGuardar.det_domicilio;
        const dirAnterior = this.direccionAnterior.calle;
        this.negocioGuardar.id_negocio_matriz = this.negocioTO.id_negocio_matriz;

        if (this.negocioGuardar.nombre_comercial === this.nombreAnterior){
          this.nextTab('informacion');
          this.notificaciones.error('El nombre del negocio debe ser direfente');
          this.loader = false;
        }else if (dirActual.calle === dirAnterior) {
            this.nextTab('domicilio');
            this.notificaciones.error('El domicilio debe ser direfente');
            this.loader = false;
        }else if ((this.negocioGuardar.nombre_comercial !== this.nombreAnterior) && (dirActual.calle !== dirAnterior)){
          console.log(this.negocioGuardar.nombre_comercial + ' Y ' + this.nombreAnterior);
          console.log(dirActual.calle + ' Y ' + dirAnterior);
          this.negocioGuardar.productos = this.listaProductos;
          console.log("NegocioGuardar#####" + JSON.stringify(this.negocioGuardar))
          this.negocioServico.guardar(this.negocioGuardar).subscribe(
            response => {
              if (response.code === 200) {
                this.notificaciones.exito('Tu negocio se guardo exitosamente');
                this.loader = false;
                this.router.navigate(['/tabs/home/negocio']);
              } else {
                this.loader = false;
                this.notificaciones.alerta(JSON.stringify(response.message));
                alert(JSON.stringify(response));
                console.log('HOLA---------' + JSON.stringify(response));
              }
            },
            error => {
              this.notificaciones.error(error);
              this.loader = false;
              console.log('ERROR:--------' + JSON.stringify(error));
            }
          );
        }
      }else{
        this.negocioServico.guardar(this.negocioGuardar).subscribe(
          response => {
            if (response.code === 200) {
              this.notificaciones.exito('Tu negocio se guardo exitosamente');
              console.log('xxxxxx' + JSON.stringify(this.negocioGuardar));
              this.loader = false;
              this.router.navigate(['/tabs/home/negocio']);
            } else {
              console.log('sssss' + JSON.stringify(this.negocioGuardar));
              this.loader = false;
              this.notificaciones.alerta(response.message);
            }
          },
          error => {
            this.notificaciones.error(error);
            this.loader = false;
          }
        );
      }
    }
  }

  datos() {
    this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
    this.blnActivaNegocioFisico = this.negocioTO.tipo_negocio;
    this.negocioGuardar = new NegocioModel();
    this.negocioGuardar.id_negocio = this.negocioTO.id_negocio;
    this.negocioGuardar.rfc = this.negocioTO.rfc;
    this.negocioGuardar.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.negocioGuardar.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
    this.negocioGuardar.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;

    this.negocioGuardar.logo = this.negocioTO.logo;
    this.negocioGuardar.local = this.negocioTO.local;
    this.negocioGuardar.nombre_comercial = this.negocioTO.nombre_comercial;
    this.negocioGuardar.id_tipo_negocio = this.negocioTO.id_tipo_negocio;
    this.negocioGuardar.id_giro = this.negocioTO.id_giro;
    this.negocioGuardar.otra_categoria = this.negocioTO.otra_categoria;
    const tem = this.negocioTO.url_negocio;
    const ten = tem.replace(/\s+/g, '');
    this.negocioGuardar.url_negocio = ten.replace(/[^a-zA-Z0-9 ]/g, '');

    if (this.negocioGuardar.id_giro === 12) {
      this.negocioGuardar.id_categoria_negocio = 100;
    } else {
      this.negocioGuardar.id_categoria_negocio = this.negocioTO.id_categoria_negocio;
    }
    this.negocioGuardar.otra_subcategoria = '';
    this.negocioGuardar.organizaciones = this.negocioTO.organizaciones;
    this.negocioGuardar.plazas = this.negocioTO.plazas;
    this.negocioGuardar.distintivos = this.negocioTO.distintivos;
    this.negocioGuardar.perfiles_caracteristicas = [this.negocioTO.perfiles_caracteristicas];
    console.log('perfiles_caracteristicas' + this.negocioGuardar.perfiles_caracteristicas);
    if (this.cnvn_date === undefined){
      this.dateObject = this.convenio_date;
    } else{
      this.dateObject = this.cnvn_date.substr(0, this.cnvn_date.indexOf( 'T' ));
    }
    this.negocioTO.afiliaciones = [];

    this.convenio.forEach(element => {

      const afiliacion = {
        id: element.id_organizacion,
        fecha_fin: element.fecha_fin,
       };
      this.negocioTO.afiliaciones.push(afiliacion);

    });
    this.negocioGuardar.afiliaciones =  this.negocioTO.afiliaciones;

    if (this.negocioGuardar.organizaciones !== undefined && this.negocioGuardar.organizaciones.length > 0) {
      this.negocioGuardar.nombre_organizacion = this.negocioTO.nombre_organizacion;
    }
    if (this.negocioGuardar.distintivos !== undefined && this.negocioGuardar.distintivos.length > 0) {
      this.negocioGuardar.nombre_distintivos = this.negocioTO.nombre_distintivos;
    }

    if (this.negtag == true) {
      this.negocioGuardar.tags = this.tags;
    } else {
      let convertir;
      convertir = JSON.parse(JSON.stringify(this.negocioTO));
      this.negocioGuardar.tags = convertir.tags.join();
    }
    if (this.negLugar == true) {
      this.negocioGuardar.lugares_entrega = this.lugaresEntrega;
    } else {
      let convertir;
      convertir = JSON.parse(JSON.stringify(this.negocioTO));
      this.negocioGuardar.lugares_entrega = convertir.lugares_entrega.join();
    }
    this.negocioGuardar.descripcion = this.negocioTO.descripcion;
    this.negocioGuardar.entrega_domicilio = this.negocioTO.entrega_domicilio;
    this.negocioGuardar.consumo_sitio = this.negocioTO.consumo_sitio;
    this.negocioGuardar.entrega_sitio = this.negocioTO.entrega_sitio;
    this.negocioGuardar.negocio_fisico = this.negocioTO.negocio_fisico;
    this.negocioGuardar.alcance_entrega = this.negocioTO.alcance_entrega;
    this.negocioGuardar.tiempo_entrega_kilometro = this.negocioTO.tiempo_entrega_kilometro;
    this.negocioGuardar.costo_entrega = this.negocioTO.costo_entrega;
    this.negocioGuardar.telefono = this.negocioTO.telefono;
    this.negocioGuardar.celular = this.negocioTO.celular;
    this.negocioGuardar.correo = this.negocioTO.correo;
    this.negocioGuardar.id_facebook = this.negocioTO.id_facebook;
    this.negocioGuardar.twitter = this.negocioTO.twitter;
    this.negocioGuardar.instagram = this.negocioTO.instagram;
    this.negocioGuardar.youtube = this.negocioTO.youtube;
    this.negocioGuardar.tiktok = this.negocioTO.tiktok;
    this.negocioGuardar.det_domicilio.calle = this.negocioTO.det_domicilio.calle;
    this.negocioGuardar.det_domicilio.numero_int = this.negocioTO.det_domicilio.numero_int;
    this.negocioGuardar.det_domicilio.numero_ext = this.negocioTO.det_domicilio.numero_ext;
    this.negocioGuardar.det_domicilio.id_estado = this.negocioTO.det_domicilio.id_estado;
    this.negocioGuardar.det_domicilio.id_municipio = this.negocioTO.det_domicilio.id_municipio;
    this.negocioGuardar.det_domicilio.id_localidad = this.negocioTO.det_domicilio.id_localidad;
    this.negocioGuardar.det_domicilio.colonia = this.negocioTO.det_domicilio.colonia;
    this.negocioGuardar.tipo_pago_transferencia = this.negocioTO.tipo_pago_transferencia;
    this.negocioGuardar.tipo_pago_tarjeta_credito = this.negocioTO.tipo_pago_tarjeta_credito;
    this.negocioGuardar.tipo_pago_tarjeta_debito = this.negocioTO.tipo_pago_tarjeta_debito;
    this.negocioGuardar.tipo_pago_efectivo = this.negocioTO.tipo_pago_efectivo;

    this.negocioGuardar.fotografias = this.fotografiasArray;
    if (this.negocioTO.det_domicilio.id_domicilio != null) {
      this.negocioGuardar.det_domicilio.id_domicilio = this.negocioTO.det_domicilio.id_domicilio;
    }
    this.negocioGuardar.dias = this.negocioTO.dias;
  }


  public infoInvalid(info, dias) {
    if (info === true) {
      this.colorInfo = 'color: red';
    } else {
      this.colorContacto = (dias.length > 0) ? '' : 'color: red';
    }
    return (dias.length > 0) ? info : true;
  }

  public domicilioInvalid(domicilio, dias) {
    if (domicilio === true) {
      this.colorDomicilio = 'color: red';
    } else {
      this.colorContacto = (dias.length > 0) ? '' : 'color: red';
    }
    return (dias.length > 0) ? domicilio : true;
  }

  public contactoInvalid(contacto, dias) {
    if (contacto === true) {
      this.colorContacto = 'color: red';
    } else {
      this.colorContacto = (dias.length > 0) ? '' : 'color: red';
    }
    return (dias.length > 0) ? contacto : true;
  }

  async solicitarCambioUrl() {
    const modal = await this.modalController.create({
      component: SolicitarCambioUrlComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        idNegocio: this.negocioTO.id_negocio
      }
    });
    await modal.present();
  }

  public getAddress(){
    const estado = this.list_cat_estado.filter(estado => estado.id_estado == this.negocioTO.det_domicilio.id_estado)[0].nombre;
    const municipio = this.list_cat_municipio.filter(municipio => municipio.id_municipio == this.negocioTO.det_domicilio.id_municipio)[0].nombre;
    const address = this.negocioTO.det_domicilio.calle + ' ' + this.negocioTO.det_domicilio.numero_ext + ' ' + this.negocioTO.det_domicilio.colonia + ' ' + this.negocioTO.det_domicilio.codigo_postal + ' ' + municipio + ' ' + estado;
    this.getCoordinates(address);
  }

  async getCoordinates(address){
    this.getCoordinatesMap.getPosts(address)
    .then(async data => {
      const arrayPosts: any = data;
      const latitud = arrayPosts.results[0].geometry.location.lat;
      const longitud = arrayPosts.results[0].geometry.location.lng;
      const gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
      const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {
        this.negocioTO.det_domicilio.latitud = res.coords.latitude;
        this.negocioTO.det_domicilio.longitud = res.coords.longitude;
        this.map.panTo([latitud, longitud]);
        this.marker.setLatLng([latitud, longitud]);
      });

    });
  }

  async nextTab(tab){
    this.segmentModel = tab;
  }
  editarConvenio(convenio, i) {
    this.convenioId = convenio.id_organizacion;

    this.cnvn_fecha = convenio.fecha_fin;
    this.convenio.splice(i, 1);
  }
  cancelarConvenio() {
    this.convenioId = null;
    this.cnvn_fecha = null;
  }
 agregarConvenio(){



        this.dateFormat = this.cnvn_fecha.substr(0, this.cnvn_fecha.indexOf( 'T' ));

        const filteredArr = this.lstConvenio.find(data => data.id_organizacion === this.convenioId);
        this.nameConvenio = filteredArr.nombre;

        const afiliacion = {
          id_organizacion: this.convenioId,
          fecha_fin: this.dateFormat,
          nombre: this.nameConvenio
         };
        this.convenio.push(afiliacion);
        this.convenioId = null;
        this.cnvn_fecha = null;

 }


 async presentAlertEliminarConvenio(i) {
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
          this.eliminarConvenio(i);
        }
      }
    ]
  });
  await alert.present();
}

eliminarConvenio(i) {
  this.convenio.splice(i, 1);
}

async obtenerFeatures(id_negocio: number){
  await this._general_service.features(id_negocio).subscribe(
      response => {
          console.log('FEATURES del id_negocio en formulario' + id_negocio + ',\n' + JSON.stringify(response));
          this.features10 = false;
          if (response.data.lenght !== 0){
              response.data.forEach(feature => {
                  if (feature.id_caracteristica === 7){
                      this.maximoProductos = feature.cantidad;
                  }
                  if (feature.id_caracteristica === 10){
                    this.numeroFotosPermitidas = feature.cantidad;
                    this.disabledPhoto = false;
                    this.features10 = true;
                    console.log('\nfeatures 10 ok con un limite de fotos de: ' + this.numeroFotosPermitidas);
                  }
                  if (feature.id_caracteristica === 12){
                    console.log('\nfeatures 12 ok');
                    this.disabled = false;
                    this.features12 = true;
                  }
              });
          }else{
            console.log('Features Vacío');

          }
      },
      error => {
          console.log('error' + error);
      }
  );
}
async obtenerSuscripciones(){
  await this._general_service.suscripciones().subscribe(
    response => {
      if (this._utils_cls.is_success_response(response.code)) {
        this.suscripciones = response.data;
        this.suscripciones.forEach(suscripcion => {
          // [(ngModel)]="negocioTO.perfiles_caracteristicas"
          if (this.negocioTO.perfiles_caracteristicas == suscripcion.id_perfil_caracteristica) {
            this.dsSuscrip = suscripcion.nombre;
          }
        });
      }
    },
    error => {
      // this.notificaciones.error(error);
    },
    () => {
    }
  );
}
seleccionarSucripcion(){
  // this.dsSuscrip=""
   this.modalSuscripciones(this.suscripciones).then(r => {
    if (r.data !== undefined) {
      this.dsSuscrip = '';
      // console.log("AQUI EL VALOOOOOR. "+r.data.data+" : "+JSON.stringify(r))
      this.dsSuscrip = r.data.data[1];
      this.negocioTO.perfiles_caracteristicas = r.data.data[0];
    }else{
      console.log('no selecciono nada se conserva el plan: ' + this.dsSuscrip);
    }
  }
  );

}
negocios(){
        this.negocioServico.misNegocios(this.id_proveedor).subscribe(
            response => {
                this.lstNegocios = response.data;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error => {
            }
        );
    }

async modalSuscripciones(planes: any[]) {
  const modal = await this.modalController.create({
    component: SeleccionarSucripcionComponent,
    cssClass: 'my-custom-class',
    componentProps: {
      suscripciones: planes
    }
  });
  await modal.present();
  const data = await modal.onDidDismiss().then(r => {
    if (r !== undefined) {
      return r;
    }else{
      return null;
    }
  }
  );
  return data;
}
}

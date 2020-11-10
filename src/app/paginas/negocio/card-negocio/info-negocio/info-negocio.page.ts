import { CatOrganizacionesModel } from './../../../../Modelos/CatOrganizacionesModel';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { NegocioService } from "../../../../api/negocio.service";
import { UtilsCls } from './../../../../utils/UtilsCls';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from "../../../../components/recorte-imagen/recorte-imagen.component";
import { ActionSheetController } from "@ionic/angular";


@Component({
  selector: 'app-info-negocio',
  templateUrl: './info-negocio.page.html',
  styleUrls: ['./info-negocio.page.scss'],
})
export class InfoNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public listTipoNegocio: any;
  public listCategorias: any;
  private listaSubCategorias: any;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  private usuario: any;
  public entregas = [
    { id: true, respuesta: 'Si' },
    { id: false, respuesta: 'No' }
  ];
  public tags = [];
  public lstOrganizaciones: Array<CatOrganizacionesModel>;
  public urlNegocioLibre = true;
  public controladorTiempo: any;
  public blnActivaEntregas: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService,
    private actionSheetController: ActionSheetController,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController
  ) {
    this.listCategorias = [];
    this.listTipoNegocio = [];
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
      }
    });
    console.log(this.negocioTO);
    
    this.buscarNegocio(this.negocioTO.id_negocio);
    this.obtenerTipoNegocio();
    this.obtenerCatOrganizaciones();
    this.blnActivaEntregas = this.negocioTO.entrega_domicilio;
  }
  public buscarNegocio(id) {

    if( this.negocioTO.id_negocio=== null || this.negocioTO.id_negocio === undefined){
      this.negocioTO = new NegocioModel();
      this.negocioTO.tags = ""; 
      this.categoriaPrincipal();
      this.subcategorias();
    } else {
      this.negocioServico.buscarNegocio(id).subscribe(
        response => {
          this.negocioTO = response.data;
  
          const archivo = new ArchivoComunModel();
              archivo.archivo_64 = this.negocioTO.url_logo;
              archivo.nombre_archivo = this.negocioTO.id_negocio.toString();
              this.negocioTO.logo = archivo;
              this.negocioTO.local = archivo;
          this.categoriaPrincipal();
          this.subcategorias();
        },
        error => {
          console.log(error);
        }
      );
    }
    
  }
  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
      response => {
        this.listTipoNegocio = response.data;
      },
      error => {
        this.listTipoNegocio = [];
        console.log(error);
      }
    );
  }
  categoriaPrincipal() {
    // this.loaderGiro = true;
    //   this.negocioTO.id_giro = null;
    this.listCategorias = [];
    this.negocioServico.categoriaPrincipal(this.negocioTO.id_tipo_negocio).subscribe(
      respuesta => {
        this.listCategorias = respuesta.data;
      },
      error => {
      },
      () => {
        // this.loaderGiro = false;
      }
    );
  }
  subcategorias() {
    //this.loaderGiro = true;
    this.listCategorias = [];
    this.negocioServico.obtenerCategorias(this.negocioTO.id_giro).subscribe(
      respuesta => {
        this.listaSubCategorias = Array();
        if (respuesta.code === 200) {
          this.listaSubCategorias = respuesta.data;
        }
      },
      error => {
      },
      () => {
        //   this.loaderCategoria = false;
      }
    );
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
              this.abrirModal(event, this.resizeToWidth, this.resizeToHeight).then(r => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  archivo.nombre_archivo = r.nombre_archivo,
                    archivo.archivo_64 = r.data;
                  this.negocioTO.logo = archivo;
                  this.negocioTO.local = archivo;
                  //this.blnImgCuadrada = false;
                }
              }
              );
            }
          };
        };
      }
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
    this.tags = tags;
    this.negocioTO.tags = this.tags.join();
  }
  public obtenerCatOrganizaciones() {
    this.negocioServico.obtenerCatOrganizaciones().subscribe(
      response => {
        this.lstOrganizaciones = Object.values(response.data);
        // console.info(this.lstOrganizaciones);
      });
  }

  /**
     * Funcion para enviar a validar la url del negocio
     * @param evento
     * @author Omar
     */
  confirmarUrlNegocio(evento, entrada = 1) {
    let cadena = '';
    if (entrada === 2) {
      cadena = evento.target.value;
    }
    else {
      cadena = evento;
    }
    clearTimeout(this.controladorTiempo);
    this.controladorTiempo = setTimeout(() => {
      let tem = cadena.replace(/[^a-zA-Z0-9 ]/g, "");
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
  guardar() {
    
    const negocioGuardar = new NegocioModel();
    negocioGuardar.id_negocio = this.negocioTO.id_negocio;
    negocioGuardar.rfc = this.negocioTO.rfc;
    negocioGuardar.id_proveedor = this.usuario.proveedor.id_proveedor;
    negocioGuardar.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
    negocioGuardar.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;

    negocioGuardar.logo = this.negocioTO.logo;
    negocioGuardar.local = this.negocioTO.local;
    negocioGuardar.nombre_comercial = this.negocioTO.nombre_comercial;
    negocioGuardar.id_tipo_negocio = this.negocioTO.id_negocio;
    negocioGuardar.id_giro = this.negocioTO.id_giro;
    negocioGuardar.otra_categoria = this.negocioTO.otra_categoria;
    let tem = this.negocioTO.url_negocio;
    let ten = tem.replace(/\s+/g, '');
    negocioGuardar.url_negocio = ten.replace(/[^a-zA-Z0-9 ]/g, "");

    if (negocioGuardar.id_giro === 12) {
      negocioGuardar.id_categoria_negocio = 100;
    } else {
      negocioGuardar.id_categoria_negocio = this.negocioTO.id_categoria_negocio;
    }
    negocioGuardar.otra_subcategoria = '';

    negocioGuardar.organizaciones = this.negocioTO.organizaciones;
    negocioGuardar.nombre_organizacion = '';
    if (negocioGuardar.organizaciones !== undefined && negocioGuardar.organizaciones.length > 0) {
      negocioGuardar.nombre_organizacion = this.negocioTO.nombre_organizacion;
    }
    
    negocioGuardar.tags = this.negocioTO.tags.join();

    negocioGuardar.descripcion = this.negocioTO.descripcion;
    negocioGuardar.entrega_domicilio = this.negocioTO.entrega_domicilio;
    negocioGuardar.consumo_sitio = this.negocioTO.consumo_sitio;
    negocioGuardar.entrega_sitio = this.negocioTO.entrega_sitio;
    negocioGuardar.alcance_entrega = this.negocioTO.alcance_entrega;
    negocioGuardar.tiempo_entrega_kilometro = this.negocioTO.tiempo_entrega_kilometro;
    negocioGuardar.costo_entrega = this.negocioTO.costo_entrega;


    negocioGuardar.telefono = this.negocioTO.telefono;
    negocioGuardar.celular = this.negocioTO.celular;
    negocioGuardar.correo = this.negocioTO.correo;

    negocioGuardar.id_facebook = '';
    
      negocioGuardar.id_facebook = this.negocioTO.id_facebook;
    

    negocioGuardar.twitter = '';
    
      negocioGuardar.twitter = this.negocioTO.twitter;
    

    negocioGuardar.instagram = '';
    
      negocioGuardar.instagram = this.negocioTO.instagram;
    

    negocioGuardar.youtube = '';
    
      negocioGuardar.youtube = this.negocioTO.youtube;
    

    negocioGuardar.tiktok = '';
    
      negocioGuardar.tiktok = this.negocioTO.tiktok;
    

    negocioGuardar.det_domicilio.calle = this.negocioTO.det_domicilio.calle;
    negocioGuardar.det_domicilio.numero_int = this.negocioTO.det_domicilio.numero_int;
    negocioGuardar.det_domicilio.numero_ext = this.negocioTO.det_domicilio.numero_ext;
    negocioGuardar.det_domicilio.id_estado = this.negocioTO.det_domicilio.id_estado;
    negocioGuardar.det_domicilio.id_municipio = this.negocioTO.det_domicilio.id_municipio;
    negocioGuardar.det_domicilio.id_localidad = this.negocioTO.det_domicilio.id_localidad;
    negocioGuardar.det_domicilio.colonia = this.negocioTO.det_domicilio.colonia;
    if(this.negocioTO.det_domicilio.id_domicilio != null){
      negocioGuardar.det_domicilio.id_domicilio = this.negocioTO.det_domicilio.id_domicilio;
    }
    negocioGuardar.dias = this.negocioTO.dias;


    console.info(negocioGuardar);


    console.log(this.negocioTO);
    
    this.negocioServico.guardar(negocioGuardar).subscribe(
      response => {
        console.log(response);
        if (response.code === 200) {
          
          this.notificaciones.exito('Tu negocio se guardo exitosamente');
        } else {
          this.notificaciones.alerta('Error al guardar, intente nuevamente');
          //   this._notificacionService.pushAlert('Error al guardar, intente nuevamente');
          //  this.loaderGuardar = false;
        }
      },
      error => {
        this.notificaciones.error(error);
        //  this.loaderGuardar = false;
      }
    );
  }
  entregasDomicilio(evento){
    this.blnActivaEntregas = evento.detail.value;
  }
}

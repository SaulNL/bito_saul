import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";
import { NegocioService } from "../../../../api/negocio.service";
import { DetDomicilioModel } from "../../../../Modelos/DetDomicilioModel";
import { UtilsCls } from './../../../../utils/UtilsCls';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';
import { RecorteImagenComponent } from "../../../../components/recorte-imagen/recorte-imagen.component";

@Component({
  selector: 'app-informacion-negocio',
  templateUrl: './informacion-negocio.page.html',
  styleUrls: ['./informacion-negocio.page.scss'],
})
export class InformacionNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  public negocio: NegocioModel;


  public variaf: boolean;
  public variat: boolean;
  public variay: boolean;
  public variai: boolean;
  public variak: boolean;
  public listTipoNegocio: any;
  public loaderGiro: boolean;
  public listCategorias: any;
  public loaderCategoria: boolean;
  private listaSubCategorias: any;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public entregas = [
    {id: true, respuesta: 'Si'},
    {id: false, respuesta: 'No'}
  ];
  public tags = [];
  constructor(
    private router: Router,
    private negocioServico: NegocioService,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private _utils_cls: UtilsCls,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController) {
    this.valido = false;
    this.variaf = false;
    this.variat = false;
    this.variay = false;
    this.variai = false;
    this.variak = false;

    this.listCategorias = [];
    this.listTipoNegocio = [];

  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
        console.log(this.negocioTO);
        
        this.negocioTO.det_domicilio = new DetDomicilioModel();
      }
    });
    this.buscarNegocio(this.negocioTO.id_negocio);
    this.obtenerTipoNegocio();
  }
  notifyf() {
    if (this.variaf === undefined) {
      this.variaf = false;
    }
  }
  notifyy() {
    if (this.variay === undefined) {
      this.variay = false;
    }
  }
  notifyt() {
    if (this.variat === undefined) {
      this.variat = false;
    }
  }
  notifyk() {
    if (this.variak === undefined) {
      this.variak = false;
    }
  }
  notifyi() {
    if (this.variai === undefined) {
      this.variai = false;
    }
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          role: "save",
          handler: () => {
            this.valido = true;
          }
        },
        {
          text: "Cancelar",
          icon: "close",
          handler: () => {
            this.valido = false;
          }
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

  datosContacto(negocio: NegocioModel) {
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
  public buscarNegocio(id) {
    this.negocioServico.buscarNegocio(id).subscribe(
      response => {
        this.negocioTO = response.data;
        this.categoriaPrincipal();
        this.subcategorias();
      },
      error => {
        console.log(error);
      }
    );
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
    this.loaderGiro = true;
    this.negocioTO.id_giro = null;
    this.listCategorias = [];
    this.negocioServico.categoriaPrincipal(this.negocioTO.id_tipo_negocio).subscribe(
      respuesta => {
        this.listCategorias = respuesta.data;
      },
      error => {
      },
      () => {
        this.loaderGiro = false;
      }
    );
  }
  subcategorias() {
    this.loaderGiro = true;
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
        this.loaderCategoria = false;
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
    //this.negocioTO.tags = this.tags;
  }
}

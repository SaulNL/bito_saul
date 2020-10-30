import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatCategoriasModel } from '../../../../../Modelos/catalogos/FiltroCatCategoriasModel';
import { AdministracionService } from './../../../../../api/administracion-service.service';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToadNotificacionService } from './../../../../../api/toad-notificacion.service';
import { ArchivoComunModel } from '../../../../../Modelos/ArchivoComunModel';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-datos-categoria',
  templateUrl: './datos-categoria.page.html',
  styleUrls: ['./datos-categoria.page.scss'],
})
export class DatosCategoriaPage implements OnInit {
  public actualTO: FiltroCatCategoriasModel;
  public categoriaTO: FiltroCatCategoriasModel;
  public lstCatTipoNego: Array<any>;
  public activos = [
    { id: 0, activo: 'No' },
    { id: 1, activo: 'Si' },
  ];
  private file_img_galeria: FileList;
  public loader: any;
  public blnActivoSubcategorias: boolean;
  public blnActivoCategoria: boolean;
  constructor(
    private servicioUsuarios: AdministracionService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public _notificacionService: ToadNotificacionService,
    private _utils_cls: UtilsCls,
    public loadingController: LoadingController,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.lstCatTipoNego = [];
    this.blnActivoSubcategorias = false;
    this.blnActivoCategoria = true;
  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.categoriaTO = this.actualTO;
      }
    });
    this.getTipoNego();

  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  getTipoNego() {
    this.servicioUsuarios.listarTipoNego().subscribe(
      response => {
        this.lstCatTipoNego = response.data;
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoria',
      cssClass: 'my-custom-class',
      buttons: [ {
        text: 'Subcategorias',
        icon: 'book-outline',
        handler: () => {
          //  this._router.navigate(['/tabs/cambio-contrasenia']);
          //this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria']);
          this.abrirSubcategorias();
        }
      },{
        text: 'Eliminar',
        icon: 'trash-outline',
        role: 'destructive',
        handler: () => {
          this.presentAlertConfirm();
          // this._router.navigate(['/tabs/datos-basicos']);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  regresar() {
    this.router.navigate(['/tabs/home/cat-categoria'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosCategoria = true;
  }
  eliminarCategoria() {
    this.presentLoading();
    this.servicioUsuarios.eliminarCategoria(this.categoriaTO.id_giro).subscribe(
      response => {
        if (response.code === 200) {
          this.loader.dismiss();
          this.regresar();
          //this.admin.blnActivaDatosCategoria = true;
          //this.admin.getCategoria();
          this._notificacionService.exito('se elimino correctamente');
        } else {
          this.loader.dismiss();
          this._notificacionService.error(response.message);
        }
      },
      error => {
        this.loader.dismiss();
        this._notificacionService.error(error);
      }
    );
  }

  async presentAlertConfirm() {
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
            this.eliminarCategoria();
          }
        }
      ]
    });

    await alert.present();
  }
  public subirArchivo(event, tipo: number) {
    this.file_img_galeria = event.target.files;
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
          const file_type = this.file_img_galeria[0].type;
          const file_name = this.file_img_galeria[0].name;
          const file = this.file_img_galeria[0];
          let file_64: any;
          const utl = new UtilsCls();
          utl.getBase64(file).then(
            data => {
              file_64 = data;
              const archivo = new ArchivoComunModel();
              archivo.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
              archivo.archivo_64 = file_64;
              archivo.extension = file_type.slice((file_type.lastIndexOf('/') - 1 >>> 0) + 2);
              switch (tipo) {
                case 1:
                  if (width > height) {
                    this.categoriaTO.imagen = archivo;
                  } else {
                    // this._notificacionService.pushAlert('La imagen no cumple con el formato 2x1');
                    this._notificacionService.alerta('La imagen no cumple con el formato 2x1');
                  }
                  break;
                case 2:
                  if (width > height) {
                    this.categoriaTO.imagen_movil = archivo;
                  } else {
                    //this._notificacionService.pushAlert('La imagen no cumple con el formato 2x1');
                    this._notificacionService.alerta('La imagen no cumple con el formato 2x1');
                  }
                  break;
                case 4:
                  if (width > height) {
                    this.categoriaTO.banner = archivo;
                  } else {
                    //this._notificacionService.pushAlert('La imagen no cumple con el formato 2x1');
                    this._notificacionService.alerta('La imagen no cumple con el formato 2x1');
                  }
                  break;
                case 3:
                  if (width === height) {
                    this.categoriaTO.icon = archivo;
                  } else {
                    this._notificacionService.alerta('La imagen no cumple con el formato 1x1');
                    //   this._notificacionService.pushAlert('La imagen no cumple con el formato 1x1');
                  }
                  break;
                case 5:
                  if (width > height) {
                    this.categoriaTO.imagen_separador = archivo;
                  } else {
                    //this._notificacionService.pushAlert('La imagen no cumple con el formato 2x1');
                    this._notificacionService.alerta('La imagen no cumple con el formato 2x1');
                  }
                  break;
              }
            }
          );
        };
      };
    }
  }
  actualizarDatos(formBasicos: NgForm) {
    this.presentLoading();
    this.servicioUsuarios.guardarCategoria(this.categoriaTO).subscribe(
      data => {
        if (data.code === 200) {
          this._notificacionService.exito('Los datos se guardaron correctamente');
          this.loader.dismiss();
          //this.admin.getCategoria();
          //this.admin.blnActivaDatosCategoria = true;
        } else {
          this.loader.dismiss();
          this._notificacionService.error(data.message);
        }
      },
      error => {
        this._notificacionService.error(error);
        this.loader.dismiss();
      }
    );
  }
  abrirSubcategorias(){
    let navigationExtras = JSON.stringify(this.categoriaTO);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria'], { queryParams: {subcat: navigationExtras}  });
    //this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria'], { queryParams: {subcat: this.categoriaTO.id_giro}  });
    //this.blnActivoSubcategorias = true;
    //this.blnActivoCategoria = false;
  }
}


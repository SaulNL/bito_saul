import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { FiltroCatSubCategoriasModel } from '../../../../../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AdministracionService } from './../../../../../api/administracion-service.service';
import { LoadingController } from '@ionic/angular';
import { ToadNotificacionService } from './../../../../../api/toad-notificacion.service';
import { ArchivoComunModel } from '../../../../../Modelos/ArchivoComunModel';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos-subcategoria',
  templateUrl: './datos-subcategoria.page.html',
  styleUrls: ['./datos-subcategoria.page.scss'],
})
export class DatosSubcategoriaPage implements OnInit {
  public actualTO: FiltroCatSubCategoriasModel;
  public all: any;
  public subcategoriaTO: FiltroCatSubCategoriasModel;
  public activos = [
    { id: 0, activo: 'No' },
    { id: 1, activo: 'Si' },
  ];
  public loader: any;
  private file_img_galeria: FileList;
  public blnActivoFormulario: boolean;
  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController,
    public _notificacionService: ToadNotificacionService,
    private _utils_cls: UtilsCls,
    private active: ActivatedRoute,
    private router: Router
  ) {
    this.blnActivoFormulario = false;
   }

  ngOnInit() {

    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
         this.all = JSON.parse(params.special);
         this.subcategoriaTO = this.all;
        //this.listaSubcategoria(this.subcategoriaTO.id_giro);
        
      }
    });
    
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  cerraDatosSubcategoria() {
    let navigationExtras = JSON.stringify(this.all.model);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria/cat-subcategoria'], { queryParams: {subcat: navigationExtras}  });
    //this.admin.blnActivaDatosSubcategoria = false;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoria',
      cssClass: 'my-custom-class',
      buttons: [{
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
  eliminarCategoria() {
    this.presentLoading();
    this.servicioUsuarios.eliminarSubcategoria(this.subcategoriaTO.id_categoria).subscribe(
      response => {
        if (response.code === 200) {
          this.loader.dismiss();
          this.cerraDatosSubcategoria();
          //this.admin.listaSubcategoria();
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
                  if (width === height) {
                    this.subcategoriaTO.imagen = archivo;
                  } else {
                    this._notificacionService.alerta('La imagen no cumple con el formato 1x1');
                  }
                  break;
                case 2:
                  if ((width <= 100 && width >= 50) && (height <= 100 && height >= 50)) {
                    this.subcategoriaTO.marker = archivo;
                  } else {
                    this._notificacionService.alerta('el icono marker no cumple con el tamaño');
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
    this.subcategoriaTO.id_giro = this.subcategoriaTO.id_giro;
    this.presentLoading();
    this.servicioUsuarios.guardarSubcategoria(this.subcategoriaTO).subscribe(
      data => {
        if (data.code === 200) {
          this.loader.dismiss();
          this.cerraDatosSubcategoria();
          //this.admin.listaSubcategoria();
          this._notificacionService.exito('Los datos se guardaron correctamente');
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

}

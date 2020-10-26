import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatAvisosInfoModel } from '../../../../../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { ActionSheetController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilsCls } from "../../../../../utils/UtilsCls";
import { ArchivoComunModel } from "../../../../../Modelos/ArchivoComunModel";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos-avisos-informacion',
  templateUrl: './datos-avisos-informacion.page.html',
  styleUrls: ['./datos-avisos-informacion.page.scss'],
})
export class DatosAvisosInformacionPage implements OnInit {
  public actualTO: FiltroCatAvisosInfoModel;
  public avisoTO: FiltroCatAvisosInfoModel;
  private file_img_galeria: FileList;
  public activos = [
    { id: 0, activo: 'No' },
    { id: 1, activo: 'Si' },
  ];
  public tipos = [
    { id: 1, tipo: 'Aviso' }
  ];

  public valida:boolean;

  constructor(
    private servicioAdminitracion: AdministracionService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private _utils_cls: UtilsCls,
    private router: Router,
    private active: ActivatedRoute
  ) { 
    this.valida=false;
  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.avisoTO=this.actualTO;
      }
    });
    
  }

  actualizarDatos(formBasicos: NgForm) {
    //this.loader = true;
    this.servicioAdminitracion.guardarAviso(this.avisoTO).subscribe(
      data => {
        if (data.code === 200) {
          
          //this._notificacionService.pushInfo('Los datos se guardaron correctamente');
          //this.loader = false;
          this.regresar();
          this.guardados();
          //this.admin.activarTabla();
        } else {
          //this.loader = false;
          //this._notificacionService.pushError(data.message);
          console.log("no se pudo");
          
        }
      },
      error => {
        //this._notificacionService.pushError(error);
        //this.loader = false;
        this.errorServidor();
      }
    );
  }
  regresar() {
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/tabs/home/cat-avisos'], { queryParams: {special: true}  });
    //this.admin.activarTablaPopover();
  }

  public subirArchivo(event) {
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

          if (width === 1500 && height === 300) {
            this.file_img_galeria = event.target.files;
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
                this.avisoTO.imagen_previa = archivo;
              }
            );
          } else {
            //this._notificacionService.pushAlert('La imagen no cumple con el formato 1500 * 300');
          }
        };
      };
    }
  }

  eliminarAviso() {
    //this.loader = true;
    this.servicioAdminitracion.eliminarAviso(this.avisoTO.id_aviso).subscribe(
      response => {
        if (response.code === 200) {
          //this.loader = false;
          this.regresar();
          this.borrado();
          //this.cancelarConfirmado();
          //this._notificacionService.pushInfo('se elimino correctamente');
        } else {
          //this.loader = false;
          //this.cancelarConfirmado();
          //this._notificacionService.pushError(response.message);
        }
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        handler: () => {
          this.presentAlertMultipleButtons();
        }
      },{
        text: 'Editar',
        role: 'edit',
        handler: () => {
          this.editarorno();
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.regresar();
        }
      }
    ]
    });
    await actionSheet.present();
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Borrar",
      message: "Confirmar borrar aviso",
      buttons: [
        {
          text: "Cancelar",
          role: "No",
          handler: (blah) => {
            
          },
        },
        {
          text: "Confirmar",
          role: "Si",
          handler: (blah) => {
            this.eliminarAviso();
          },
        },
      ],
    });
    await alert.present();
  }

  editarorno(){
    this.valida= true;
  }

  async borrado() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Aviso borrado"
    });
    await alert.present();
  }

  async errorServidor() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Error con el servidor"
    });
    await alert.present();
  }
  async guardados() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Aviso Guardado"
    });
    await alert.present();
    this.regresar();
  }
  

}

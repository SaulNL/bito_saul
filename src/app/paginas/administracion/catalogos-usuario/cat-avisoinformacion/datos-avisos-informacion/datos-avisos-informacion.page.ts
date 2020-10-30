import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatAvisosInfoModel } from '../../../../../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilsCls } from "../../../../../utils/UtilsCls";
import { ArchivoComunModel } from "../../../../../Modelos/ArchivoComunModel";
import { Router, ActivatedRoute } from '@angular/router';
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";

@Component({
  selector: 'app-datos-avisos-informacion',
  templateUrl: './datos-avisos-informacion.page.html',
  styleUrls: ['./datos-avisos-informacion.page.scss'],
})
export class DatosAvisosInformacionPage implements OnInit {
  public actualTO: FiltroCatAvisosInfoModel;
  public avisoTO: FiltroCatAvisosInfoModel;
  private file_img_galeria: FileList;
  btnCargarNuevaImagen:boolean;
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
    private noti:  ToadNotificacionService,
    public loadingController: LoadingController,
    private _utils_cls: UtilsCls,
    private router: Router,
    private active: ActivatedRoute
  ) { 
    this.valida=false;
    this.btnCargarNuevaImagen=false;
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
    if(this.btnCargarNuevaImagen === true){
      this.presentLoading(10500); 
    }else{
      this.presentLoading(500);
    }
    this.servicioAdminitracion.guardarAviso(this.avisoTO).subscribe(
      data => {
        if (data.code === 200) {
          this.regresar();
          this.noti.exito("Los datos se guardaron correctamente");
        } else {
          this.noti.error(data.message);
        }
      },
      error => {
        this.noti.error(error);
      }
    );
  }
  regresar() {
    this.router.navigate(['/tabs/home/cat-avisos'], { queryParams: {special: true}  });
  }

  public subirArchivo(event) {
    this.btnCargarNuevaImagen=true;
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
            this.noti.alerta('La imagen no cumple con el formato 1500 * 300');
          }
        };
      };
    }
  }

  eliminarAviso() {
    this.servicioAdminitracion.eliminarAviso(this.avisoTO.id_aviso).subscribe(
      response => {
        if (response.code === 200) {
          this.regresar();
          this.noti.exito("se elimino correctamente");
        } else {
          this.noti.error(response.message);
        }
      },
      error => {
        this.noti.error(error); 
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

  async presentLoading(tiempo:number) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      duration: tiempo
    });
    await loading.present();
  }

  editarorno(){
    this.valida= true;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatAvisosInfoModel } from '../../../../../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { AdministracionService } from "../../../../../api/administracion-service.service";
import {CatAvisoinformacionPage} from '../cat-avisoinformacion.page';
import { NgForm } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-datos-popover',
  templateUrl: './datos-popover.page.html',
  styleUrls: ['./datos-popover.page.scss'],
})
export class DatosPopoverPage implements OnInit {
  @Input() public actualTO: FiltroCatAvisosInfoModel;
  public popoverTO: FiltroCatAvisosInfoModel;
  public activos = [
    { id: 0, activo: 'No' },
    { id: 1, activo: 'Si' },
  ];
  public tipos = [
    { id: 2, tipo: 'Popover' }
  ];
  public valida:boolean;

  constructor(
    private servicioAdminitracion: AdministracionService,
    private admin: CatAvisoinformacionPage,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) { 
    this.valida=false;
  }

  ngOnInit() {
    this.popoverTO = this.actualTO;
  }

  actualizarDatos(formBasicos: NgForm) {
    //this.loader = true;
    this.servicioAdminitracion.guardarPopever(this.popoverTO).subscribe(
      data => {
        if (data.code === 200) {
          this.admin.blnActivaDatosPopover=false;
          this.admin.getAvisos();
          this.guardados();
          //this._notificacionService.pushInfo('Los datos se guardaron correctamente');
          //this.loader = false;
          //this.admin.activarTablaPopover();
        } else {
          //this.loader = false;
          //this._notificacionService.pushError(data.message);
        }
      },
      error => {
        //this._notificacionService.pushError(error);
        //this.loader = false;
        console.log(error);        
      }
    );
  }
  eliminarAviso() {
    //this.loader = true;
    this.servicioAdminitracion.eliminarAviso(this.popoverTO.id_aviso).subscribe(
      response => {
        if (response.code === 200) {
          //this.loader = false;
          this.admin.blnActivaDatosPopover=false;
          this.admin.getAvisos();
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
  regresar() {
    //window.scrollTo({ top: 0, behavior: 'smooth' });
    this.admin.blnActivaDatosPopover = false;
    //this.admin.activarTablaPopover();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        handler: () => {
          //this.eliminarOrganizacion();
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
      message: "Confirmar borrar popover",
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
      header: "Popover borrado"
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
      header: "Popover Guardado"
    });
    await alert.present();
    this.regresar();
  }
}

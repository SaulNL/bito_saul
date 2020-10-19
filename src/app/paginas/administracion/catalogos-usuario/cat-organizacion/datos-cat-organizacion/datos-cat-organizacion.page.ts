import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { FiltroCatOrgModel } from '../../../../../Modelos/catalogos/FiltroCatOrgModel';
import {NgForm} from "@angular/forms";
import {CatOrganizacionPage} from '../cat-organizacion.page';


@Component({
  selector: 'app-datos-cat-organizacion',
  templateUrl: './datos-cat-organizacion.page.html',
  styleUrls: ['./datos-cat-organizacion.page.scss'],
})
export class DatosCatOrganizacionPage implements OnInit {
  @Input() public actualTO: FiltroCatOrgModel;
  public organizacionTO: FiltroCatOrgModel;
  public filtro=new FiltroCatOrgModel();
  public valida:boolean;
  constructor(
    private administracionService: AdministracionService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private admin:CatOrganizacionPage
  ) { 
    this.valida=false;
  }

  ngOnInit() {
    this.organizacionTO = this.actualTO;
  }
  
  eliminarOrganizacion() {
    //this.loader = true;
    this.administracionService.eliminarOrganizacion(this.organizacionTO.id_organizacion).subscribe(
      response => {
        if (response.code === 200) {
          this.admin.blnActivaDatosOrganizacion=false;
          this.admin.getOrganizaciones();
          this.borrado();
          //this.loader = false;
          //this.getOrganizaciones();
          //this.cancelarConfirmado();
          //this._notificacionService.pushInfo('se elimino correctamente');
        } else {
          //this.loader = false;
          //this.cancelarConfirmado();
          //this._notificacionService.pushError(response.message);
        }
      },
      error => {
        console.log(error);        
        //this._notificacionService.pushError(error);
      }
    );
  }

  actualizarDatos(formBasicos: NgForm) {
    //this.loader = true;
    this.administracionService.guardarCatOrganizacion(this.organizacionTO).subscribe(
      data => {
        if (data.code === 200) {        
          this.admin.blnActivaDatosOrganizacion=false;
          this.admin.getOrganizaciones();
          this.guardados();
          //this._notificacionService.pushInfo('Los datos se guardaron correctamente');
          //this.loader = false;
          //this.admin.getOrganizaciones();
          //this.admin.blnActivaDatosOrganizacion = false;
          //this.admin.activarTabla();
        } else {
          //this.loader = false;
          //this._notificacionService.pushError(data.message);     
        }
      },
      error => {
        this.errorServidor();
        //this._notificacionService.pushError(error);
        //this.loader = false;       
      }
    );
  }

  regresar(){
    this.admin.blnActivaDatosOrganizacion = false;
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
      message: "Confirmar borrar Organización",
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
            this.eliminarOrganizacion();
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
      header: "Organizacion borrada"
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
      header: "Organización Guardada"
    });
    await alert.present();
    this.regresar();
  }
}

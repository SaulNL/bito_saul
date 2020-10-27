import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { FiltroCatOrgModel } from '../../../../../Modelos/catalogos/FiltroCatOrgModel';
import {NgForm} from "@angular/forms";
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-datos-cat-organizacion',
  templateUrl: './datos-cat-organizacion.page.html',
  styleUrls: ['./datos-cat-organizacion.page.scss'],
})
export class DatosCatOrganizacionPage implements OnInit {
  public actualTO: FiltroCatOrgModel;
  public organizacionTO: FiltroCatOrgModel;
  public filtro=new FiltroCatOrgModel();
  public valida:boolean;
    loader:boolean;
  constructor(
    private administracionService: AdministracionService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.valida=false;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.organizacionTO = this.actualTO;
      }
    });
  }
  
  
  eliminarOrganizacion() {
    //this.loader = true;
    this.administracionService.eliminarOrganizacion(this.organizacionTO.id_organizacion).subscribe(
      response => {
        if (response.code === 200) {
          this.regresar();
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
          this.regresar();
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
    this.router.navigate(['/tabs/home/cat-organizaciones'], { queryParams: {special: true}  });
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

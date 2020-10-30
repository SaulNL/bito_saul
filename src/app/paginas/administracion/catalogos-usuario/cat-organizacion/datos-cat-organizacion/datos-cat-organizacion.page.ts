import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { FiltroCatOrgModel } from '../../../../../Modelos/catalogos/FiltroCatOrgModel';
import {NgForm} from "@angular/forms";
import {Router, ActivatedRoute} from '@angular/router';
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";

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
  constructor(
    private administracionService: AdministracionService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private noti:  ToadNotificacionService,
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
    this.administracionService.eliminarOrganizacion(this.organizacionTO.id_organizacion).subscribe(
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

  actualizarDatos(formBasicos: NgForm) {
    this.administracionService.guardarCatOrganizacion(this.organizacionTO).subscribe(
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
}

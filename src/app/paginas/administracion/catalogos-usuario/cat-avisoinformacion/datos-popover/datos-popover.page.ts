import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatAvisosInfoModel } from '../../../../../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { AdministracionService } from "../../../../../api/administracion-service.service";
import { NgForm } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";

@Component({
  selector: 'app-datos-popover',
  templateUrl: './datos-popover.page.html',
  styleUrls: ['./datos-popover.page.scss'],
})
export class DatosPopoverPage implements OnInit {
  public actualTO: FiltroCatAvisosInfoModel;
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
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private noti:  ToadNotificacionService,
    private router: Router,
    private active: ActivatedRoute
  ) { 
    this.valida=false;
  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
        this.popoverTO = this.actualTO;

      }
    });
  }

  actualizarDatos(formBasicos: NgForm) {
    this.servicioAdminitracion.guardarPopever(this.popoverTO).subscribe(
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
  eliminarAviso() {
    this.servicioAdminitracion.eliminarAviso(this.popoverTO.id_aviso).subscribe(
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
  regresar() {
    this.router.navigate(['/tabs/home/cat-avisos'], { queryParams: {special: true}  });
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
}

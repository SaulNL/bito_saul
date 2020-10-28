import { Component, OnInit, Input } from '@angular/core';
import { FiltroCatVariableModel } from '../../../../../Modelos/catalogos/FiltroCatVariableModel';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { AlertController } from "@ionic/angular";
import {NgForm} from "@angular/forms";
import { ActionSheetController } from '@ionic/angular';
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-datos-cat-variables',
  templateUrl: './datos-cat-variables.page.html',
  styleUrls: ['./datos-cat-variables.page.scss'],
})
export class DatosCatVariablesPage implements OnInit {
  public variableTO: FiltroCatVariableModel;
  public loaderGiro: boolean;
  public id: any;
  loader: boolean;
  load: boolean;
  selectTO: FiltroCatVariableModel;
  public lstCatVariable: Array<any>;
  public filtro: FiltroCatVariableModel;
  public valida: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private noti:  ToadNotificacionService,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private servicioUsuarios: AdministracionService,
    public alertController: AlertController,
    private router: Router,
    ) {
      this.variableTO = new FiltroCatVariableModel();
      this.valida= false;
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.variableTO = JSON.parse(params.special);
      }
    });
  }
  regresar(){
    this.router.navigate(['/tabs/home/cat-variable'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosVariable = false;
    //this.admin.getVariables();
  }
  actualizarDatos(form: NgForm) {
    this.servicioUsuarios.guardarVarible(this.variableTO).subscribe(
      (data) => {
        if (data.code === 200) {
          this.noti.exito("Se guardo con exito");
          this.regresar();
        } 
        if (data.code === 309) {
          this.noti.alerta("La Variable ya existe");
        }
      },
      (error) => {
        this.noti.error(error);
      }
    );
  }
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Borrar",
      message: "Confirmar borrar variable",
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
            
            this.modalEliminar();
          },
        },
      ],
    });
    await alert.present();
  }
  modalEliminar() {
    this.servicioUsuarios
      .eliminarVariable(this.variableTO.id_variable)
      .subscribe(
        (response) => {
          this.noti.exito("Variable borrada");
          this.regresar();
        },
        (error) => {
          this.noti.error(error);
        }
      );
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
        text: 'Borrar',
        role: 'destructive',
        handler: () => {
          this.presentAlertMultipleButtons();
        }
      }, {
        text: 'Editar',
        role: 'edit',
        handler: () => {
          this.editarorno();
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
  editarorno(){
      this.valida= true;
  }
}

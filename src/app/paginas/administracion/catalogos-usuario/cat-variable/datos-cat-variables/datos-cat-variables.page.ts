import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FiltroCatVariableModel } from '../../../../../Modelos/catalogos/FiltroCatVariableModel';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { AlertController } from "@ionic/angular";
import {NgForm} from "@angular/forms";
import { CatVariablePage } from "../cat-variable.page";
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-datos-cat-variables',
  templateUrl: './datos-cat-variables.page.html',
  styleUrls: ['./datos-cat-variables.page.scss'],
})
export class DatosCatVariablesPage implements OnInit {
  
  @Input() public actualTO: FiltroCatVariableModel;
  public variableTO: FiltroCatVariableModel;
  public loaderGiro: boolean;
  public id: any;
  loader: boolean;
  load: boolean;
  selectTO: FiltroCatVariableModel;
  public lstCatVariable: Array<any>;
  public filtro: FiltroCatVariableModel;
  public valida: boolean;
  constructor(public actionSheetController: ActionSheetController
    ,private admin: CatVariablePage,
    private route: ActivatedRoute,
    private servicioUsuarios: AdministracionService,
    public alertController: AlertController) {
      this.variableTO = new FiltroCatVariableModel();
      this.valida= false;
   }

  ngOnInit() {
    this.variableTO = this.actualTO;
  }
  regresar(){
    this.admin.blnActivaDatosVariable = false;
  }
  actualizarDatos(form: NgForm) {
    this.servicioUsuarios.guardarVarible(this.variableTO).subscribe(
      (data) => {
        if (data.code === 200) {
          this.guardados();
        } 
        if (data.code === 309) {
          this.errorNombre();
        }
      },
      (error) => {
        this.errorServidor();
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
  async errorNombre() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "La variable ya existe"
    });
    await alert.present();
  }
  async borrado() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Variable borrada"
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
  async errorEnUso() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Esta Variable esta en uso"
    });
    await alert.present();
  }
  async guardados() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Variable Guardada"
    });
    await alert.present();
    this.regresar();
  }
  
  modalEliminar() {
    this.servicioUsuarios
      .eliminarVariable(this.variableTO.id_variable)
      .subscribe(
        (response) => {
            this.borrado();
          this.regresar();
        },
        (error) => {
          this.regresar();
          this.errorServidor();
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

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UtilsCls } from "../../utils/UtilsCls";
import {AppSettings} from "../../AppSettings";
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  providers: [
    UtilsCls
  ]
})
export class AjustesPage implements OnInit {
  usuario: any;
  public url_user: string;
  constructor(
    private util: UtilsCls,
    public actionSheetController: ActionSheetController,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.usuario = this.util.getData();
    this.url_user = AppSettings.API_ENDPOINT + 'img/user.png';
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Perfil',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Mi Cuenta',
        icon: 'person-outline',
        handler: () => {
          this._router.navigate(['/tabs/datos-basicos']);
        }
      }, {
        text: 'Cambiar Contraseña',
        icon: 'key-outline',
        handler: () => {
          this._router.navigate(['/tabs/cambio-contrasenia']);
        }
      }, {
        text: 'Datos Complementarios',
        icon: 'create-outline',
        handler: () => {
          this._router.navigate(['/tabs/datos-complementarios']);
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

}

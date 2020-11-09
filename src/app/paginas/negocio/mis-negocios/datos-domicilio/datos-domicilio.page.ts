import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: 'app-datos-domicilio',
  templateUrl: './datos-domicilio.page.html',
  styleUrls: ['./datos-domicilio.page.scss'],
})
export class DatosDomicilioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  constructor(private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController) {
      this.valido = false;
     }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO  = JSON.parse(params.special);
      }
    });
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          role: "save",
          handler: () => {
            this.valido = true;
          },
        },
        {
          text: "Cancel",
          icon: "close",
          
          handler: () => {this.valido=false;  },
        },
      ],
    });
    await actionSheet.present();
  }
  regresarMis() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: 'app-informacion-negocio',
  templateUrl: './informacion-negocio.page.html',
  styleUrls: ['./informacion-negocio.page.scss'],
})
export class InformacionNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  constructor(private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController) {
      this.valido=false;
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
            this.valido=true;
            //
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios"], {
      queryParams: { special: navigationExtras },
    });
  }
}

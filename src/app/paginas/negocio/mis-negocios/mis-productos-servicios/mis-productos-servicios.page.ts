import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: 'app-mis-productos-servicios',
  templateUrl: './mis-productos-servicios.page.html',
  styleUrls: ['./mis-productos-servicios.page.scss'],
})
export class MisProductosServiciosPage implements OnInit {
  public negocioTO: NegocioModel;
  public iden: number;
  public datos: any;
  constructor(private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO  = this.datos.info;
      }
    });
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Agregar nueva clasificación",
          role: "save",
          handler: () => {
            //
          },
        },
        {
          text: "Guardar",
          role: "save",
          handler: () => {
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
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  datosProductosServicios(tre){
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    
   let all = {
     inden: this.iden,
      info: this.negocioTO,
       pys: tre
      };

    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/mis-productos-servicios/datos-productos-servicios"], {
      queryParams: { special: navigationExtras },
    });
  }

}

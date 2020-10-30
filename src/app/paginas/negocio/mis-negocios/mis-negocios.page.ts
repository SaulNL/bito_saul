import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: 'app-mis-negocios',
  templateUrl: './mis-negocios.page.html',
  styleUrls: ['./mis-negocios.page.scss'],
})
export class MisNegociosPage implements OnInit {
  public negocioTO: NegocioModel;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) { 
    
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
          text: "Desactivar",
          role: "desactivar",
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
    this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosCategoria = true;
  }
  inforNegocio(negocio: NegocioModel){
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/informacion-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }
  datosContacto(negocio: NegocioModel){
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
  datosDomicilio(negocio: NegocioModel){
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-domicilio"], {
      queryParams: { special: navigationExtras },
    });
  }
  productos(negocio: NegocioModel){
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/productos"], {
      queryParams: { special: navigationExtras },
    });
  }
  servicios(negocio: NegocioModel){
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/servicios"], {
      queryParams: { special: navigationExtras },
    });
  }
}
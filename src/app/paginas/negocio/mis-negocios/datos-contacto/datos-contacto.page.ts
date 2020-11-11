import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-datos-contacto",
  templateUrl: "./datos-contacto.page.html",
  styleUrls: ["./datos-contacto.page.scss"],
})
export class DatosContactoPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  public variaf: boolean;
  public variat: boolean;
  public variay: boolean;
  public variai: boolean;
  public variak: boolean;
  public datos: any;
  public iden: any;
  public negocioGuardar: any;
  public nuevoPS: any;
  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) {
    this.valido = false;
    this.variaf = false;
    this.variat = false;
    this.variay = false;
    this.variai = false;
    this.variak = false;
    this.negocioGuardar = new NegocioModel();
  }

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {

        this.datos = JSON.parse(params.special);
        this.negocioTO = this.datos.info;
        this.negocioGuardar = this.datos.pys;
        console.log(this.negocioTO);
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

  regresar() {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/card-negocio/info-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresarMis() {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }
  
  datosDomicilio(negocio: NegocioModel) {
    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-domicilio"], {
      queryParams: { special: navigationExtras },
    });
  }
}

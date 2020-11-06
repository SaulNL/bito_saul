import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NegocioModel } from "./../../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-datos-productos-servicios",
  templateUrl: "./datos-productos-servicios.page.html",
  styleUrls: ["./datos-productos-servicios.page.scss"],
})
export class DatosProductosServiciosPage implements OnInit {
  public negocioTO: NegocioModel;
  public datos: any;
  public iden: any;
  public syp: any;
  public nuevoPS: any;
  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO = this.datos.info;
        this.syp = this.datos.pys;
      }
    });
  }

  datosProductosServicios(tre) {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));

    let all = {
      inden: this.iden,
      info: this.negocioTO,
      pys: this.syp,
      spnuevo: tre,
    };

    let navigationExtras = JSON.stringify(all);
    this.router.navigate(
      [
        "/tabs/home/negocio/mis-negocios/mis-productos-servicios/datos-productos-servicios/datos-pys",
      ],
      {
        queryParams: { special: navigationExtras },
      }
    );
  }

  regresar() {
    let navigationExtras = JSON.stringify(this.datos);
    this.router.navigate(
      ["/tabs/home/negocio/mis-negocios/mis-productos-servicios"],
      {
        queryParams: { special: navigationExtras },
      }
    );
  }
}

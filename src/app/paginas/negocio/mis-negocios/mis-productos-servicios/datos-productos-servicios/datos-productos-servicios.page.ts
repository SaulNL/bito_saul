import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../../Modelos/NegocioModel";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: 'app-datos-productos-servicios',
  templateUrl: './datos-productos-servicios.page.html',
  styleUrls: ['./datos-productos-servicios.page.scss'],
})
export class DatosProductosServiciosPage implements OnInit {
public negocioTO: NegocioModel;
public datos:any;
public iden:any;
public syp: any;
  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.datos = JSON.parse(params.special);
        this.iden = this.datos.inden;
        this.negocioTO  = this.datos.info;
        this.syp= this.datos.pys;
      }
    });
  }
  
  regresar() {
    let navigationExtras = JSON.stringify(this.datos);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/mis-productos-servicios"], {
      queryParams: { special: navigationExtras },
    });
  }

}

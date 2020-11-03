import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";

@Component({
  selector: 'app-view-qr',
  templateUrl: './view-qr.page.html',
  styleUrls: ['./view-qr.page.scss'],
})
export class ViewQrPage implements OnInit {
  public negocioTO: NegocioModel;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private notif: ToadNotificacionService
  ) { }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO  = JSON.parse(params.special);
        if (this.negocioTO.url_negocio == null || this.negocioTO.url_negocio == undefined){
          this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
        }

      }
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosCategoria = true;
  }
}

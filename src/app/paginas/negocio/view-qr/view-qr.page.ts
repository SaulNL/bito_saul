import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { AppSettings} from "../../../AppSettings";

@Component({
  selector: 'app-view-qr',
  templateUrl: './view-qr.page.html',
  styleUrls: ['./view-qr.page.scss'],
})
export class ViewQrPage implements OnInit {
  public negocioTO: NegocioModel;
  public qrdata: string = null;
  public elementType: "img" | "url" | "canvas" | "svg" = null;
  public level: "L" | "M" | "Q" | "H";
  public scale: number;
  public width: number;
  public colorLight: any; 
  public colorDark: any; 

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private notif: ToadNotificacionService,
  ) {
    this.elementType = "img";
    this.level = "H";
    this.scale = 0.4;
    this.width = 512;
    this.colorLight = '#ffffff';
    this.colorDark = '#f100db';
   }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO  = JSON.parse(params.special);
        if (this.negocioTO.url_negocio == null || this.negocioTO.url_negocio == undefined){
          this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
        } else{
          this.qrdata = AppSettings.URL_MOVIL+this.negocioTO.url_negocio;
        }

      }
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    //this.admin.blnActivaDatosCategoria = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioService } from "../../../api/negocio.service";
import { ToadNotificacionService } from "./../../../api/toad-notificacion.service";

@Component({
  selector: 'app-card-negocio',
  templateUrl: './card-negocio.page.html',
  styleUrls: ['./card-negocio.page.scss'],
})
export class CardNegocioPage implements OnInit {
  public negocioTO: NegocioModel;
  public negocioGuardar: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService,
    private notification: ToadNotificacionService
  ) { 
    this.negocioGuardar = new NegocioModel();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
        if (this.negocioTO.id_negocio==null){
          this.router.navigate(['/tabs/home/negocio']);
         } else{
          this.buscarNegocio();
         }
      } else{ 
        this.router.navigate(['/tabs/home/negocio']);
        this.notification.error("Reintentar");
      }
    });
  }

  public buscarNegocio() {
    
    this.negocioServico.buscarNegocio(this.negocioTO.id_negocio).subscribe(
      response => {
        this.negocioTO = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }
  inforNegocio(negocio: NegocioModel) {

    this.negocioTO = JSON.parse(JSON.stringify(negocio));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(['/tabs/home/negocio/card-negocio/info-negocio'], {
      queryParams: { special: navigationExtras },
    });
  }
  regresar(){
    this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
  }
}

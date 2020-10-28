import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-card-solicitud',
  templateUrl: './card-solicitud.page.html',
  styleUrls: ['./card-solicitud.page.scss'],
})
export class CardSolicitudPage implements OnInit {
  public solicitud: SolicitudesModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicitud = JSON.parse(params.special);
      }
    });
  }

  abrirModal(){
    this.solicitud =  JSON.parse(JSON.stringify(this.solicitud));
    let navigationExtras = JSON.stringify(this.solicitud);
    this.router.navigate(['/tabs/home/solicitudes/card-solicitud/modal-publicar-solicitud'], { queryParams: {special: navigationExtras}  });
  }
  public modificar() {
    this.solicitud =  JSON.parse(JSON.stringify(this.solicitud));
    let navigationExtras = JSON.stringify(this.solicitud);
    this.router.navigate(['/tabs/home/solicitudes/form-solicitud'], { queryParams: {special: navigationExtras}  });
  }

}

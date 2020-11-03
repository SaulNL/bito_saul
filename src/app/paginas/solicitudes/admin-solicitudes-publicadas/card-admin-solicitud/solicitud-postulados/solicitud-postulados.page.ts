import { Component, OnInit } from '@angular/core';
import { PostuladosModel } from 'src/app/Modelos/PostuladosModel';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { SolicitudesService } from '../../../../../api/solicitudes.service';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-solicitud-postulados',
  templateUrl: './solicitud-postulados.page.html',
  styleUrls: ['./solicitud-postulados.page.scss'],
})
export class SolicitudPostuladosPage implements OnInit {
  public lstPostulados: Array<PostuladosModel>;
  public numeroPostulados: number;
  public solicitudPostulado: SolicitudesModel;
  constructor(
    private solicitudesService: SolicitudesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicitudPostulado = JSON.parse(params.special);
      }
    });
    this.lstPostulados = new Array<PostuladosModel>();
    this.obtenerPostulados();
  }

  obtenerPostulados() {
    this.solicitudesService.obtenerPostulados(this.solicitudPostulado.id_solicitud).subscribe(
      response => {
        this.lstPostulados = response.data;
        this.numeroPostulados = this.lstPostulados.length;
      },
      error => {
      }
    );
  }
 selePostulado(solicitud: any){
  let navigationExtras = JSON.stringify(solicitud);
  this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud/solicitud-postulados/card-postulado'] , { queryParams: { special: navigationExtras } });
 }
 regresar() {
  let navigationExtras = JSON.stringify(this.solicitudPostulado);
  this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud'], { queryParams: { special: navigationExtras } });
}
}

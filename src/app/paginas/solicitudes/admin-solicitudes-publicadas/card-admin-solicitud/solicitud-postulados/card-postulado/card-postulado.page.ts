import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { Router, ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '../../../../../../api/solicitudes.service';
import { PostuladosModel } from 'src/app/Modelos/PostuladosModel';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-card-postulado',
  templateUrl: './card-postulado.page.html',
  styleUrls: ['./card-postulado.page.scss'],
})
export class CardPostuladoPage implements OnInit {
  public solicitudPostulado: PostuladosModel;
  public lstPostulados: Array<PostuladosModel>;
  public loader: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private solicitudesService: SolicitudesService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.lstPostulados = new Array<PostuladosModel>();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicitudPostulado = JSON.parse(params.special);
      }
    });
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  public checkSolicitud(postulado: PostuladosModel) {
    this.presentLoading();
    this.solicitudesService.checkendPostulacion(postulado).subscribe(
      response => {
        if (response.code === 200) {
          this.lstPostulados = response.data;
          this.loader.dismiss();
        }
        this.loader.dismiss();
      },
      error => {
        this.loader.dismiss();
      }
    );
  }
}

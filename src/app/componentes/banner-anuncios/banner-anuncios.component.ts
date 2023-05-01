import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BusquedaService } from '../../api/busqueda.service';

@Component({
  selector: 'app-banner-anuncios',
  templateUrl: './banner-anuncios.component.html',
  styleUrls: ['./banner-anuncios.component.scss'],
})
export class BannerAnunciosComponent implements OnInit {

  promocionDefault: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  lstAvisos: any;
  constructor(
    private principalSercicio: BusquedaService,
    public alertController: AlertController,
    ) { }

  ngOnInit() {
    this.obtenerAvisos();
  }

  /**
   * Funcion para obtener avisos
*/
public obtenerAvisos() {
  // this.loaderPromo = true;
  this.principalSercicio.obtenerBannerAvisos().subscribe(
    response => {
      this.lstAvisos = response.data;
      // this.loaderPromo = false;
    },
    error => {
      //this._notificacionService.pushError(error);
    }
  );
}

async presentAlert() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Información',
    message: 'Esta imagen es solo informativa',
    buttons: ['Cerrar']
  });

  await alert.present();
}
}

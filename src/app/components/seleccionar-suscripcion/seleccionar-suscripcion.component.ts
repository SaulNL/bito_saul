import { Component, OnInit, Input, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsCls } from '../../utils/UtilsCls';


@Component({
  selector: 'app-seleccionar-suscripcion',
  templateUrl: './seleccionar-suscripcion.component.html',
  styleUrls: ['./seleccionar-suscripcion.component.scss'],
  providers: [
    UtilsCls
  ]
})
export class SeleccionarSucripcionComponent implements OnInit {

  @Input() public suscripciones;
  planes:any[]
  public planSeleccionado: any;
  slideOpts = {
    slidesPerView: 3,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  }

  constructor(
    public modalController: ModalController,
    private _utils_cls: UtilsCls
  ) { 
  }

  ngOnInit() { 
    this.planes=this.suscripciones
    console.log("LA DATA DE LOS PLANES"+JSON.stringify(this.suscripciones))
  }

  cerrar() {
    this.modalController.dismiss();
  }

  imageCropped(image: any) {
  }

  guardarImagenRecortada() {
    this.modalController.dismiss({
      'data': this.planSeleccionado
    });
  }
}

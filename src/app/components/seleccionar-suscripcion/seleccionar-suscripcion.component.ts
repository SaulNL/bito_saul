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
    /*slidesPerView: 1,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,*/
    autoHeight: false,
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
  }
  public idSuscripcion: any = '';

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

  seleccionarSucripcion(idSuscripcion:any){
    console.log(idSuscripcion)
    this.idSuscripcion=idSuscripcion
    this.modalController.dismiss({
      'data': this.idSuscripcion
    });
  }
}

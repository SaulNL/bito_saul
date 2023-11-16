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
  public bgPerfiles: any[];
  slideOpts = {
    autoHeight: false,
    autoWidht:false,
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
  }
  //public idSuscripcion: any = '';
  public infoSuscripcion:any[]=[];

  constructor(
    public modalController: ModalController,
    private _utils_cls: UtilsCls
  ) { 
    this.bgPerfiles = []
  }

  ngOnInit() { 
    this.planes = this.suscripciones
    this.planes.forEach(element => {
            let perfilesBg = {
              bg: `background: linear-gradient(162deg, ${element.color_inicial} 0%, ${element.color_final} 63%);`
            }
            this.bgPerfiles.push(perfilesBg)
          });
  }

  cerrar() {
    this.modalController.dismiss();
  }

  seleccionarSucripcion(idSuscripcion:number, nombre:string){
    
    //this.idSuscripcion=idSuscripcion
    this.infoSuscripcion=[]
    this.infoSuscripcion.push(idSuscripcion)
    this.infoSuscripcion.push(nombre)
    this.modalController.dismiss({
      'data': this.infoSuscripcion
    });
  }
}

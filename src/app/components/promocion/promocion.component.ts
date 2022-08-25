import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPromocionComponent } from '../modal-promocion/modal-promocion.component';
import { PromocionesModel } from '../../Modelos/PromocionesModel';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.scss'],
})
export class PromocionComponent implements OnInit {

  @Input() promocion: PromocionesModel;
  @Input() idPersona: number | null;
  idPromo: number;
  loader: boolean=true;

  constructor( public modalController: ModalController ) {
  }

  ngOnInit() {
  }


  modal(){
    this.loader = false;
    this.idPromo =this.promocion.id_promocion;
    setTimeout(()=>{                     
      this.crearModal();
    }, 1000);
  }

  async crearModal( ){
    const modal = await this.modalController.create({
      component: ModalPromocionComponent,
      componentProps: {
        'promocion': this.promocion,
        'idPersona': this.idPersona
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      const user = data['data'];
      this.loader=true;
  });
    return await modal.present();
  }

}

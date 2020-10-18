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

  constructor( public modalController: ModalController ) { 
  }

  ngOnInit() {
  }

  async crearModal( ){
    const modal = await this.modalController.create({
      component: ModalPromocionComponent,
      componentProps: {
        'promocion': this.promocion
      }
    });
    return await modal.present();
  }

}

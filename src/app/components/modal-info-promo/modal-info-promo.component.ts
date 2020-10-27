import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuienVioModel } from '../../Modelos/QuienVioModel';

@Component({
  selector: 'app-modal-info-promo',
  templateUrl: './modal-info-promo.component.html',
  styleUrls: ['./modal-info-promo.component.scss'],
})
export class ModalInfoPromoComponent implements OnInit {

  @Input() public lstQuienVioPublicacion: any;
  @Input() public lstQuienVioPublicacionActiva: boolean;
  @Input() public btnLoaderModal: boolean;
  @Input() public numeroVisto: number;

  constructor( public modalController: ModalController ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}

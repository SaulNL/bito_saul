import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-imegen-cupon',
  templateUrl: './modal-imagen-cupon.component.html',
})
export class ModalImagenCuponComponent implements OnInit {
  @Input() imagenCupon: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

}

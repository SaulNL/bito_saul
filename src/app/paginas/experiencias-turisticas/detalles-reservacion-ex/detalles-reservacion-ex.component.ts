import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-detalles-reservacion-ex',
  templateUrl: './detalles-reservacion-ex.component.html',
  styleUrls: ['./detalles-reservacion-ex.component.scss'],
})
export class DetallesReservacionExComponent implements OnInit {

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {}

  regresar(){
    this.modalController.dismiss();
  }

}

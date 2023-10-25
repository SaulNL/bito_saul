import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-detalles-reserva',
  templateUrl: './detalles-reserva.component.html',
  styleUrls: ['./detalles-reserva.component.scss'],
})
export class DetallesReservaComponent implements OnInit {
  constructor(
      private router: Router,
      public modalController: ModalController
  ) {}

  ngOnInit() {}

  regresar(){
    // this.router.navigate(['/tabs/eventos/mis-reservaciones'], {
    //   queryParams: {
    //     special: true
    //   }
    // });
    this.modalController.dismiss();
  }

}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lista-reservacion-experiencias',
  templateUrl: './lista-reservacion-experiencias.page.html',
  styleUrls: ['./lista-reservacion-experiencias.page.scss'],
})
export class ListaReservacionExperienciasPage implements OnInit {

  constructor(
      private router: Router,
  ) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['/tabs/experiencias-turisticas']);
  }

}

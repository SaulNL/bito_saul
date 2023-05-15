import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {

  constructor(
      private router: Router
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.router.navigate(['/tabs/eventos'], {
      queryParams: {
        special: true
      }
    });
  }


}

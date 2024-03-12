import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-agenda-negocio',
  templateUrl: './agenda-negocio.page.html',
  styleUrls: ['./agenda-negocio.page.scss'],
})
export class AgendaNegocioPage implements OnInit {

  constructor(
      private router: Router
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.router.navigate(['/tabs/home']);
  }
}

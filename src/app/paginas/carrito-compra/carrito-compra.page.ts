import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss'],
})
export class CarritoCompraPage implements OnInit {

  constructor(
      private router: Router,
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.router.navigate(['/tabs/home']);
  }


}

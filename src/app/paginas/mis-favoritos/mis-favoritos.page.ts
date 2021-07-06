import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UtilsCls} from '../../utils/UtilsCls';

@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.page.html',
  styleUrls: ['./mis-favoritos.page.scss'],
})
export class MisFavoritosPage implements OnInit {

  public user:any;

  constructor(
      private _router: Router,
      public modalController: ModalController,
      private util: UtilsCls,
  ) {
    this.user = this.util.getUserData();
  }

  ngOnInit() {
    console.log(this.user);
  }

  abrirProductosFavoritos() {
    this._router.navigateByUrl("/tabs/home/mis-favoritos/productos-favoritos");
  }

}

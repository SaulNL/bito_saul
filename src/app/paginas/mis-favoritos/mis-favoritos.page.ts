import {Component, OnInit, ViewChild} from '@angular/core';
import {IonContent, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UtilsCls} from '../../utils/UtilsCls';

@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.page.html',
  styleUrls: ['./mis-favoritos.page.scss'],
})
export class MisFavoritosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public user:any;
  public opcion: any;
  public segmentModel = 'productos';
  public cordenada: number;

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

  segmentChanged(event){
    console.log(this.segmentModel);
    console.log(event);
  }

  abrirProductosFavoritos() {
    this._router.navigateByUrl("/tabs/home/mis-favoritos/productos-favoritos");
  }

  abrirNegociosFavoritos() {
    this._router.navigateByUrl("/tabs/home/mis-favoritos/negocios-favoritos");
  }

  regresar() {
    this._router.navigate(['/tabs/home/mis-favoritos']);
  }


}

import {Component, Input, OnInit} from '@angular/core';
import {UtilsCls} from '../../../utils/UtilsCls';
import {PersonaService} from '../../../api/persona.service';
import {Router} from '@angular/router';
import {ProductoModel} from '../../../Modelos/ProductoModel';
import {ModalProductoPage} from '../../productos/modal-producto/modal-producto.page';
import {AnimationController, ModalController} from '@ionic/angular';
import {ProductosService} from '../../../api/productos.service';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';

@Component({
  selector: 'app-productos-favoritos',
  templateUrl: './productos-favoritos.page.html',
  styleUrls: ['./productos-favoritos.page.scss'],
})
export class ProductosFavoritosPage implements OnInit {

  public user: any;
  public listaProductos: any;
  public unoProducto: ProductoModel;
  public existeSesion: boolean;
  public motrarContacto: boolean;

  constructor(
      private util: UtilsCls,
      private personaService: PersonaService,
      private router: Router,
      public animationCtrl: AnimationController,
      public modalController: ModalController,
      private servicioProductos: ProductosService,
      private notificaciones: ToadNotificacionService,
  ) {
    this.user = this.util.getUserData();
    this.existeSesion = util.existe_sesion();
  }

  ngOnInit() {
    this.obtenerProductosFavoritos();
    this.existeSesion = this.util.existe_sesion();
    this.motrarContacto = true;
  }


  public obtenerProductosFavoritos() {

    if (this.user.id_persona !== undefined) {
      console.log('entras a consumit el servicio');
      console.log(this.user.id_persona);
      this.personaService.obtenerProductosFavoritos(this.user.id_persona).subscribe(

          response => {
            if (response.code === 200) {
              this.listaProductos = response.data.data;
              console.log(this.listaProductos, response);

            }
          },
          error => {
            console.log(error);
          });
    }
  }

  public abrirProducto(producto: ProductoModel) {

    this.unoProducto = producto;
    this.presentModale();
  }

  async presentModale() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
          .create()
          .addElement(baseEl.querySelector("ion-backdrop")!)
          .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

      const wrapperAnimation = this.animationCtrl
          .create()
          .addElement(baseEl.querySelector(".modal-wrapper")!)
          .keyframes([
            {offset: 0, opacity: "0", transform: "scale(0)"},
            {offset: 1, opacity: "0.99", transform: "scale(1)"},
          ]);

      return this.animationCtrl
          .create()
          .addElement(baseEl)
          .easing("ease-out")
          .duration(500)
          .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction("reverse");
    };

    console.log(this.unoProducto);
    console.log(this.existeSesion);
    console.log(this.user);

    const modal = await this.modalController.create({
      component: ModalProductoPage,
      enterAnimation,
      leaveAnimation,
      swipeToClose: true,
      componentProps: {
        unoProducto: this.unoProducto,
        existeSesion: this.existeSesion,
        user: this.user
      },
    });
    return await modal.present();
  }

  public darDislike(producto: ProductoModel) {
    //this.user = this._auth0.getUserData();
    //if(this.user.id_persona !== undefined){
    this.servicioProductos.darLike(producto, this.user).subscribe(
        (response) => {
          if (response.code === 200) {
            producto.likes = response.data;
            producto.usuario_dio_like = 1;
            this.notificaciones.exito(response.message);

          } else {
            producto.usuario_dio_like =  0;
            producto.likes = response.data;

            let index = this.listaProductos.indexOf(producto);

            if (index > -1) {
              this.listaProductos.splice(index, 1);
            }

            this.notificaciones.alerta(response.message);
          }
        },
        (error) => {
          this.notificaciones.error("Error, intentelo más tarde");
        }
    );
    //}
  }

  regresar() {
    this.router.navigate(['/tabs/home/mis-favoritos']);
  }

}
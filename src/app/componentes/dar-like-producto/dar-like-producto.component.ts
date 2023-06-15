import { ProductoModel } from "./../../Modelos/ProductoModel";
import { Component, Input, OnInit } from "@angular/core";
import { ProductosService } from "../../api/productos.service";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: "app-dar-like-producto",
  templateUrl: "./dar-like-producto.component.html",
  styleUrls: ["./dar-like-producto.component.scss"],
})
export class DarLikeProductoComponent implements OnInit {
  @Input() public producto: any;
  @Input() public usuario: any;
  @Input() public mostrarLike: any;

  public loaderLike = false;

  constructor(
    private servicioProducto: ProductosService,
    private notificacion: ToadNotificacionService,
    private alertController: AlertController,
    private router: Router,
  ) {}
  ngOnInit() {}

  public async alerta(){
    const alert = await this.alertController.create({
      header: 'Bitoo!',
      message: "¿Ya tienes una cuenta?",
      buttons: [
        {
          text: "Iniciar sesión",
          cssClass: 'text-grey',
          handler: () => {
            this.router.navigate(['/tabs/login']);
          }
        },
        {
          text: "Registrate",
          cssClass: 'text-rosa',
          handler: () => {
            this.router.navigate(["/tabs/login/sign-up"]);
          },
        },
      ],
    });

    await alert.present();
  }

  public darLike(producto: ProductoModel) {
    if (!this.mostrarLike) {
      this.alerta();
    } else {
      this.loaderLike = true;
      if (producto.usuario_dio_like !== 0){
        producto.usuario_dio_like = 0;
      }else {
        producto.usuario_dio_like = 1;
      }
      this.servicioProducto.darLike(producto, this.usuario).subscribe(
          (response) => {
            if (response.code === 200) {
              producto.likes = response.data;
              producto.usuario_dio_like = 1;
              //this.notificacion.exito(response.message);
            } else {
              producto.usuario_dio_like = 0;
              producto.likes = response.data;
              //this.notificacion.alerta(response.message);
            }
            this.loaderLike = false;
          },
          (error) => {
            this.notificacion.error("Error, intentelo más tarde");
          }
      );
    }


  }
}

import {Component, Input, OnInit} from '@angular/core';
import {ProductoModel} from "../../../Modelos/ProductoModel";
import {ModalController} from "@ionic/angular";
import {NegocioService} from "../../../api/negocio.service";
import {Router} from "@angular/router";
import { ProductosService } from "../../../api/productos.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {
  @Input() public existeSesion: boolean;
  @Input() public unoProducto: ProductoModel;
  @Input() public user: any;

  slideOpts ={
    scrollbar:true
  }
  constructor(private servicioProductos: ProductosService,
      public modalCtrl: ModalController,
      private negocioServico: NegocioService,
      private router:Router,
      private notificaciones: ToadNotificacionService
  ) {
    
   }

  ngOnInit() {
    
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  verMas(producto: ProductoModel){
    this.negocioServico.buscarNegocio(producto.negocio.idNegocio).subscribe(
        (response) => {
          this.router.navigate(['/tabs/negocio/' + response.data.url_negocio], {
            queryParams: { route: true }});
          this.modalCtrl.dismiss({
            'dismissed': true
          });
        },
        (error) => {
          console.log(error);
        }
    );
  }
  login(){
    this.router.navigate(['/tabs/login']);
          this.modalCtrl.dismiss({
            'dismissed': true
          });
  }
  public darLike(producto: ProductoModel) {
    //this.user = this._auth0.getUserData();
    //if(this.user.id_persona !== undefined){
    this.servicioProductos.darLike(producto, this.user).subscribe(
      (response) => {
        if (response.code === 200) {
          producto.likes = response.data;
          this.notificaciones.exito(response.message);
        } else{
          this.notificaciones.alerta(response.message);
        }
        //this.notificaciones.exito(response.message);
        
      },
      (error) => {
        this.notificaciones.error("Error, intentelo más tarde");
      }
    );
    //}
  }

}

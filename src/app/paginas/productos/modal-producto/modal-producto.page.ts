import {Component, Input, OnInit} from '@angular/core';
import {ProductoModel} from "../../../Modelos/ProductoModel";
import {ModalController} from "@ionic/angular";
import {NegocioService} from "../../../api/negocio.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {
  @Input() public existeSesion: boolean;
  @Input() public unoProducto: ProductoModel;

  slideOpts ={
    scrollbar:true
  }
  constructor(
      public modalCtrl: ModalController,
      private negocioServico: NegocioService,
      private router:Router
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
          this.router.navigate(['/tabs/negocio/' + response.data.url_negocio]);
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
}

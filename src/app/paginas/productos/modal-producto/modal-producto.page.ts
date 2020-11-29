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

  @Input() public seleccionadoDetalleArray: Array<ProductoModel>;

  slideOpts ={
    scrollbar:true
  }
  constructor(
      public modalCtrl: ModalController,
      private negocioServico: NegocioService,
      private router:Router,
  ) { }

  ngOnInit() {

  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  verMas(producto: ProductoModel){
    console.log(producto.negocio.idNegocio)
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

}

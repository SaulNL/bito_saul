import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { ProductosService } from './../../../api/productos.service';
import { ProductLikeInterface, SendLikeProductInterface, SendLikeProductModel } from '../../models/product-like-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-like-product',
  templateUrl: './like-product.component.html',
  styleUrls: ['./like-product.component.scss'],
})
export class LikeProductComponent implements OnInit {
  @Input() public productLike: ProductLikeInterface;

  constructor(
    private productServices: ProductosService,
    private toadNotificacionService: ToadNotificacionService
  ) { }

  ngOnInit() { }

  public onClickLike() {
    const sendProductLike: SendLikeProductInterface = new SendLikeProductModel(this.productLike.idProduct, this.productLike.idPerson);
    this.productServices.likeProduct(sendProductLike).subscribe(
      (response) => {
        this.productLike.likes = response.data;
        if (response.code === 200) {
          this.productLike.like = true;
          this.toadNotificacionService.success(response.message);
        } else {
          this.productLike.like = false;
          this.toadNotificacionService.alerta(response.message);
        }
      }, () => {
        this.toadNotificacionService.error('Error, intentelo más tarde');
      }
    );
  }

}

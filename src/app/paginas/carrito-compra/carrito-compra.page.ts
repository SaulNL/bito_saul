import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NegocioService} from "../../api/negocio.service";
import {ModalController} from "@ionic/angular";
import {PedidoNegocioComponent} from "../../componentes/pedido-negocio/pedido-negocio.component";

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss'],
})
export class CarritoCompraPage implements OnInit {
  productos: any;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  constructor(
      private router: Router,
      private negocioService: NegocioService,
      public modalController: ModalController,
  ) {
    this.productos = [];
    this.loaderReservaciones = false;
  }

  ngOnInit() {
  }

  regresar() {
    const abrirBolsa = JSON.parse(localStorage.getItem('abrirBolsa'));
    if ( abrirBolsa === 2){
      this.router.navigate(['/tabs/home']);
    } else if (abrirBolsa === 1 ){
      const urlNegocio = JSON.stringify(localStorage.getItem('urlNegocio1'));
      const negocioUrl = urlNegocio.slice(1, -1);
      this.router.navigate(['/tabs/negocio/' + negocioUrl]);
    }
  }

  ionViewWillEnter(){
    this.obtenerCarrito();
  }

  obtenerCarrito(){
    setTimeout(() => {
      this.productos =  JSON.parse(localStorage.getItem('cartProducts'));
    }, 200);
    if ( this.productos === undefined || this.productos === null ){
      this.productos = [];
    }
    this.loaderReservaciones = true;
    console.log('productos', this.productos);
  }

  eliminarProducto(idProducto: string){
    const productIndex = this.productos.findIndex(p => p.productoInfo.some(prod => prod.idProducto === idProducto));
    if (productIndex !== -1) {
      const product = this.productos[productIndex];
      const subProductIndex = product.productoInfo.findIndex(prod => prod.idProducto === idProducto);
      if (subProductIndex !== -1) {
        product.productoInfo.splice(subProductIndex, 1);
        if (product.productoInfo.length === 0) {
          this.productos.splice(productIndex, 1);
        }
        localStorage.setItem('cartProducts', JSON.stringify(this.productos));
        if ( this.productos.length === 0 ){
          localStorage.removeItem('cartProducts');
        }
      }
    }
  }

  actualizarProducto(idProducto: string, num: number){
    for (const cartProduct of this.productos) {
      const existingSubProductIndex = cartProduct.productoInfo.findIndex(p => p.idProducto === idProducto);
      if (existingSubProductIndex !== -1) {
        cartProduct.productoInfo[existingSubProductIndex].cantidad += num;
      }
    }
    localStorage.setItem('cartProducts', JSON.stringify(this.productos));
  }

  obtenerTotal(cantidad, precio){
    return cantidad * Number(precio);
  }

  precioTotal(id) {
    let precio = 0;

    if (typeof this.productos !== 'undefined' && this.productos !== null) {
      // Buscar el elemento con el ID especificado
      const producto = this.productos[id];

      if (producto && Array.isArray(producto.productoInfo)) {
        producto.productoInfo.forEach((dato) => {
          if (dato.precio !== undefined && dato.cantidad !== undefined) {
            precio += parseInt(dato.precio) * parseInt(dato.cantidad);
          }
        });
      }
    }

    return precio;
  }


  async completarCompra(idNegocio){
    const negocio = this.productos[idNegocio];
    this.negocioService.setSelectedObj(negocio.infoNegocio);
    const modal = await this.modalController.create({
      component: PedidoNegocioComponent,
      componentProps: {
        idNegocio: this.productos[idNegocio].infoNegocio.id_negocio,
        lista: this.productos[idNegocio],
        _entregaDomicilio: this.productos[idNegocio].infoNegocio.entrega_domicilio,
        _entregaSitio: this.productos[idNegocio].infoNegocio.entrega_sitio,
        _consumoSitio: this.productos[idNegocio].infoNegocio.consumo_sitio,
        _costoEntrega: this.productos[idNegocio].infoNegocio.costo_entrega,
        negocioNombre: this.productos[idNegocio].infoNegocio.nombre_comercial,
        latNegocio: this.productos[idNegocio].infoNegocio.latitud,
        logNegocio: this.productos[idNegocio].infoNegocio.longitud,
        convenio: this.productos[idNegocio].infoNegocio.convenio_entrega
      },
    });
    await modal.present();
  }

}

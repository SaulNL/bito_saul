import { Component, OnInit, Input } from '@angular/core';
import { IonItem, ModalController } from '@ionic/angular';
import { ModalEditarProductoComponent } from '../../componentes/modal-editar-producto/modal-editar-producto.component';
import { DtosMogoModel } from '../../Modelos/DtosMogoModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrls: ['./modal-productos.component.scss'],
})
export class ModalProductosComponent implements OnInit {

  @Input() public lista: any;
  @Input() public datosNegocio: any;
  @Input() public listaVista: any;
  @Input() public negicio: any;
  private categoriaSeleccionada: any;
  public productoSelect: any;
  public blnformMobile: boolean;
  private isEdicion: boolean;
  public almacenarRegistro: any;

  constructor(
    public modalController: ModalController,
    private router: Router
  ) { 
    this.blnformMobile = false;
  }

  ngOnInit() {
    
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  editarRegistro(produc: any) {
    this.almacenarRegistro = JSON.parse(JSON.stringify(produc));
    produc.editar = true;
    this.modalProductos(produc);
  }

  async modalProductos(item) {
    const modal = await this.modalController.create({
      component: ModalEditarProductoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        lista: item,
        datosNegocio: this.datosNegocio,
        listaVista: this.listaVista,
        negicio: this.negicio,
        opcion: 2
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    }
  }



  agregarMovile() {
    this.categoriaSeleccionada = this.listaVista;
    this.productoSelect = new DtosMogoModel();
    this.blnformMobile = true;
    this.isEdicion = false;
    this.modalAgregarProductos();
  }

  async modalAgregarProductos() {
    const modal = await this.modalController.create({
      component: ModalEditarProductoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        lista: this.productoSelect,
        datosNegocio: this.datosNegocio,
        listaVista: this.lista,
        negicio: this.negicio,
        opcion: 1
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    }
  }

}

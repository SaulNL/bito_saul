import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../../api/pedidos.service';
import {UtilsCls} from '../../../utils/UtilsCls';
import { ModalController } from '@ionic/angular';
import {DatosPedidoNegocioPage} from './datos-pedido-negocio/datos-pedido-negocio.page';

@Component({
  selector: 'app-pedidos-negocio',
  templateUrl: './pedidos-negocio.page.html',
  styleUrls: ['./pedidos-negocio.page.scss'],
})
export class PedidosNegocioPage implements OnInit {
  listaNegocioPedididos: any;
  public listaEstatus: any;
  public lstFiltroEstatus: any;
  public btnDatosPedido:boolean;

  constructor(
    private pedidosServicios: PedidosService,
    private utilsCls: UtilsCls,
    public modalController: ModalController
  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3];
    this.btnDatosPedido=false;
   }

  ngOnInit() {
    this.buscar();
    this.buscarEstatus();
  }
  
  buscar() {
    const id = this.utilsCls.getIdProveedor();
    //this.loader = true;
    this.pedidosServicios.pedidosNegocios(null, id, this.lstFiltroEstatus).subscribe(
      res => {
        //this.loader = false;
        this.listaNegocioPedididos = res.data;        
      },
      error => {
        //this.loader = false;
      }
    );
  }

  buscarEstatus() {
    const id = this.utilsCls.getIdProveedor();
    this.pedidosServicios.estatusPedidios(id).subscribe(
      res => {
        this.listaEstatus = res.data;
        this.listaEstatus.map(it => {
          it.seleccionado = false;
          if (it.id_estatus > 0 && it.id_estatus < 4) {
            it.seleccionado = true;
          }
        });
      },
      error => {
        //this.loader = false;
        console.log(error);
        
      }
    );
  }

  buscarPorestatus(estatus: any) {
    estatus.seleccionado = !estatus.seleccionado;
    this.lstFiltroEstatus = [];
    this.listaEstatus.map(it => {
        if (it.seleccionado) {
          this.lstFiltroEstatus.push(it.id_estatus);
        }
      }
    );
    this.buscar();
  }

  async presentModal(pedido:any) {
    const modal = await this.modalController.create({
      component: DatosPedidoNegocioPage,
      cssClass: 'my-custom-class',
      componentProps: {
        pedido:pedido
      }
    });
    return await modal.present();
  }
  
}

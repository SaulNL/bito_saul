import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PedidosService } from '../../../api/pedidos.service';
import {UtilsCls} from '../../../utils/UtilsCls';
import { ModalController } from '@ionic/angular';
import {DatosPedidoNegocioPage} from './datos-pedido-negocio/datos-pedido-negocio.page';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos-negocio',
  templateUrl: './pedidos-negocio.page.html',
  styleUrls: ['./pedidos-negocio.page.scss'],
})
export class PedidosNegocioPage implements OnInit {
  
  listaNegocioPedididos: any;
  public listaEstatus: any;
  public lstFiltroEstatus: any;
  public selectTO: any;

  constructor(
    private pedidosServicios: PedidosService,
    private utilsCls: UtilsCls,
    public modalController: ModalController,
    private router: Router,
    private active: ActivatedRoute,
    public loadingController: LoadingController
  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3, 4, 5, 6];
   }

  ngOnInit() {
    this.buscar();
    this.buscarEstatus();
    this.presentLoading();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.buscar();
          this.buscarEstatus();
          this.presentLoading();         
        }
      }
    });
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
          if (it.id_estatus > 0 && it.id_estatus < 7) {
            it.seleccionado = true;
          }
        });
      },
      error => {
        //this.loader = false;
        
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
    this.presentLoading();
  }

  datosPedido(pedido: any) {
    this.selectTO =  JSON.parse(JSON.stringify(pedido));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.visto(pedido.id_pedido_negocio);
    this.router.navigate(['/tabs/home/ventas/datos-pedido-negocio'], { queryParams: {special: navigationExtras}  });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      duration: 500
    });
    await loading.present();
  }

  regresar(){
    this.router.navigate(['/tabs/inicio'],{ queryParams: {special: true}});
  }

  visto(pedido) {
    this.pedidosServicios.ponerVisto(pedido).subscribe(
      respuesta => {
      },
      error => {
      });
  }
  
}

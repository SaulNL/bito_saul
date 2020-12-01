import { Component, OnInit } from '@angular/core';
import {UtilsCls} from '../../../utils/UtilsCls';
import { PedidosService } from '../../../api/pedidos.service';
import {icon, latLng, Map, marker, tileLayer} from 'leaflet';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-pedidos-dialog',
  templateUrl: './pedidos-dialog.page.html',
  styleUrls: ['./pedidos-dialog.page.scss'],
})
export class PedidosDialogPage implements OnInit {
  listaNegocioPedididos: any;
  public listaEstatus: any;
  public lstFiltroEstatus: any;
  public loaderBtn: boolean;
  motivo: any;
  blnCancelar: boolean;
  private latitud: number;
  private longitud: number;
  pedidoAbierto: any;
  public selectTO: any;
  public subscribe;

  constructor(
    private pedidosServicios: PedidosService,
    private utilsCls: UtilsCls,
    private router: Router,
    private active: ActivatedRoute,
    private platform: Platform
  ) {
    this.listaNegocioPedididos = [];
    this.lstFiltroEstatus = [1, 2, 3, 4, 5, 6];
    this.loaderBtn = false;
    this.blnCancelar = false;
   }

  ngOnInit() {
    this.buscar();
    this.buscarEstatus();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.buscar();
          this.buscarEstatus();          
        }
      }
      this.subscribe=this.platform.backButton.subscribe(()=>{
          this.regresar();
      });
    });
  }

  buscar() {
    const id = this.utilsCls.getIdPersona();
    //this.loader = true;
    this.pedidosServicios.pedidosNegocios(id, null, this.lstFiltroEstatus).subscribe(
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
  }

  datosPedido(pedido: any) {
    this.selectTO =  JSON.parse(JSON.stringify(pedido));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(['/tabs/home/compras/datos-pedido-dialog'], { queryParams: {special: navigationExtras}  });
  }

  regresar(){
    this.subscribe.unsubscribe();
    this.router.navigate(['/tabs/inicio'],{ queryParams: {special: true}  });
  }

}

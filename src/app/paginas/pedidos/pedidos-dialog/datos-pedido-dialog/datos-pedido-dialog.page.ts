import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PedidosService } from '../../../../api/pedidos.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';

@Component({
  selector: 'app-datos-pedido-dialog',
  templateUrl: './datos-pedido-dialog.page.html',
  styleUrls: ['./datos-pedido-dialog.page.scss'],
})
export class DatosPedidoDialogPage implements OnInit {
  public pedido:any;
  blnCancelar: boolean;
  motivo: any;


  constructor(
    private pedidosServicios: PedidosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificaciones: ToadNotificacionService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.pedido = JSON.parse(params.special);
      }      
    });    
  }
  cancelar() {
    this.blnCancelar = true;
  }
  btnRegresar(){
    this.blnCancelar = false;
  }
  regresar(){
    this.router.navigate(['/tabs/home/compras'], { queryParams: {special: true}  });
  }
  cancelarPedido(pedido: any) {
    //this.loaderBtn = true;
    this.pedidosServicios.cancelarUsuario(pedido.id_pedido_negocio, this.motivo).subscribe(
      respuesta => {
        //this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
        pedido.motivo = respuesta.data.motivo;
        this.blnCancelar = false;
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        //this.loaderBtn = false;
        this.notificaciones.error(error.message); 
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Información',
      message: 'para cancelar este pedido, es necesario escribir el motivo de la cancelación',
      buttons: ['Cerrar']
    });
    await alert.present();
 }
  validarMotivoCancelacion(pedido: any){
    if (this.motivo) {
      this.cancelarPedido(pedido);
  }else{
    this.presentAlert();
  }
}
}

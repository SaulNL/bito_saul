
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EventoService } from '../../api/evento/evento.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { Platform, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.page.html',
  styleUrls: ['./mis-eventos.page.scss'],
})
export class MisEventosPage implements OnInit {
  public eventos: any[];
  loader: boolean;
  public msj = 'Cargando';
  public reservacion: any;
  public eventoImg: string;
  public mostrarInfo: boolean = false;
  public solicitante:string;
  public noPersonas: number;
  public fechaDeReservacion: string;
  public estatus: string;
  public fechaConfirmacion: any;
  public evReservacion: boolean = false;
  public caja: string;
  public cantidadFaltante: number;
  public datosReservacion = {
    fc_confirmacion: null,
    id_estatus_reservacion: null,
    id_evento_reservacion: null
  }

  constructor(
    private _router: Router,
    private eventoService: EventoService,
    private notificacionService: ToadNotificacionService,
    private platform: Platform,
    private animationCtrl: AnimationController
  ) { }

  ionViewWillEnter() {
    this.loader = true;
    let id_proveedor = localStorage.getItem("id_proveedor")
    this.obtenerEventos(id_proveedor);
  }

  ngOnInit() {
    this.loader = true;
    let id_proveedor = localStorage.getItem("id_proveedor")
    this.obtenerEventos(id_proveedor);
    // this.obtenerLstReservacion();
  }

  AgregarEvento() {
    this._router.navigate(["/tabs/mis-eventos/modal-eventos"])
  }

  obtenerEventos(id) {
    let body = {
      id_proveedor: id
    }
    this.eventoService.obtenerEvento(body).subscribe(Response => {
      this.eventos = Response.data

      this.loader = false
    }),
      error => {
        this.notificacionService.error(error);
      }
  }

  eliminarEvento(idEvento, index) {
    this.loader = true;
    let body = {
      id_evento: idEvento
    }

    this.eventos.splice(index, 1)

    this.eventoService.eliminarEvento(body).subscribe(Response => {
      if (Response.code == 200) {
        this.loader = false;
        this.notificacionService.exito("Se elimino correctamente")
      }
    }),
      error => {
        this.notificacionService.error(error);
      }

  }

  editarEvento(idEvento) {
    localStorage.setItem("editEvent", idEvento);
    this._router.navigate(["/tabs/mis-eventos/modal-eventos"])
  }

  obtenerLstReservacion(idReservacion, img){
    this.eventoService.obtenerReservaciones(idReservacion).subscribe(Response => {
      this.eventoImg = img;
      if (Response.code == 200) {
        this.evReservacion = false;
        this.reservacion = Response.data
        this.cantidadFaltante = this.contarFaltantes(this.reservacion);
      }
      if (Response.code == 302) {
        this.evReservacion = true;
        this.reservacion = null;
      }

    }),
      error => {
        this.notificacionService.error(error);
      }
  }

  mostrarInformacion(id) {
    this.mostrarInfo = true;
    this.solicitante = `${this.reservacion[id].nombresolicitante} ${this.reservacion[id].paternosolicitante} ${this.reservacion[id].maternosolicitante}`;
    this.noPersonas = this.reservacion[id].cantidad_persona;
    this.fechaDeReservacion = this.reservacion[id].fc_realizacion_reservacion;
    this.estatus = this.reservacion[id].estatus;
    this.fechaConfirmacion = this.reservacion[id].fc_confirmacion
  }

  cerrarInformacion(){
    this.mostrarInfo = false;
  }

  contarFaltantes(json) {
    let contador = 0;

    json.forEach(element => {
      contador = element.fc_confirmacion === null ? contador + 1 : contador;
    });

    return contador;
  }

   async guardarReservacion(data){
    let dias =  new Date();
    let dia = dias.getDate();
    let mes = dias.getMonth() + 1;
    let anio = dias.getFullYear();
    let fecha = `${dia}/${mes}/${anio}`
    this.datosReservacion.fc_confirmacion = await fecha;
    this.datosReservacion.id_estatus_reservacion = await 2 ;
    this.datosReservacion.id_evento_reservacion = await data.id_evento_reservacion;
    this.enviarReservacion(data,true)
  }

  enviarReservacion(id,tipo){
    let mensaje = tipo == true ? "Se guardo excitosamente": "Se elimino excitosamente"
    this.eventoService.confirmarReservacion(this.datosReservacion).subscribe(Response => {
      if(Response.code == 200){
        this.obtenerLstReservacion(id.id_evento,this.eventoImg)
        this.notificacionService.exito(mensaje)
      }
    }),
      error => {
        this.notificacionService.error(error);
      }
  }

  async quitarReservacion(data){
    this.datosReservacion.fc_confirmacion = await null;
    this.datosReservacion.id_estatus_reservacion = await 1 ;
    this.datosReservacion.id_evento_reservacion = await data.id_evento_reservacion;
    this.enviarReservacion(data,false)
  }

  onClickItem(event) {
    const icon = event.currentTarget.querySelector('ion-icon');

    // Creamos la animación y la configuramos para mover el ícono
    const moveLeftAnimation = this.animationCtrl.create()
      .addElement(icon)
      .duration(500)
      .fromTo('transform', 'translateX(0)', 'translateX(-10px)');

    // Ejecutamos la animación
    moveLeftAnimation.play();

    // Revertimos la animación después de 500ms
    setTimeout(() => {
      const moveBackAnimation = this.animationCtrl.create()
        .addElement(icon)
        .duration(500)
        .fromTo('transform', 'translateX(-10px)', 'translateX(0)');

      moveBackAnimation.play();
    }, 500);
  }

}

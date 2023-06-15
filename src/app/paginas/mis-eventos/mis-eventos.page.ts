
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EventoService } from '../../api/evento/evento.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.page.html',
  styleUrls: ['./mis-eventos.page.scss'],
})
export class MisEventosPage implements OnInit {
  public eventos: any[];
  loader: boolean;
  public msj = 'Cargando';

  constructor(
    private _router: Router,
    private eventoService: EventoService,
    private notificacionService: ToadNotificacionService,
  ) { }

  ionViewWillEnter() {
    this.loader = true;
    let id_proveedor = localStorage.getItem("id_proveedor")
    this.obtenerEventos(id_proveedor);
    console.log("estas entrando en la vista", this.loader, id_proveedor)
  }

  ngOnInit() {
    this.loader = true;
    let id_proveedor = localStorage.getItem("id_proveedor")
    this.obtenerEventos(id_proveedor);
  }

  AgregarEvento() {
    this._router.navigate(["/tabs/mis-eventos/modal-eventos"])
  }

  obtenerEventos(id) {
    let body = {
      id_proveedor: id
    }
    this.eventoService.obtenerEvento(body).subscribe(Response => {
      console.log(Response)
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

}

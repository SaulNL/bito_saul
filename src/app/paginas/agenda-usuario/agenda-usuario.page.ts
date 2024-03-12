import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UtilsCls} from "../../utils/UtilsCls";
import {AgendaContenidosService} from "../../api/agenda-contenidos.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";

@Component({
  selector: 'app-agenda-usuario',
  templateUrl: './agenda-usuario.page.html',
  styleUrls: ['./agenda-usuario.page.scss'],
})
export class AgendaUsuarioPage implements OnInit {
  private user: any;
  public lstAgendaUsuario: any;
  public mostrarCalendario: boolean;
  constructor(
      private router: Router,
      private util: UtilsCls,
      private agendaContenidosService: AgendaContenidosService,
      private notificacionService: ToadNotificacionService,

  ) {
    this.user = this.util.getUserData();
    this.lstAgendaUsuario = [];

  }

  ngOnInit() {
    this.mostrarCalendario = false;
    this.obteneragendaUsuario(this.user.id_persona);
  }
  regresar() {
    this.router.navigate(['/tabs/home']);
  }
  async obteneragendaUsuario(idPersona) {
    try {
      const response = await this.agendaContenidosService.obtenerAgendaServicioUsuario(idPersona).toPromise();
      this.lstAgendaUsuario = response.data;
      this.mostrarCalendario = true;
    } catch (error) {
      console.log(error);
    }
  }
  async cancelarCita(datos: any) {
    console.log('esto recibe del emit', datos);
    try {
      const response = await this.agendaContenidosService.cambiarEstatusServicio(datos.id_negocio_agenda, datos.id_estatus_agenda).toPromise();
      console.log('esto me responde el cambiar estatus', response);
      if (response.code === 200){
        this.obteneragendaUsuario(this.user.id_persona);
        this.notificacionService.exito('Cita cancelada correctamente');

      }
    } catch (error) {
      console.log(error);
    }
  }



}

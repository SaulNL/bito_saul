import { Component, Input, OnInit} from '@angular/core';
import { NotificacionesService } from '../../api/usuario/notificaciones.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notificacion-chat',
  templateUrl: './notificacion-chat.component.html',
  styleUrls: ['./notificacion-chat.component.scss']
})
export class NotificacionChatComponent implements OnInit {

  @Input() notificacion: any;


  mensajes: any[];
  /* idNegocio = '210000198410281948';
  userId =    '140000198202211138'; */
  /* idNegocio = '3';
  idPersona = '7';
  logoNegocio: string; */

  constructor(private service: NotificacionesService, private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {
    
    this.obtenerMensajes();
  }

  obtenerMensajes() {
    let {id_persona_recibe, id_negocio_envia} = this.notificacion;
    this.service.obtenerMensajesNotificacion(id_persona_recibe, id_negocio_envia).subscribe(res => {
  
      
      res.data.map(msj => {
        
        msj.fecha = new Date(msj.fecha).toLocaleString();
      })
      this.mensajes = res.data;
    })
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  infoNegocio() {
    this.cerrarModal();
    this.router.navigate(["/tabs/negocio/" + this.notificacion.url_negocio]);
  }

  
}

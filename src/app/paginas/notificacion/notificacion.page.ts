import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../api/usuario/notificaciones.service';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular';
import { NotificacionChatComponent } from '../../components/notificacion-chat/notificacion-chat.component';
import { NotificacionesModel } from 'src/app/Modelos/NotificacionesModel';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {
  notificaciones: Array<NotificacionesModel>;

  constructor(
      private notificacionService: NotificacionesService, private router: Router, 
      private modalCtrl: ModalController,
  ) { 
   }

  ngOnInit() {
    this.notificaciones = JSON.parse(localStorage.getItem('notificaciones'));
    console.log(JSON.stringify(this.notificaciones));
  }

  async abrirChat(notificacion) {
    
    const modal = await this.modalCtrl.create({
      component: NotificacionChatComponent,
      componentProps: {
        notificacion: notificacion
      }
    });
    modal.present();
  }

  cerrar() {
    this.router.navigate(["/tabs/home/perfil"]);
  }


}

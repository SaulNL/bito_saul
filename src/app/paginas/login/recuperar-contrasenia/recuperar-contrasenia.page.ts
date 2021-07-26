import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../../api/login.service';
import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.page.html',
  styleUrls: ['./recuperar-contrasenia.page.scss'],
})
export class RecuperarContraseniaPage implements OnInit {
  public correo: string;
  public loader: any;
  constructor(
    public notificaciones: ToadNotificacionService,
    public _Login: LoginService,
    public _router: Router,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    this.correo = '';
  }

  ngOnInit() {
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor espera...'
    });
    return this.loader.present();
  }
  cerrarModal() {
    this.modalController.dismiss();
  }
  public resetPass(form: NgForm) {
    if (form.valid) {
      this.presentLoading();
      this._Login.resetPassword(this.correo).subscribe(response => {
        this.loader.dismiss();
        if (response.code === 200) {
          this.notificaciones.exito(response.message);
          this.cerrarModal();
        } else {
          this.notificaciones.alerta(response.message);
        }
      },
        error => {
          this.loader.dismiss();
          this.notificaciones.error(error);
        });
    } else {
      this.loader.dismiss();
      this.notificaciones.alerta('Es requerido que llenes todos los campos obligatorios');
    }
  }
}

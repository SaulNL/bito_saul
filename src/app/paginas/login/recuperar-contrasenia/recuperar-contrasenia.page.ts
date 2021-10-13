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
  public recupe : any;
  constructor(
    public notificaciones: ToadNotificacionService,
    public _Login: LoginService,
    public _router: Router,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    this.correo = '';
    this.loader = false;
    this.recupe = 'Recuperando';
  }

  ngOnInit() {
  }
  cerrarModal() {
    this.modalController.dismiss();
  }
  public resetPass(form: NgForm) {
    this.loader = true;
    if (form.valid) {
      this._Login.resetPassword(this.correo).subscribe(response => {
        this.loader = false;
        if (response.code === 200) {
          this.notificaciones.exito(response.message);
          this.cerrarModal();
        } else {
          this.notificaciones.alerta(response.message);
        }
      },
        error => {
          this.loader = false;
          this.notificaciones.error(error);
        });
    } else {
      this.loader = false;
      this.notificaciones.alerta('Es requerido que llenes todos los campos obligatorios');
    }
  }
}

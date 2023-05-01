import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { LoginService } from './../../../api/login.service';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  public loader: boolean;
  public user: string;
  constructor(
    private modalCtr: ModalController,
    public loginService: LoginService,
    private toadNotificacionService: ToadNotificacionService
  ) {
    this.loader = false;
    this.user = null;
  }

  ngOnInit() { }

  public responseCloseHeader() {
    this.modalCtr.dismiss();
  }

  public recoverPassword(form: NgForm) {
    this.loader = true;
    this.loginService.resetPassword(form.value.user).subscribe(response => {
      if (response.code === 200) {
        this.toadNotificacionService.exito(response.message);
        this.responseCloseHeader();
        this.loader = false;
      } else {
        this.toadNotificacionService.alerta(response.message);
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
      this.toadNotificacionService.error(error);
    });
  }
}

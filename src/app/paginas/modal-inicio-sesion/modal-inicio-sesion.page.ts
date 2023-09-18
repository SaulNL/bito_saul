import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-inicio-sesion',
  templateUrl: './modal-inicio-sesion.page.html',
  styleUrls: ['./modal-inicio-sesion.page.scss'],
})
export class ModalInicioSesionPage implements OnInit {
  @Input() isAlert: boolean;
  @Output() banderaAlert: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
      private router: Router,
  ) {}

  ngOnInit() {
  }

  cerrarAlert(){
    this.isAlert = false;
    this.banderaAlert.emit(this.isAlert);
  }

  async mensajeRegistro() {
    this.isAlert = true;
  }

  iniciarSesion(){
    this.router.navigate(['/tabs/login']);
    this.cerrarAlert();
  }

  crearCuenta(){
    this.router.navigate(["/tabs/login/sign-up"]);
    this.cerrarAlert();
  }
}

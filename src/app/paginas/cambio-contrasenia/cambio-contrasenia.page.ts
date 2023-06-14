import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { Router } from "@angular/router";




@Component({
  selector: 'app-cambio-contrasenia',
  templateUrl: './cambio-contrasenia.page.html',
  styleUrls: ['./cambio-contrasenia.page.scss'],
})
export class CambioContraseniaPage implements OnInit {
  contrasenia: string;
  contraseniaRepit: string;
  contraseniaAct: any;
  private user: any;
  blnIguales: boolean;
  blnIgualesPassOriginalNuevo: boolean;
  public formGroup1: FormGroup;
  public loader: any;
  public msj = 'Cambiando Contraseña';


  constructor(
    private _formBuilder: FormBuilder,
    private servicioPersona: PersonaService,
    public loadingController: LoadingController,
    private notificaciones: ToadNotificacionService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('u_sistema'));;
    this.blnIguales = false;
    this.loader = false;
  }


  ngOnInit() {
    this.iniciarForm();
  }
  iniciarForm() {
    this.formGroup1 = this._formBuilder.group({
      contraseniaActual: ['', Validators.required],
      contraseniaN: ['', Validators.required],
      contraseniaR: ['', Validators.required],
    });
  }
  contraseniasIguales() {
    if (this.contraseniaRepit !== undefined) {
      this.blnIguales = (this.contrasenia !== this.contraseniaRepit);
    }

    this.blnIgualesPassOriginalNuevo = (this.contraseniaAct !== undefined && this.contraseniaAct !== null
      && this.contrasenia !== undefined && this.contrasenia !== null
      && this.contraseniaAct === this.contrasenia);
  }
  cambiarContrasenia() {
    if (this.formGroup1.valid) {
      this.loader = true;
      const contra = { contaseniaAtual: this.contraseniaAct, newContrasenia: this.contrasenia };
      this.servicioPersona.cambiarContrasenia(this.user.id_usuario_sistema, contra).subscribe(
        respuesta => {
          if (respuesta.code === 200) {
            this.loader = false;
            this.notificaciones.exito('se guardo con éxito');
            this.iniciarForm();
            this.router.navigate(['/tabs/home']);
          }
          if (respuesta.code === 402) {
            this.loader = false;
            this.notificaciones.alerta(respuesta.message);
          }
          this.loader = false;
        }
      );
    }
  }

}

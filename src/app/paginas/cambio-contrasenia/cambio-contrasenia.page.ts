import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { PersonaService } from '../../api/persona.service';




@Component({
  selector: 'app-cambio-contrasenia',
  templateUrl: './cambio-contrasenia.page.html',
  styleUrls: ['./cambio-contrasenia.page.scss'],
})
export class CambioContraseniaPage implements OnInit {
  contrasenia: string;
  contraseniaRepit: string;
  contraseniaAct: any;
  loader: boolean;
  private user: any;
  blnIguales: boolean;
  blnIgualesPassOriginalNuevo: boolean;
  public formGroup1: FormGroup;


  constructor(
    private _formBuilder: FormBuilder,
    private servicioPersona: PersonaService
  ) { 
    this.user = JSON.parse(localStorage.getItem('u_sistema'));;
    this.loader =  false;
    this.blnIguales =  false;
  }
  

  ngOnInit() {
  this. iniciarForm();
  }
  iniciarForm(){
    this.formGroup1 = this._formBuilder.group({
      contraseniaActual: ['', Validators.required],
      contraseniaN: ['', Validators.required],
      contraseniaR: ['', Validators.required],
    });
  }

  contraseniasIguales(){
    if (this.contraseniaRepit !== undefined) {
      this.blnIguales = (this.contrasenia !== this.contraseniaRepit);
    }

    this.blnIgualesPassOriginalNuevo = (this.contraseniaAct !== undefined && this.contraseniaAct !== null
    && this.contrasenia !== undefined && this.contrasenia !== null
    && this.contraseniaAct === this.contrasenia);
  }
  cambiarContrasenia() {
    if (this.formGroup1.valid){
      this.loader = true;
      const contra = {contaseniaAtual: this.contraseniaAct, newContrasenia: this.contrasenia};
      this.servicioPersona.cambiarContrasenia(this.user.id_usuario_sistema, contra).subscribe(
        respuesta =>{
          if (respuesta.code === 200){
            //this.notificacionService.pushInfo(respuesta.message);
           // this.iniciarForm();
            //this.router.navigate(['/home/mi/cuenta/inicio']);
          }
          if (respuesta.code === 402){
           // this.notificacionService.pushAlert(respuesta.message);
          }
          this.loader = false;
        }
      );
    }
  }
 
}

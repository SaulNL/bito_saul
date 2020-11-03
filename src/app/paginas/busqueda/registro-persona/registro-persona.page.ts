import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioSistemaModel } from 'src/app/Modelos/UsuarioSistemaModel';

@Component({
  selector: 'app-registro-persona',
  templateUrl: './registro-persona.page.html',
  styleUrls: ['./registro-persona.page.scss'],
})
export class RegistroPersonaPage implements OnInit {
  public usuario_sistema: UsuarioSistemaModel;
  public blnContraseniaIgual: boolean;
  public condiciones_servicio: boolean = false;
  constructor(
    private router: Router,
    private active: ActivatedRoute) { 
   //   this.condiciones_servicio = false;
    }

  ngOnInit() {
    this.usuario_sistema = new UsuarioSistemaModel();
    this.blnContraseniaIgual = true;

  }
  public abrirTerminosCondiciones() {
    window.open("https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf", "_blank");
  }
  confirmacionRegistro(formRegistroPersona: NgForm) {
    let navigationExtras = JSON.stringify(this.usuario_sistema );
    this.router.navigate(['/tabs/registro-persona/confirma-registro'], { queryParams: { special: navigationExtras } });
  }
  regresarLogin(formRegistroPersona: NgForm){
    formRegistroPersona.resetForm();
    this.router.navigate(['/tabs/login']);
  }
  public verificarContrasena() {
    this.blnContraseniaIgual = true;

    if (this.usuario_sistema.password !== '' &&
      this.usuario_sistema.repeat_password !== '' &&
      this.usuario_sistema.password !== this.usuario_sistema.repeat_password) {
      this.blnContraseniaIgual = false;
    }

  }
  public aceptar_condiciones_servicio(event) {
    this.condiciones_servicio = false;
  if (event.detail.checked) {
      this.condiciones_servicio = true;
    }
  }

}

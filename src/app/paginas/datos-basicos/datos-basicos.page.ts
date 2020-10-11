import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { MsPersonaModel } from './../../Modelos/MsPersonaModel';
import { PersonaService } from '../../api/persona.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.page.html',
  styleUrls: ['./datos-basicos.page.scss'],
})
export class DatosBasicosPage implements OnInit {
  public usuarioSistema: MsPersonaModel;
  public loader: any;

  constructor(
    private servicioPersona: PersonaService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.usuarioSistema = new MsPersonaModel();
    this.actualizarUsuario();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
   return this.loader.present();
  }
  private actualizarUsuario() {
    this.usuarioSistema = JSON.parse(localStorage.getItem('u_data'));
    this.usuarioSistema.fecha_nacimiento = this.usuarioSistema.fecha_nacimiento !== null ? new Date(this.usuarioSistema.fecha_nacimiento) : null;
  }
  actualizarDatos(formBasicos: NgForm) {
    this.presentLoading();
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.guardar(this.usuarioSistema).subscribe(
        data => {
          if(data.code === 200){
            this.loader.dismiss();
            //this.notificacionService.pushAlert(data.message); 
          }
          //const resultado = this.sesionUtl.actualizarSesion();
          //this.router.navigate(['/home/mi/cuenta/inicio']);
          this.loader.dismiss();
          //this.notificacionService.pushInfo(data.data.mensaje);
         // resolve(resultado);

        },
        error => {
          this.loader.dismiss();
          //  this.notificacionService.pushError(error);
          // this.lstPrincipal = new Array();

        });
    });
    miPrimeraPromise.then((successMessage) => {
    });
  }
}

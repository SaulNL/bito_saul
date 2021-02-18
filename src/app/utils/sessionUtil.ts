import {PersonaService} from '../api/persona.service';
import {AppSettings} from '../AppSettings';
import {UtilsCls} from './UtilsCls';
import {NgModule} from '@angular/core';
import {SideBarService} from "../api/busqueda/side-bar-service";
//import {SideBarService} from '../services/side-bar-service';

@NgModule({
  providers: [ UtilsCls, SideBarService ]
})

export class SessionUtil {
  constructor(
    private servicioPersona: PersonaService,
   private sideBarService: SideBarService,
    private util: UtilsCls
  ) {
  }

  public actualizarSesion(){
    const id = this.util.getIdPersona();
    let result = false;
    const miPrimeraPromise = new Promise((resolve, reject) => {
      this.servicioPersona.datosUsuario(id).subscribe(
        respuesta => {
          resolve(respuesta);

        },
        error => {
          reject(error);
        }
      );
    });

    miPrimeraPromise.then((data) => {
      // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.
      // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.

      if( AppSettings.actualizarDatos(data)){
        console.log("Actualizar datos");
        this.sideBarService.actualizarSide();
       result = true;
      }else{
        result = false;
      }
    });

    return result;
  }
}

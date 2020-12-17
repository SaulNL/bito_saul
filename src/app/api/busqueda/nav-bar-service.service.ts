import { EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavBarServiceService {
  public nav_bar_bloqueo: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() cambio: EventEmitter<any> = new EventEmitter();
  @Output() strBuscar: EventEmitter<any> = new EventEmitter();
  @Output() logeo: EventEmitter<any> = new EventEmitter();

  constructor() { 
    this.nav_bar_bloqueo = true;
  }
  public updateNavBar(bandera: boolean) {
    this.nav_bar_bloqueo = bandera;
  }

  /**
   * Funcion para escuchar el usuario login
   * @param user
   * @author Omar
   */
  public modificarNavBar(user){
    this.change.emit(user);
  }

  /**
   * Funcion para escuchar el clic de una promocion del banner
   * @param promocion
   * @author Omar
   */
  public promocionSeleccionada(promocion){
    this.cambio.emit(promocion);
    setTimeout(() => {   
      this.cambio = new EventEmitter();
     }, 100);
  }

  /**
   * Funcion para escuchar al buscar principal
   * @param strBuscar
   * @author Omar
   */
  public BusquedaPrincipal(strBuscar){
    this.strBuscar.emit(strBuscar);
  }

  /**
   * Funcion para escuchar cuando se logeo
   * @param user
   * @author Omar
   */
  public Notificacionlogeo(user){
    this.logeo.emit(user);
  }
}

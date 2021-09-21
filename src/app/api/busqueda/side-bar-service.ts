import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private fooSubject = new Subject<any>();
  private buscarNegocios = new Subject<any>();
  actualizar = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter();


  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }




  buscar(data: any) {
    this.buscarNegocios.next(data)

  }

  eventBuscar(): Subject<any> {

    return this.buscarNegocios;
  }
  actualizarSide() {
    this.actualizar = true;
    this.change.emit(this.actualizar);
  }
}

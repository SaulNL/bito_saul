import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private fooSubject = new Subject<any>();
  private buscarNegocios = new Subject<any>();



  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  buscar(data: any){
      this.buscarNegocios.next(data)
      console.log('servicio')
  }

  eventBuscar(): Subject<any>{
    console.log('obteniendo')
    return this.buscarNegocios;
  }
}

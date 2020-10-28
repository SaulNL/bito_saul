import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettings} from '../AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private http: HttpClient
  ) { }

  url = `${AppSettings.API_ENDPOINT}`;

  pedidosNegocios(idPersona: number, idProveedor: number, listAst: any): Observable<any> {
    const body = JSON.stringify({id_proveedor: idProveedor, id_persona: idPersona, estatus: listAst});
    return this.http.post(
      this.url + 'api/pedios/proveedor/obtener', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  estatusPedidios(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    return this.http.post(
      this.url + 'api/pedidos/estatus/obtener', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  preparar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return this.http.post(
      this.url + 'api/pedidos/estatus/preparar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  enviar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return this.http.post(
      this.url + 'api/pedidos/estatus/enviar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  entregar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return this.http.post(
      this.url + 'api/pedidos/estatus/entregar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  cancelar(id_pedido_negocio: any, motivo: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio, motivo});
    return this.http.post(
      this.url + 'api/pedidos/estatus/cancelar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  cancelarUsuario(id_pedido_negocio: any, motivo: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio, motivo});
    return this.http.post(
      this.url + 'api/pedidos/estatus/cancelarUsuario', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  numero(): Observable<any> {
    const body = JSON.stringify({variable: 'repartidor'});
    return this.http.post(
      this.url + 'api/variables/byVariable', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  noVistos(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    return this.http.post(
      this.url + 'api/pedidos/novistos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  ponerVisto(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return this.http.post(
      this.url + 'api/pedidos/visto', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

}

import { Injectable } from '@angular/core';
import {AppSettings} from '../AppSettings';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { IPedidosNegocios } from '../interfaces/pedidos/IPedidosNegocio';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private _http: HTTP,
    private http: HttpClient
  ) { }

  url = `${AppSettings.API_ENDPOINT}`;

  pedidosNegocios(idPersona: number, idProveedor: number, listAst: any): Observable<any> {
    const body = JSON.stringify({id_proveedor: idProveedor, id_persona: idPersona, estatus: listAst});
    this._http.setDataSerializer("utf8");
    return from(this._http.post( this.url + 'api/pedios/proveedor/obtener',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  pedidosNegocios2(iPedidosNegocios: IPedidosNegocios): Observable<any> {
    const body = JSON.stringify(iPedidosNegocios);
    return from(this._http.post( this.url + 'api/pedios/proveedor/obtener',body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  estatusPedidios(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    this._http.setDataSerializer("utf8");
    return from(this._http.post( this.url + 'api/pedidos/estatus/obtener' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  preparar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return from(this._http.post( this.url + 'api/pedidos/estatus/preparar' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  enviar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return from(this._http.post(  this.url + 'api/pedidos/estatus/enviar' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  entregar(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    return from(this._http.post(  this.url + 'api/pedidos/estatus/entregar' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  cancelar(id_pedido_negocio: any, motivo: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio, motivo});
    return from(this._http.post( this.url + 'api/pedidos/estatus/cancelar' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  cancelarUsuario(id_pedido_negocio: any, motivo: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio, motivo});
    return from(this._http.post( this.url + 'api/pedidos/estatus/cancelarUsuario' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
  numero(): Observable<any> {
    const body = JSON.stringify({variable: 'repartidor'});
    return from(this._http.post(  this.url + 'api/variables/byVariable' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }

  noVistos(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url + 'api/pedidos/novistos', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  ponerVisto(id_pedido_negocio: any): Observable<any> {
    const body = JSON.stringify({idPedidoNegocio: id_pedido_negocio});
    this._http.setDataSerializer("utf8");
    return from(this._http.post( this.url + 'api/pedidos/visto' ,body,
    AppSettings.getHeadersToken())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    })).pipe(map(data => {
        return data;
    }));
  }
    obetenerDatosPedido(idPedidoNegocio: string) {
        const body = JSON.stringify({idPedidoNegocio});
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        return from(this._http.post(
            this.url + 'api/obtener/informacion/pedido', body,
            AppSettings.getHeadersToken()
        ).then( r => {
            return r.data;
        }));
    }
}

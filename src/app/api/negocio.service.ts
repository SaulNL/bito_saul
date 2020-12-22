import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../AppSettings";
import {Observable,from} from "rxjs";
import {map} from "rxjs/operators";
import {DatosNegocios} from '../Modelos/DatosNegocios';
import {NegocioModel} from "../Modelos/NegocioModel";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(
      private http: HttpClient,
      private _http: HTTP
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;

  obteneretalleNegocio(negocioo: string): Observable<any>{
    const body = JSON.stringify({negocio: negocioo });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
        this.url+'/proveedor/obtener/detalleNegocio',
        body,AppSettings.getHeaders())
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        }));
  }

  public obtenerDetalleDeNegocio(negocio: number, tip ): Observable<any> {
    const body = JSON.stringify({id_negocio: negocio, tipo: tip});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/lista/producto/negocio',
      body,AppSettings.getHeaders())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  misNegocios(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/buscar/mis-negocios',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  buscarProductosServios(id: number, tipo: number): Observable<any> {
    const body = JSON.stringify({id_negocio: id, tipo : tipo});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/lista/producto/negocio',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  guardarProductoServio(datosNegocio: DatosNegocios): Observable<any> {
    const body = JSON.stringify(datosNegocio);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/guardarProductosServicios',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerNumMaxProductos(idNegocio): Observable<any> {
    const body = JSON.stringify({id: idNegocio});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/numero/max/productos',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  modificarCategoria(enviar:any): Observable<any> {
    const body = JSON.stringify(enviar);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/modificar/categoria',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  eliminarCategoria(enviar:any): Observable<any> {
    const body = JSON.stringify(enviar);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/eliminar/categoria',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  agregarCategoria(enviar:any): Observable<any> {
    const body = JSON.stringify(enviar);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/guardar/categoria',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public obtnerTipoNegocio(): Observable<any> {
    const body = JSON.stringify({});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/servicio/lista/negocios',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  buscarNegocio(idNegocio: any): Observable<any>{
    const body = JSON.stringify({id: idNegocio});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/buscar/negocio',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  categoriaPrincipal(id: number): Observable<any> {
    const body = JSON.stringify({id_tipo_negocio: id});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/servicio/tipoProductoServicio',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerCategorias(id: any): Observable<any> {
    const body = JSON.stringify({id_giro: id});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'buscar/giro/categorias',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
    /**
   * Funcion para obtener el catalogo de organizaciones
   * @param id
   * @author Omar
   */
  obtenerCatOrganizaciones(): Observable<any> {
    const body = JSON.stringify({});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/catalogo/organizaciones/obtener',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
   /**
   * Servicio para validar disponivilidad de url del negocio
   * @param url_negocio
   * @author Omar
   */
  verificarUrlNegocio(url_negocio: string): Observable<any> {
    const body = JSON.stringify({url_negocio: url_negocio});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/verificar_url',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  guardar(negocio: NegocioModel): Observable<any> {
    const body = JSON.stringify(negocio);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/proveedor/guardar_negocio',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  activarDesactivar(id_negocio: number, cambio: boolean): Observable<any> {
    const body = JSON.stringify({negocio: id_negocio, valor : cambio});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/activar-desactivar',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  registrarPedido(datos): Observable<any> {
    const body = JSON.stringify(datos);
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/pedios/registrar',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  obtenerNumMaxServicios(): Observable<any> {
    const body = JSON.stringify({});
    console.log(body);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url+'api/negocio/numero/max/servicios',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
}

import { Injectable } from '@angular/core';
import { AppSettings } from "../../../AppSettings";
import { Observable, from } from "rxjs";
import { map } from 'rxjs/operators';
import { PromocionesModel } from './../../../Modelos/busqueda/PromocionesModel';
import { UbicacionModel } from './../../../Modelos/busqueda/UbicacionModel';
import { FiltrosModel } from '../../../Modelos/FiltrosModel';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private url: string;
  constructor(
    private _http: HTTP
  ) {
    this.url = AppSettings.API_ENDPOINT;
  }

  buscarAnunciosPublicadosFiltros(idPersona: number): Observable<any> {
    const body = JSON.stringify({ id_persona: idPersona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + "api/anuncios/buscar/publicados", body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  
  buscarPromocinesPublicadasFiltros(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({ filtros: filtros });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + "api/promociones/buscar/publicadas", body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  buscarPromocinesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros});
    this._http.setDataSerializer('utf8');
    const datos = from(this._http.post(this.url + 'api/promociones/buscar/publicadas', body,
    AppSettings.getHeaders())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    }));

    return datos.pipe(map(data => {
        return data;
    })).pipe(map(res => {
      let jsOrigen: any;
      jsOrigen = res;

      const jsCategoria = new Array();
      let categoria = {
        id_categoria_negocio: undefined,
        nombre: undefined,
        id_giro: undefined,
        promociones: []
      };
      let promocion = {
        short: undefined
      };

      if (jsOrigen.data !== undefined && jsOrigen.data !== null) {
        let idCategoriaActual: number;
        const totalDatos = jsOrigen.data.length;
        let iterador = 0;
        jsOrigen.data.forEach(it => {

          if (idCategoriaActual !== Number(it.id_categoria_negocio)) {

            if (iterador > 0) {
              jsCategoria.push(categoria);
            }

            idCategoriaActual = Number(it.id_categoria_negocio);

            categoria = {
              id_categoria_negocio: it.id_categoria_negocio,
              nombre: it.categoria_negocio,
              id_giro: it.id_giro,
              promociones: []
            };

          }

          promocion = it;

          categoria.promociones.push(promocion);

          if (iterador + 1 >= totalDatos) {
            jsCategoria.push(categoria);
          }

          iterador++;
        });
      }

      jsOrigen.data = jsCategoria;

      return jsOrigen;
    }));
  }
  obtenerAvisos(idUsuario: null | number): Observable<any> {
    const body = JSON.stringify({ id_usuario: idUsuario });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + "api/catalogos/obtener/avisos", body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
 * Servicio para guardar quien vio la publicacion
 * @param promocion
 * @author Omar
 */
  guardarQuienVioPromocion(promocion: PromocionesModel, ubicacion: UbicacionModel = null): Observable<any> {
    const body = JSON.stringify({ promocion: promocion, ubicacion: ubicacion });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/promociones/guardar/viste_mi_promocion', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
 * Funcion para obtener numero de quien vio la publicacion
 * @param id_promocion
 * @author Omar
 */
  obtenerNumeroQuienVioPublicacion(id_promocion): Observable<any> {
    const body = JSON.stringify({ id_promocion: id_promocion });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/promociones/obtener/numero_viste_mi_promocion', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
}

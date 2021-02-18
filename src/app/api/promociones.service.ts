import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../AppSettings";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { FiltrosModel } from '../Modelos/FiltrosModel';
import { PromocionesModel } from '../Modelos/busqueda/PromocionesModel';
import { PublicacionesModel } from '../Modelos/PublicacionesModel';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor( 
    private _http: HttpClient,
    private http: HTTP
  ) { }

  obtenerDetalle(id_promocion): Observable<any> {
    const body = JSON.stringify({id_promocion: id_promocion});
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/promocion/obtener/detalle`,body, AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }


  buscarPromocinesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros: filtros});
    this.http.setDataSerializer("utf8");
    let datos = from(this.http.post(this.url + 'api/promociones/buscar/publicadas',body,
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

  buscar(promocion: PromocionesModel): Observable<any> {
    const body = JSON.stringify(promocion);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/persona',body, AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerNumeroPublicacionesPromocion(id_proveedor): Observable<any>{
    const body = JSON.stringify({'id_proveedor':id_proveedor});
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promocion/obtener/numero_publicaciones',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerPromocinesPublicadas(promocion: PromocionesModel): Observable<any> {
    console.log(promocion);
    const body = JSON.stringify(promocion);
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/obtener/publicadas',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  quitarPublicacionPromocion(variable: PromocionesModel) {
    console.log(variable)
    const body = JSON.stringify(variable);
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/eliminar/publicacion',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerQuienVioPublicacion(id_promocion, id_persona): Observable<any>{
    const body = JSON.stringify({'id_promocion': id_promocion, 'id_persona': id_persona});
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/obtener/viste_mi_promocion',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerNumeroQuienVioPublicacion(id_promocion): Observable<any>{
    const body = JSON.stringify({'id_promocion': id_promocion});
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/obtener/numero_viste_mi_promocion',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  guardar(variable: PromocionesModel): Observable<any> {
    console.log(variable);
    const body = JSON.stringify(variable);
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/guardar',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  eliminar(variable: PromocionesModel) {
    console.log(variable);
    const body = JSON.stringify(variable);
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promociones/eliminar',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  guardarPublicacion(publicacion: PublicacionesModel): Observable<any> {
    console.log(publicacion);
    const body = JSON.stringify(publicacion);
    console.log(body);
    this. http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/promocion/publicar',body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
    
  }

}

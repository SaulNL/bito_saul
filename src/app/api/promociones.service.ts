import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../AppSettings';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FiltrosModel } from '../Modelos/FiltrosModel';
import { PromocionesModel } from '../Modelos/busqueda/PromocionesModel';
import { PublicacionesModel } from '../Modelos/PublicacionesModel';
import { HTTP } from '@ionic-native/http/ngx';
import {FiltroCatVariableModel} from "../Modelos/catalogos/FiltroCatVariableModel";
import {RegistrarQuienVioMiPromocionModel} from "../Modelos/RegistrarQuienVioMiPromocionModel";
import { ValidarPromocion } from '../Modelos/ValidarPromocion';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) { }


  obtenerDetalle(idPromocion): Observable<any> {
    const body = JSON.stringify({idPromocion});
    this.http.setDataSerializer('utf8');
    return from(this.http.post(`${this.url}api/promocion/obtener/detalle`, body, AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }


  buscarPromocinesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros});
    this.http.setDataSerializer('utf8');
    const datos = from(this.http.post(this.url + 'api/promociones/buscar/publicadas', body,
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
    this.http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promociones/persona', body, AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerNumeroPublicacionesPromocion(idProveedor): Observable<any>{
    const body = JSON.stringify({id_proveedor: idProveedor});
    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promocion/obtener/numero_publicaciones', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  obtenerPromocinesPublicadas(promocion: PromocionesModel): Observable<any> {

    const body = JSON.stringify(promocion);

    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promociones/obtener/publicadas', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  quitarPublicacionPromocion(variable: PromocionesModel) {
    
    const body = JSON.stringify(variable);
    
    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promociones/eliminar/publicacion', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  // obtenerQuienVioPublicadcion(idPromotion: number): Observable<any>{
  //   const body = JSON.stringify({id_promocion: idPromotion});
  //   this. http.setDataSerializer('utf8');
  //   return from(this.http.post(this.url + 'api/visitas/promocion/obtener', body, AppSettings.getHeaders())
  //   .then((data) => {
  //     return JSON.parse(data.data);
  //   })
  //    .catch((error) => {
  //      return error;
  //    }));
  //  }

  obtenerQuienVioPublicacion(idPromotion: number): Observable<any> {
    const body = JSON.stringify({id_promocion: idPromotion});
    this.http.setDataSerializer("utf8");
    return from(this.http.post( this.url + 'api/visitas/promocion/obtener',body, AppSettings.getHeaders())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }

  quienVioMiPromotion(promotion: RegistrarQuienVioMiPromocionModel): Observable<any> {
    const body = JSON.stringify(promotion);
    this.http.setDataSerializer("utf8");
    return from(this.http.post( this.url + 'api/visitas/promocion/registrar',body, AppSettings.getHeaders())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }

  obtenerNumeroQuienVioPublicacion(idPromotion: number): Observable<any> {
    const body = JSON.stringify({id_promocion: idPromotion});
    this.http.setDataSerializer("utf8");
    return from(this.http.post( this.url + 'api/promociones/obtener/numero_viste_mi_promocion',body, AppSettings.getHeadersToken())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }

  // obtenerNumeroQuienVioPublicacion(id_promocion): Observable<any>{
  //   const body = JSON.stringify({id_promocion: id_promocion});
  //
  //   this. http.setDataSerializer('utf8');
  //   return from(this.http.post(this.url + 'api/promociones/obtener/numero_viste_mi_promocion', body, AppSettings.getHeadersToken())
  //   .then((data) => {
  //     return JSON.parse(data.data);
  //   })
  //   .catch((error) => {
  //     return error;
  //   }));
  // }

  obtenerTipoPromocion(): Observable<any> {
    this.http.setDataSerializer("utf8");
    return from(this.http.get( this.url + 'api/catalogo/tipopromocion/list',{}, AppSettings.getHeadersToken())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }

  obtenerAlcancePromocion(): Observable<any> {
    this.http.setDataSerializer("utf8");
    return from(this.http.get( this.url + 'api/catalogo/alcancepromocion/list',{}, AppSettings.getHeadersToken())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }


  obtenerDetalleDeNegocio(id_negocio: number): Observable<any> {
    const body = JSON.stringify({id_negocio:id_negocio});
    this.http.setDataSerializer("utf8");
    return from(this.http.post( this.url + 'api/lista/producto/negocio',body, AppSettings.getHeadersToken())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }

  solicitarCupon(id_promocion: number, id_persona:number): Observable<any> {
      const body = JSON.stringify({id_promocion:id_promocion, id_persona:id_persona});
      this.http.setDataSerializer("utf8");
      return from(this.http.post( this.url + 'api/promociones/cupon/solicitar',body, AppSettings.getHeadersToken())
          .then( data => {
           
            return JSON.parse(data.data);
          })
          .catch((error) => {
            return error;
          })).pipe(map(data => {
        return data;
      }));
  }

  validarCupon(cupon:ValidarPromocion): Observable<any> {
    const body = JSON.stringify(cupon);
    this.http.setDataSerializer("utf8");
    return from(this.http.post( this.url + 'api/promociones/cupon/aplicar',body, AppSettings.getHeadersToken())
        .then( data => {

          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }
  
  guardar(variable: PromocionesModel): Observable<any> {
    
    const body = JSON.stringify(variable);
    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promociones/guardar', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  eliminar(variable: PromocionesModel) {
    
    const body = JSON.stringify(variable);
    
    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promociones/eliminar', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  guardarPublicacion(publicacion: PublicacionesModel): Observable<any> {
    
    const body = JSON.stringify(publicacion);
    
    this. http.setDataSerializer('utf8');
    return from(this.http.post(this.url + 'api/promocion/publicar', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));

  }

}

import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SolicitudesModel } from './../Modelos/SolicitudesModel';
import { AppSettings } from '../AppSettings';
import { PublicacionesModel } from './../Modelos/PublicacionesModel';
import { UbicacionModel } from '../Modelos/busqueda/UbicacionModel';
import { FiltrosModel } from '../Modelos/busqueda/FiltrosModel';
import { PostulacionModel } from '../Modelos/PostulacionModel';
import { PostuladosModel } from '../Modelos/PostuladosModel';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    // private _http: HttpClient,
    private http: HTTP
  ) {
    this.http.setDataSerializer("utf8");
  }

  /**
   * Servicio para buscar una solicitud
   * @param solicitud
   * @author Omar
   */
  buscar(solicitud: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    return from(this.http.post(this.url + 'api/solicitudes/persona', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
 * Servicio para buscar publicaciones
 * @author Omar
 */
  buscarPublicaciones(): Observable<any> {
    const body = JSON.stringify({});
    return from(
      this.http.post(this.url + '/api/publicaciones/buscar', body,
        AppSettings.getHeadersToken()).then(
          (data) => {
            return JSON.parse(data.data);
          }).catch(
            (error) => {
              return error;
            }
          )
    );
  }
  /**
 * Servicio para guardar una solicitud
 * @param variable
 */
  guardar(variable: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(variable);
    return from(this.http.post(this.url + '/api/solicitudes/guardar', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
 * Servicio para eliminar la solicitud
 * @param variable
 * @author Omar
 */
  eliminar(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return from(this.http.post(this.url + '/api/solicitudes/eliminar',
      body, AppSettings.getHeadersToken()
    ).then(
      (data) => {
        return JSON.parse(data.data);
      }
    ).catch(
      (error) => {
        return error;
      }
    ));
  }
  /**
  * Servicio para guardar la publicacion
  * @param solicitus
  * @author Omar
  */
  guardarPublicacion(publicacion: PublicacionesModel) {
    const body = JSON.stringify(publicacion);
    return from(this.http.post(this.url + '/api/solicitudes/publicar', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
   * Funcion para obtener detalle de quien vio la publicacion
   * @param id_solicitud
   * @author Omar
   */
  obtenerQuienVioPublicacion(idSolicitud): Observable<any> {
    const body = JSON.stringify({ 'id_solicitud': idSolicitud });
    return from(
      this.http.post(
        this.url + '/api/solicitudes/obtener/viste_mi_solicitud', body, AppSettings.getHeadersToken()
      ).then(
        (data) => {
          return JSON.parse(data.data);
        }
      ).catch(
        (error) => { return error; })
    );
  }
  /**
   * Funcion para obtener numero de quien vio la publicacion
   * @param idSolicitud
   * @author Omar
   */
  obtenerNumeroQuienVioPublicacion(idSolicitud): Observable<any> {
    const body = JSON.stringify({ 'id_solicitud': idSolicitud });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + '/api/solicitudes/obtener/numero_viste_mi_solicitud', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
 * Servicio para guardar quien vio la publicacion
 * @param solicitud
 * @author Omar
 */
  guardarQuienVioSolicitud(solicitud: SolicitudesModel, ubicacion: UbicacionModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + '/api/solicitudes/guardar/viste_mi_solicitud', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  obtenerQuienVioMiSolicitud(solicitud: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + '/api/solicitudes/obtener/quienvio', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
   * Funcion para obtener el numero de publicaciones permitidas
   * @param publicacion
   * @author Omar
   */
  obtenerNumeroPublicacionesSolicitud(id_persona): Observable<any> {
    const body = JSON.stringify({ 'id_persona': id_persona });
    return from(this.http.post(this.url + '/api/solicitudes/obtener/numero_publicaciones', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
 * Servicio para dejar de publicar una promocion
 * @param publicacion
 * @author Omar
 */
  quitarPublicacionSolicitud(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return from(
      this.http.post(
        this.url + '/api/solicitudes/eliminar/publicacion', body, AppSettings.getHeadersToken()
      ).then((data) => {
        return JSON.parse(data.data);
      }).catch(
        (error) => {
          return error;
        }
      )
    );
  }
  /**
 * Funcion para obtener las Solicitudes publicadas
 * @author Omar
 */
  buscarSolicitudesPublicadas(): Observable<any> {
    const body = JSON.stringify({});
    return from(
      this.http.post(
        this.url + '/api/solicitudes/buscar/publicadas', body, AppSettings.getHeadersToken()
      ).then(
        (data) => {
          return JSON.parse(data.data);
        }
      ).catch(
        (error) => {
          return error;
        }
      )
    )
  }
  /**
 * Funcion para obtener los dias para publicacion
 * @param id_proveedor
 */
  obtenerDiasPublicacionesSolicitud(id_proveedor): Observable<any> {
    const body = JSON.stringify({ 'id_proveedor': id_proveedor });
    return from(this.http.post(this.url + '/api/solicitudes/obtener/dias_publicaciones', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
   * Servicio para obtener las plantillas
   * @author Omar
   */
  obtenerPlantillasSolicitudes(): Observable<any> {
    const body = JSON.stringify({});
    return from(
      this.http.post(
        this.url + '/api/solicitudes/obtener/plantillas', body, AppSettings.getHeadersToken()
      ).then(
        (data) => {
          return JSON.parse(data.data);
        }
      ).catch(
        (error) => {
          return error;
        }
      )
    );
  }
  /**
 * Funcion para obtener las promociones publicadas
 * @author Omar
 */
  obtenerSolcitudesPublicadas(solicitud: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    return from(this.http.post(this.url + '/api/solicitudes/obtener/publicadas', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
  * Funcion para buscar las promociones publicadas
  * @author Omar
  */
  buscarSolicitudesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({ filtros: filtros });
    return from(
      this.http.post(
        this.url + '/api/solicitudes/buscar/publicadas', body,
        AppSettings.getHeaders()
      ).then(
        (data) => {
          let jsOrigen: any;
          jsOrigen = JSON.parse(data.data);
          const jsCategoria = new Array();
          let categoria = {
            id_categoria_negocio: undefined,
            nombre: undefined,
            id_giro: undefined,
            solicitudes: []
          };
          let solicitud = {
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
                  solicitudes: []
                };

              }

              solicitud = it;

              categoria.solicitudes.push(solicitud);

              if (iterador + 1 >= totalDatos) {
                jsCategoria.push(categoria);
              }

              iterador++;
            });
          }
          jsOrigen.data = jsCategoria;

          return jsOrigen;
        }
      ).catch(
        (error) => {
          return error;
        }
      )
    );
  }
  /**
   * Funcion para buscar las promociones publicadas
   * @author Omar
   */
  obtenerSolicitudesPublicadas(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({ filtros: filtros });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + '/api/solicitudes/buscar/publicadas', body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
   * Servicio para dejar de publicar una publicacion
   * @param publicacion
   * @author Omar
   */
  quitarPublicacion(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return from(this.http.post(this.url + '/api/solicitudes/dejar/publicar', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
  /**
  * Servicio para guardar la postulacion
  * @param descripcion
  * @param archivo
  */
  enviarPostulacion(postulacion: PostulacionModel): Observable<any> {
    const body = JSON.stringify(postulacion);
    return from(
      this.http.post(
        this.url + '/api/solicitudes/guardar/postulacion', body,
        AppSettings.getHeadersToken()
      ).then(
        (data) => {
          return JSON.parse(data.data);
        }
      ).catch(
        (error) => {
          return error;
        }

      )
    );
  }
  /**
   * Funcion para obtener detalle de los postulados
   * @param id_solicitud
   * @author Omar
   */
  obtenerPostulados(idSolicitud): Observable<any> {
    const body = JSON.stringify({ 'id_solicitud': idSolicitud });
    return from(this.http.post(this.url + '/api/solicitudes/obtener/postulados', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }

  /**
   * Funcion para checkear postulacion
   * @param id_solicitud
   * @author Omar
   */
  checkendPostulacion(postulado: PostuladosModel): Observable<any> {
    const body = JSON.stringify(postulado);
    return from(this.http.post(this.url + '/api/solicitudes/guardar/checkend', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }
}

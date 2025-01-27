import { FiltroNegocioModel } from './../Modelos/FiltroNegocioModel';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../AppSettings';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatosNegocios } from '../Modelos/DatosNegocios';
import { NegocioModel } from '../Modelos/NegocioModel';
import { HTTP } from '@ionic-native/http/ngx';
import { FiltroEstadisticaModel } from '../Modelos/FiltroEstadisticaModel';
import { StatisticsFilterInterface } from '../Bitoo/models/filters-model';
import { IContenidosNegocio } from '../interfaces/IContenidosNegocio';

@Injectable({
    providedIn: 'root'
})
export class NegocioService {

    selectedObj: any;

    constructor(
        private http: HttpClient,
        private _http: HTTP
    ) {
    }

    url = `${AppSettings.API_ENDPOINT}`;

    setSelectedObj(obj: any) {
        this.selectedObj = obj;
    }

    getSelectedObj() {
        return this.selectedObj;
    }

    obteneretalleNegocio(negocioo: string, persona: any): Observable<any> {
        const body = JSON.stringify({ negocio: negocioo, id_persona: persona });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + '/proveedor/obtener/detalleNegocio',
            body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerNegocio(idNegocio: number) {
        const body = JSON.stringify({ "id_negocio": idNegocio });
        this._http.setDataSerializer('utf8');
        return from(
            this._http.post(
                this.url + 'api/negocios/obtenerDatosBasicos', body, AppSettings.getHeaders()
            ).then((data) => {
                return JSON.parse(data.data);
            }).catch((error) => {
                return error;
            })
        );

    }

    public obtenerDetalleDeNegocio(negocio: number, tip, persona): Observable<any> {
        const body = JSON.stringify({ id_negocio: negocio, tipo: tip, id_persona: persona });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/lista/producto/negocio',
            body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    public obtenerPromocionesAnuncio(idNegocio: number): Observable<any> {
        const body = JSON.stringify({negocio: idNegocio});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/promociones/buscar/publicadas/byNegocio',
            body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    misNegocios(id: number): Observable<any> {
        const body = JSON.stringify({ id_proveedor: id });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/buscar/mis-negocios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    misNegociosEstadisticas(proveedor: number, rol: number): Observable<any> {
        const body = JSON.stringify({ id_proveedor: proveedor, id_rol: rol });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/buscar/mis-negocios/estadisticas',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    buscarProductosServios(id: number, tipo: number): Observable<any> {
        const body = JSON.stringify({ id_negocio: id, tipo: tipo });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/lista/producto/negocio',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    guardarProductoServio(datosNegocio: DatosNegocios): Observable<any> {
        const body = JSON.stringify(datosNegocio);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/guardarProductosServicios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerNumMaxProductos(idNegocio): Observable<any> {
        const body = JSON.stringify({ id: idNegocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero/max/productos',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    modificarCategoria(enviar: any): Observable<any> {
        const body = JSON.stringify(enviar);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/modificar/categoria',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    eliminarCategoria(enviar: any): Observable<any> {
        const body = JSON.stringify(enviar);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/eliminar/categoria',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    agregarCategoria(enviar: any): Observable<any> {
        const body = JSON.stringify(enviar);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/guardar/categoria',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    public obtnerTipoNegocio(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/servicio/lista/negocios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    buscarNegocio(idNegocio: any): Observable<any> {
        const body = JSON.stringify({ id: idNegocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(this.url + 'api/buscar/negocio', body, AppSettings.getHeadersToken()).then((data) => {
            let respuesta;
            respuesta = JSON.parse(data.data)
            return JSON.parse(data.data);
        })
            .catch((error) => {
                return error;
            }));
    }

    getUrlNegocioById(id: number) {
        const body = JSON.stringify({ id: id });
        return this.http.post(
            this.url + 'api/buscar/negocio', body,
            { headers: AppSettings.getHeadersToken() }
        ).pipe(map(res => {
            return res;
        }));
    }

    // buscarNegocio(idNegocio: any): Observable < any > {
    //     const body = JSON.stringify({ id: idNegocio });
    //     return this.http.post(
    //         this.url + 'api/buscar/negocio', body,
    //         { headers: AppSettingsService.getHeadersToken() }
    //     ).pipe(map(res => {
    //         return res;
    //     }));
    // }


    obtenerComentariosNegocio(idNegocio: number): Observable<any> {
        const body = JSON.stringify({ id_negocio: idNegocio });

        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/negocio_comentarios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }


    categoriaPrincipal(id: number): Observable<any> {
        const body = JSON.stringify({ id_tipo_negocio: id });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/servicio/tipoProductoServicio',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerCategorias(id: any): Observable<any> {
        const body = JSON.stringify({ id_giro: id });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'buscar/giro/categorias',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerCategoriasProdServ(id: any, negocio_id: number): Observable<any> {
        const body = JSON.stringify({ id_giro: id, id_tipo_negocio: negocio_id });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'buscar/giro/categorias',
            body, AppSettings.getHeadersToken())
            .then((data) => {
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
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/catalogo/organizaciones/obtenerTodasActivas',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerCatDistintivos(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/catalogo/distintivos/obtenerTodosActivos',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerPlazas(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/catalogo/plazas/obtenerTodas',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerConvenio(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/catalogo/afiliaciones/obtenerTodasActivas',
            body, AppSettings.getHeadersToken())
            .then((data) => {
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
        const body = JSON.stringify({ url_negocio: url_negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/verificar_url',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    guardar(negocio: NegocioModel): Observable<any> {
        const body = JSON.stringify(negocio);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/proveedor/guardar_negocio',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);

            })
            .catch((error) => {
                return error;
            }));
    }


    calcularCostoDeEnvio(minutos: number, kilometros: number): Observable<any> {
        const body = JSON.stringify({ minutos: minutos, kilometros: kilometros });
        return from(this._http.post(this.url + 'api/pedidos/calcularEnvio', body, AppSettings.getHeadersToken())
            .then(data => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            })).pipe(map(data => {
                return data;
            }));
    }

    activarDesactivar(id_negocio: number, cambio: boolean): Observable<any> {
        const body = JSON.stringify({ negocio: id_negocio, valor: cambio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/activar-desactivar',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    registrarPedido(datos): Observable<any> {
        const body = JSON.stringify(datos);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/pedios/registrar',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    enviarMensajePedido(telefono_usuario: number, id_negocio: number): Observable<any> {
        const body = JSON.stringify({ telefono_usuario: telefono_usuario, id_negocio: id_negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/proveedor/enviar_mensaje_pedido',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerNumMaxServicios(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero/max/servicios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    /**
     * Funcion para guardar quien vio mi negocio por qr
     */
    visteMiNegocioQr(id_negocio: number): Observable<any> {
        const body = JSON.stringify({ id_negocio: id_negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/guardar/viste_mi_negocio_qr',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    /**
     * Funcion para guardar quien vio mi negocio
     */
    visteMiNegocio(id_negocio: number): Observable<any> {
        const body = JSON.stringify({ id_negocio: id_negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/guardar/viste_mi_negocio',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    /**
     * Funcion para guardar quien vio mi negocio
     */
    obtenerIdNegocioUrl(url_negocio: string): Observable<any> {
        const body = JSON.stringify({ url_negocio: url_negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/negocio_url',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    public obtenerIP(): Observable<any> {
        let datos = from(this._http.get('https://api.ipify.org?format=json', {},
            { 'Content-Type': 'application/json' })
            .then(data => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));

        return datos.pipe(map(data => {
            return data;
        }));
    }

    guardarRegistro(variable: any): Observable<any> {
        const body = JSON.stringify(variable);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${this.url}api/visitas/RegistrarEntrasteABitoo`, body, AppSettings.getHeaders())
            .then((data) => {


                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }


    solicitarValidacionNegocio(idNegocio: any): Observable<any> {
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/validar/validacionNegocio',
            idNegocio, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaVisitasQR(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero_visto_qr',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaVisitasURL(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero_visto',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaLikesNegocio(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero_likes',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaComentariosNegocio(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/negocio/numero_comentarios',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaSolicitudesNegocio(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/solicitudes/numero_visto_solicitudes',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaPromocionesNegocio(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/promociones/numero_visto_promocion',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    estadisticaVistasProductosNegocio(filtroEstadistica: FiltroEstadisticaModel): Observable<any> {
        const body = JSON.stringify(filtroEstadistica);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/productos/numero_visto_productos',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    obtenerIdUsuarioByNegocio(negocio: string): Observable<any> {
        const body = JSON.stringify({ id_negocio: negocio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(this.url + 'api/negocio/information/proveedor', body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }
    obtenerTiposDePagosPorNegocio(idNegocio: string | number): Observable<any> {
        const body = JSON.stringify({ idNegocio: idNegocio });
        return from(this._http.post(this.url + '/api/catalogo/tipopago/list', body, AppSettings.getHeadersToken())
            .then(
                (respuesta) => {
                    return JSON.parse(respuesta.data);
                })
            .catch((error) => {
                return error;
            }));
    }
    clickRedSocial(idNegocio, Rsocial, idpersona): Observable<any> {
        const body = JSON.stringify({
            id_negocio: idNegocio,
            opcion: Rsocial,
            id_persona: idpersona
        });
        return from(this._http.post(this.url + '/api/negocio/guardar/interactuaste_mi_negocio', body, AppSettings.getHeadersToken())
            .then(
                (respuesta) => {
                    return JSON.parse(respuesta.data);
                })
            .catch((error) => {
                return error;
            }));
    }
    numero_interacciones(filters: StatisticsFilterInterface): Observable<any> {
        const body = JSON.stringify(filters);
        return from(this._http.post(this.url + '/api/negocio/numero_interacciones', body, AppSettings.getHeadersToken())
            .then(
                (respuesta) => {
                    return JSON.parse(respuesta.data);
                })
            .catch((error) => {
                return error;
            }));
    }
    numero_compras(filters: StatisticsFilterInterface): Observable<any> {
        const body = JSON.stringify(filters);
        return from(this._http.post(this.url + '/api/negocio/numero_compras', body, AppSettings.getHeadersToken())
            .then(
                (respuesta) => {
                    return JSON.parse(respuesta.data);
                })
            .catch((error) => {
                return error;
            }));
    }
    numero_interacciones_mapa(filters: StatisticsFilterInterface): Observable<any> {
        const body = JSON.stringify(filters);
        return from(this._http.post(this.url + '/api/negocio/numero_interacciones_mapa', body, AppSettings.getHeadersToken())
            .then(
                (respuesta) => {
                    return JSON.parse(respuesta.data);
                })
            .catch((error) => {
                return error;
            }));
    }

    obtenerContenidosNegocio(id: number): Observable<any> {
        const body = JSON.stringify({ id_negocio: id });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/contenidos/contenidosNegocio',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    guardarContenidoNegocio(contenido: IContenidosNegocio): Observable<any> {
        const body = JSON.stringify(contenido);
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/contenidos/guardar',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    eliminarContenidoNegocio(id_contenido: number): Observable<any> {
        const body = JSON.stringify({id_contenido: id_contenido});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(
            this.url + 'api/contenidos/eliminar',
            body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }
}

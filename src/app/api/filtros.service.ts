import {Injectable, EventEmitter, Output} from '@angular/core';
import {AppSettings} from "../AppSettings";
import {Observable, from} from "rxjs";
import {map} from "rxjs/operators";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class FiltrosService {
    private url: string;
    public actualizar = false;
    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private http: HTTP
    ) {
        this.url = AppSettings.API_ENDPOINT;
    }

    public obtenerEstados(): Observable<any> {
        const body = JSON.stringify({conNegocios:1});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url + 'api/proveedor/obtener/lista_estados',body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        
        return datos.pipe(map(data => {
            return data;
        }));
    }

    public obtenerMunicipios(idEstado): Observable<any> {
        const body = JSON.stringify({id_estado: idEstado, conNegocios:1});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(`${this.url}api/catalogo/municipio/list`,body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }

    public getLocalidad(id_municipio: number): Observable<any> {
        const body = JSON.stringify({id_municipio: id_municipio, conNegocios:1});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url + 'api/catalogo/localidad/list',body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }


    tipoNegocios(): Observable<any> {
        const body = JSON.stringify({});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url + 'api/proveedor/catalogos/obtener',body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }

    obtenerPreferencias(idPersona:any): Observable<any> {
        const body = JSON.stringify({id_persona : idPersona});
        console.log("El bodysss: "+body)
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url+'/api/preferencias/persona/obtener',body,
        AppSettings.getHeadersToken())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }
    guardarMisPreferencias(preferencias: any): Observable<any> {
        const body = JSON.stringify(preferencias);
        console.log("El body preferencias: "+body)
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url+'/api/preferencias/persona/guardar',body,
        AppSettings.getHeadersToken())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
      }
    obtenerGiros(): Observable<any> {
        const body = JSON.stringify({});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url + '/buscar/giros',body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }


    obtenerCategoriasGiro(idGiro): Observable<any> {
        const body = JSON.stringify({id_giro: idGiro});
        this.http.setDataSerializer("utf8");
        let datos = from(this.http.post(this.url+'/buscar/giro/categorias',body,
        AppSettings.getHeaders())
        .then( data => {
            return JSON.parse(data.data);
        })
        .catch((error) => {
            return error;
        }));
        return datos.pipe(map(data => {
            return data;
        }));
    }

    actualizarfiltro() {
        this.actualizar = true;
        this.change.emit(this.actualizar);
    }
}

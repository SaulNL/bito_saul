import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
        private http: HttpClient,
        private httpNative: HTTP
    ) {
        this.url = AppSettings.API_ENDPOINT;
    }

    public obtenerEstados(): Observable<any> {
        const body = JSON.stringify({});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(this.url + 'api/proveedor/obtener/lista_estados',body,
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

        // return this.http.post(
        //     this.url + 'api/proveedor/obtener/lista_estados',
        //     {},
        //     {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {
        //     return data;
        // }));
    }

    public obtenerMunicipios(idEstado): Observable<any> {
        const body = JSON.stringify({id_estado: idEstado});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(`${this.url}api/catalogo/municipio/list`,body,
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
        // return this.http.post(
        //     `${this.url}api/catalogo/municipio/list`,
        //     body,
        //     {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {
        //     return data;
        // }));
    }

    public getLocalidad(id_municipio: number): Observable<any> {
        const body = JSON.stringify({id_municipio: id_municipio});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(this.url + 'api/catalogo/localidad/list',body,
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

        // return this.http.post(
        //     this.url + 'api/catalogo/localidad/list',
        //     body, {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {

        //     return data;
        // }));
    }


    tipoNegocios(): Observable<any> {
        const body = JSON.stringify({});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(this.url + 'api/proveedor/catalogos/obtener',body,
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

        // return this.http.post(
        //     this.url + 'api/proveedor/catalogos/obtener',
        //     {},
        //     {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {
        //     return data;
        // }));
    }

    obtenerGiros(): Observable<any> {
        const body = JSON.stringify({});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(this.url + '/buscar/giros',body,
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

        // return this.http.post(
        //     this.url + '/buscar/giros',
        //     {},
        //     {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {
        //     return data;
        // }));
    }


    obtenerCategoriasGiro(idGiro): Observable<any> {
        const body = JSON.stringify({id_giro: idGiro});
        this.httpNative.setDataSerializer("utf8");
        let datos = from(this.httpNative.post(this.url+'/buscar/giro/categorias',body,
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
        // return this.http.post(
        //     this.url+'/buscar/giro/categorias',
        //     body,
        //     {headers: AppSettings.getHeaders()}
        // ).pipe(map(data => {
        //     return data;
        // }));
    }

    actualizarfiltro() {
        this.actualizar = true;
        this.change.emit(this.actualizar);
    }
}

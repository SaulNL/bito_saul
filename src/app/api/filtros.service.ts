import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class FiltrosService {
    private url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = AppSettings.API_ENDPOINT;
    }

    public obtenerEstados(): Observable<any> {
        return this.http.post(
            this.url + 'api/proveedor/obtener/lista_estados',
            {},
            {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {
            return data;
        }));
    }

    public obtenerMunicipios(idEstado): Observable<any> {
        const body = JSON.stringify({id_estado: idEstado});
        return this.http.post(
            `${this.url}api/catalogo/municipio/list`,
            body,
            {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {
            return data;
        }));
    }

    public getLocalidad(id_municipio: number): Observable<any> {
        const body = JSON.stringify({id_municipio: id_municipio});
        return this.http.post(
            this.url + 'api/catalogo/localidad/list',
            body, {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {

            return data;
        }));
    }


    tipoNegocios(): Observable<any> {
        return this.http.post(
            this.url + 'api/proveedor/catalogos/obtener',
            {},
            {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {
            return data;
        }));
    }

    obtenerGiros(): Observable<any> {
        return this.http.post(
            this.url + '/buscar/giros',
            {},
            {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {
            return data;
        }));
    }


    obtenerCategoriasGiro(idGiro): Observable<any> {
        const body = JSON.stringify({id_giro: idGiro});
        return this.http.post(
            this.url+'/buscar/giro/categorias',
            body,
            {headers: AppSettings.getHeaders()}
        ).pipe(map(data => {
            return data;
        }));
    }
}

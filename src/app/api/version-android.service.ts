import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../AppSettings';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class VersionAndroidService {
    url = `${AppSettings.API_ENDPOINT}`;

    constructor(private http: HTTP) {
        this.http.setDataSerializer("utf8");
    }

    public getDeviceInfo(idDevice: number): Observable<any> {
        const body = JSON.stringify({'id_device': idDevice});
        this.http.setDataSerializer("utf8");
        return from(this.http.post(`${this.url}api/service/devices`, body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }

    public obtenerVersion(): Observable<any> {
        const body = JSON.stringify({});
        this.http.setDataSerializer("utf8");
        return from(this.http.post(`${this.url}api/catalogo/version/obtener`, body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }
}

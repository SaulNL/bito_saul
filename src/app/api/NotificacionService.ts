import { Injectable } from '@angular/core';
import { AppSettings } from '../AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {NotificacionModel} from '../Modelos/NotificacionModel';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {

    public lstNotificaciones: Array<NotificacionModel> = Array<NotificacionModel>();
    public url = `${AppSettings.API_ENDPOINT}`;

    constructor( private _http: HttpClient) { }

    public push(notificacion: NotificacionModel) {
        if (notificacion !== undefined && notificacion != null && notificacion.mensaje != undefined && notificacion.mensaje != null) {
            this.lstNotificaciones.push(notificacion);
            this.reset();
        }
    }

    public pushInfo(infoMensaje: string) {
        this.push(new NotificacionModel(infoMensaje, AppSettings.getTypeMessageByCode(200)));
    }

    public pushAlert(alertMensaje: string) {
        this.push(new NotificacionModel(alertMensaje, AppSettings.getTypeMessageByCode(301)));
    }

    public pushError(errorMensaje: string) {
        this.push(new NotificacionModel(errorMensaje, AppSettings.getTypeMessageByCode(500)));
    }

    public pushMsjResponse(mensajesNot: Array<any>, code: number) {
        let severityClass = AppSettings.getTypeMessageByCode(code);
        if (mensajesNot !== undefined && mensajesNot !== null) {
            mensajesNot.forEach(element => {
                if (severityClass !== "alert-success") { //solo imprime las notificaciones que no son informativas
                    this.push(new NotificacionModel(element, severityClass));
                }
            });
        }
    }

    public pushMsjRespuesta(mensajesNot: Array<any>, code: number) {
        let severityClass = AppSettings.getTypeMessageByCode(code);
        if (mensajesNot !== undefined && mensajesNot !== null) {
            mensajesNot.forEach(element => {
                this.push(new NotificacionModel(element, severityClass));
            });
        }
    }

    public mostrarMensajeRespuesta(mensajesNot: Array<any>) {
        if (mensajesNot !== undefined && mensajesNot !== null) {
            mensajesNot.forEach(element => {
                this.push(new NotificacionModel(element, 'alert-success'));
            });
        }
    }

    public reset() {
        if (this.lstNotificaciones !== undefined && this.pushAlert != null && this.lstNotificaciones.length > 0) {
            setTimeout(() => {
                if (this.lstNotificaciones.length > 0) {
                    this.lstNotificaciones.shift();
                }
            }, 6000);
        }
    }

    public quitar_mensaje(id: number) {
        this.lstNotificaciones = this.lstNotificaciones.filter(function (not) {
            return not.id !== id;
        });
    }

    mostrarMensajeRespuestaError(mensajesNot: Array<any>) {
        if (mensajesNot !== undefined && mensajesNot !== null) {
            mensajesNot.forEach(element => {
                this.push(new NotificacionModel(element, 'alert-danger'));
            });
        }
    }

    /**
     * Servicio para obtener las notificaciones-
     * @param idPersona
     * @author Omar
     */
    obtenerNotificaciones(idProveedor: number): Observable<any> {
        const body = JSON.stringify({id_proveedor: idProveedor});
        return this._http.post(
            `${this.url}api/proveedor/obtener/notificaciones`,
            body,
            {headers: AppSettings.getHeadersToken()}
        ).pipe(map(data => {
            return data;
        }));
    }
    obtenerEncuestaRapida(body): Observable<any> {
        return this._http.post(
            `${this.url}api/admin/catalogos/obtener/preguntasrapidasPendientesUsuario`,
            body,
            {headers: AppSettings.getHeadersToken()}
        ).pipe(map(data => {
            return data;
        }));
    }

    enviarEncuestaRapida(body): Observable<any>{
        return this._http.post(
            `${this.url}api/admin/catalogos/guardar/preguntasrapidasUsuario`,
            body,
            {headers: AppSettings.getHeadersToken()}
        ).pipe(map(data=>{
            return data;
        }))

    }

    /**
     * Funcion para cambiar el estatus de la notificacion
     * @param idNotificacion
     * @author Omar
     */
    cambiarEstatusNotificacion(idNotificacion: number, valor: number): Observable<any> {
        const body = JSON.stringify({id_notificacion: idNotificacion, estatus: valor});
        return this._http.post(
            `${this.url}api/proveedor/cambiar/estatus/notificaciones`,
            body,
            {headers: AppSettings.getHeadersToken()}
        ).pipe(map(data => {
            return data;
        }));
    }
}

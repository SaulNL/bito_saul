export class NotificacionModel {

    id: number;
    mensaje: String;
    severityClass: String;

    constructor(mensaje: String, severityClass: String){
        this.mensaje = mensaje;
        this.severityClass = severityClass;
        this.id = (new Date()).getTime();
    }
}
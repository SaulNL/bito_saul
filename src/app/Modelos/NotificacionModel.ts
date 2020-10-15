export class NotificacionModel {

  id: number;
  mensaje: string;
  severityClass: string;

  constructor(mensaje: string, severityClass: string) {
    this.mensaje = mensaje;
    this.severityClass = severityClass;
    this.id = (new Date()).getTime();
  }
}

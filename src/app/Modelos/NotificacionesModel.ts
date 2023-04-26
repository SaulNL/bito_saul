export class NotificacionesModel{
    id_notificacion: number;
    mensaje: string;
    acccion: string;
    estatus: number;
    titulo: string;
    fecha: string;


    // tslint:disable-next-line:max-line-length
    constructor(idNotificacion: number = null, mensaje: string = null, acccion: string = null, estatus: number = null, titulo: string = null, fecha:string = null) {
        this.id_notificacion = idNotificacion;
        this.mensaje = mensaje;
        this.acccion = acccion;
        this.estatus = estatus;
        this.titulo = titulo;
        this.fecha = fecha;
    }

}
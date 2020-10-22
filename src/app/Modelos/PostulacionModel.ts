export class PostulacionModel{
  idPersona: number;
  idSolicitud: number;
  descripcion:string;
  archivo:any;


  constructor(idPersona: number = 0, idSolicitud: number = 0, descripcion: string = '', archivo: any= null) {
    this.idPersona = idPersona;
    this.idSolicitud = idSolicitud;
    this.descripcion = descripcion;
    this.archivo = archivo;
  }
}

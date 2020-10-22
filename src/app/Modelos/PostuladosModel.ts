export class PostuladosModel{
  public id_solicitud_postulado;
  public id_solicitud;
  public id_persona;
  public descripcion;
  public url_archivo;
  public fecha;
  public nombre;
  public checkend;
  public celular;


  constructor(id_solicitud_postulado=null, id_solicitud=null, id_persona=null, descripcion=null, url_archivo=null, fecha=null,  nombre = null, checkend = false, celular = null) {
    this.id_solicitud_postulado = id_solicitud_postulado;
    this.id_solicitud = id_solicitud;
    this.id_persona = id_persona;
    this.descripcion = descripcion;
    this.url_archivo = url_archivo;
    this.fecha = fecha;
    this.nombre = nombre;
    this.checkend = checkend;
    this.celular = celular;
  }
}

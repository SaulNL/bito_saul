export class AfiliacionPlazaModel {
  public id_organizacion: number;
  public nombre: string | null;
  public icon: string | null;
  public url_organizacion: string | null;

  constructor(id_organizacion: number, nombre: string | null, icon: string | null, url_organizacion: string | null) {
    this.id_organizacion = id_organizacion;
    this.nombre = nombre;
    this.icon = icon;
    this.url_organizacion = url_organizacion;
  }
}

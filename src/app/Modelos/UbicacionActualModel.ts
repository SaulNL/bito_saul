export class UbicacionActualModel {
  public distance: string;
  public estado: string;
  public municipio: string;
  public localidad: string;


  constructor(distance: string = '', estado: string = '', municipio: string = '', localidad: string = '') {
    this.distance = distance;
    this.estado = estado;
    this.municipio = municipio;
    this.localidad = localidad;
  }
}

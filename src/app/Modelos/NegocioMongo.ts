export class NegocioMongo {
  idNegocio: number;
  nombre: string;
  dirección: number;
  logo: string;

  constructor(idNegocio = null, nombre= null, dirección = null, logo= null) {
    this.idNegocio = idNegocio;
    this.nombre = nombre;
    this.dirección = dirección;
    this.logo = logo;
  }
}

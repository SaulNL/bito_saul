export class ProductoModel {
  public nombre: string;
  public descripcion: string;
  public precio: string;
  public categoria: string;
  public imagen: string;
  public negocio: any;
  existencia: any;


  constructor(nombre = null, descripcion = null, precio = null, categoria = null, imagen = null, negocio = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
    this.negocio = negocio;
  }
}

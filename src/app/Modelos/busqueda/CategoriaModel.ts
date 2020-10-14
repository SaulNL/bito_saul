import {ProductoModel} from './ProductoModel';

export class CategoriaModel {
  public nombre: string;
  public id_categoria: number;
  public productos: Array<ProductoModel>;
  public servicios: Array<ProductoModel>;


  constructor(nombre: string, id_categoria: number, productos: Array<ProductoModel>, servicios: Array<ProductoModel>) {
    this.nombre = nombre;
    this.id_categoria = id_categoria;
    this.productos = productos;
    this.servicios = servicios;
  }
}

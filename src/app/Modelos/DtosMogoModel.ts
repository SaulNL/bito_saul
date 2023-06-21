import { ArchivoComunModel } from './ArchivoComunModel';
import { DtosNegocioMogoModel } from './DtosNegocioMogoModel';

export class DtosMogoModel {
  public categoria: any;
  categoria2: any;
  index: number;
  public descripcion: string;
  public existencia: boolean;
  public cantidad_disponibles: number;
  public id_categoria: number;
  public imagen: any;
  public likes: number;
  public
  negocio: DtosNegocioMogoModel;
  public nombre: string;
  public nombre_categoria1: string;
  public nombre_categoria2: string;
  public activo: boolean;
  public precio: string;
  public usuario_dio_like: boolean;
  public idProducto:any;

  constructor(nombre = null, descripcion = null, precio = null, cantidad_disponibles = null, categoria = null, idProducto = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.cantidad_disponibles = cantidad_disponibles;
    this.idProducto = idProducto
    this.categoria = categoria;
    this.imagen = new ArchivoComunModel();
    this.negocio = new DtosNegocioMogoModel();
  }
}

import { ArchivoComunModel } from './ArchivoComunModel';
import { DtosNegocioMogoModel } from './DtosNegocioMogoModel';

export class DtosMogoModel {
  public categoria: any;
  categoria2: any;
  index: number;
  public descripcion: string;
  public existencia: boolean;
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

  constructor(nombre = null, descripcion = null, precio = null, categoria = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = new ArchivoComunModel();
    this.negocio = new DtosNegocioMogoModel();
  }
}

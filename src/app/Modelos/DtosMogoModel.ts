import {ArchivoComunModel} from './ArchivoComunModel';
import {NegocioMongo} from './NegocioMongo';

export class DtosMogoModel {
  public nombre: string;
  public descripcion: string;
  public precio: string;
  public categoria: any;
  public imagen: any;
  public negocio: NegocioMongo;
  public existencia: any;
  categoria2: any;
  nombre_categoria1: any;
  nombre_categoria2: any;
  index: number;
  id_categoria: number;


  constructor(nombre = null, descripcion = null, precio = null, categoria = null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = new  ArchivoComunModel();
    this.negocio = new NegocioMongo();
  }
}

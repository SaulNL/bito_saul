import { ArchivoComunModel } from '../ArchivoComunModel';

export class FiltroCatSubCategoriasModel {
  public id_categoria: number;
  public nombre: string;
  public activo: number;
  public id_giro: number;
  //imagen
  public url_imagen: string;
  public imagen: ArchivoComunModel;
  //Icono Marker
  public url_icon: string;
  public marker: ArchivoComunModel;


  constructor(id_categoria: number = null, nombre: string = null, activo: number = null, id_giro: number = null, url_imagen: string = null, imagen: ArchivoComunModel = null, url_icon: string = null, marker: ArchivoComunModel = null) {
    this.id_categoria = id_categoria;
    this.nombre = nombre;
    this.activo = activo;
    this.id_giro = id_giro;
    this.url_imagen = url_imagen;
    this.imagen = imagen;
    this.url_icon = url_icon;
    this.marker = marker;
  }
}

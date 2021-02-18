import {DetDomicilioModel} from './DetDomicilioModel';
import {CategoriaModel} from './CategoriaModel';
import {ArchivoComunModel} from './ArchivoComunModel';
import {PromocionesModel} from "./PromocionesModel";

export class MsNegocioModel {
  public id_negocio: number;
  public rfc: string;
  public descripcion: string;
  public nombre_comercial:string;
  public url_logo:string;
  public id_tipo_negocio:number;
  public id_domicilio:number;
  public id_facebook:number;
  public sitio_web:string;
  public telefono:string;
  public correo:string;
  public especifique_tipo_negocio:string;
  public activo:number;
  public giro:string;
  public entrega_sitio:number;
  public consumo_sitio:number;
  public entrega_domicilio:number;
  public alcance_entrega:string;
  public tiempo_entrega_kilometro:string;
  public id_giro:number;
  public lstProductos:Array<any>;
  public lstServicios:Array<any>
  public costo_entrega: number;
  public categorias: Array<CategoriaModel>;
  public satisfaccionProveedor: number;
  public archivo: Array<ArchivoComunModel>;
  public det_domicilio: DetDomicilioModel;
  public domicilio: DetDomicilioModel;
  public tipo_pago: string;
  public distancia:number;

  public lstDatos:any;
  categoria_negocio: any;
  id_categoria_negocio: number;
  celular: any;
  catServicos: any;
  catProductos: any;
  public promociones: Array<PromocionesModel>;

  public cartaProducto: string;
  public cartaServicio: string;
  public tagsProductos: Array<string>;
  public tagsServicios: Array<string>;

  public calificacion:number;
  public promedio: number;
  public numCalificaciones: number;
  public comentario:string;
  public comentarios: Array<any>;

  public url_negocio:string;
  public likes: any;
}

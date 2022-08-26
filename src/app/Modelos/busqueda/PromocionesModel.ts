import {MsNegocioModel} from './MsNegocioModel';
import {MsProveedorModel} from './MsProveedorModel';
import {EstatusModel} from "./EstatusModel";
import {DiasArrayModel} from "./DiasArrayModel";

export class PromocionesModel {
  public id_promocion: number;
  public promocion: string;
  public tags: Array<string> = new Array<string>();
  public terminos: string;
  public imagen: any;
  public imagenBanner: any;
  public imagenPoster: any;
  public url_imagen: string;
  public url_imagen_banner: string;
  public url_imagen_poster: string;
  public activo: boolean;
  public fecha_inicio: Date;
  public fecha_fin: Date;
  public proveedor: string;
  public nombre: string;
  public nombre_comercial: string;
  public negocio: MsNegocioModel;
  public proveedorNegocio: MsProveedorModel;
  public categoria:string;
  public id_giro:number;

  public fecha_inicio_public: Date;
  public fecha_fin_public: Date;

  public id_proveedor:number;

  public lstDatos: any;
  public promociones:Array<PromocionesModel>;

  public restanDias:any;
  public select:any;

  public distanciaNegocio:any;
  public latitud:any;
  public longitud:any;

  public diasArray:Array<DiasArrayModel>;
  public estatus:EstatusModel;
  public horarios:any;

  public abierto:any;
  public giro_negocio: any;

  public id_tipo_promocion:number;
  public porcentaje:number;
  public organizaciones:Array<any> = new Array<any>();
  public dias:Array<any>;
  public calle: string;
  public numero_ext:number;
  public colonia:string;
  public nombre_localidad:string;
  public nombre_municipio:string;
  public nombre_estado:string;
  
  constructor(id_promocion: number = 0, promocion: string = '', tags: Array<string> = [], terminos: string = '', imagen: any = '', imagenBanner: any = '', imagenPoster: any = '', url_imagen: string = '', url_imagen_banner: string = '', url_imagen_poster: string = '', activo: boolean = null, fecha_inicio: Date = null, fecha_fin: Date = null, proveedor: string = '', nombre_comercial: string = '', select = 0) {
    this.id_promocion = id_promocion;
    this.promocion = promocion;
    this.tags = tags;
    this.terminos = terminos;
    this.imagen = imagen;
    this.imagenBanner = imagenBanner;
    this.imagenPoster = imagenPoster;
    this.url_imagen = url_imagen;
    this.url_imagen_banner = url_imagen_banner;
    this.url_imagen_poster = url_imagen_poster;
    this.activo = activo;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.proveedor = proveedor;
    this.nombre_comercial = nombre_comercial;
    this.select = select;
  }
}

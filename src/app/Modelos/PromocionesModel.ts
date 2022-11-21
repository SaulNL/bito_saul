import {MsNegocioModel} from './MsNegocioModel';
import {MsProveedorModel} from './MsProveedorModel';
import {EstatusModel} from "./EstatusModel";
import {DiasArrayModel} from "./DiasArrayModel";

import { HorarioPromocionModel } from './HorarioPromocionModel';

export class PromocionesModel {
  public id_promocion: number;
  public promocion: string;
  public tags: Array<string> = new Array<string>();
  public terminos: string;
  public imagen: any;
  public video: any;
  public imagenBanner: any;
  public imagenPoster: any;
  public url_imagen: string;
  public url_imagen_banner: string;
  public url_imagen_poster: string;
  public url_video: string;
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
  totalPublicaciones: number;

  public id_negocio:number;
  public jsonImagenCuadrada:string;
  public jsonImagenBanner:string;

  public id_publicacion:number;

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

  public id_tipo_promocion: any;
  public id_alcance_promocion: any;
  public minimo: any;
  public maximo_red: any;
  public porcentaje: any;

  public dias:Array<any>;
  public organizaciones:Array<any> = new Array<any>();
  public plazas:Array<any> = new Array<any>();
  public productos:Array<any> = new Array<any>();
  public categorias:Array<string> = new Array<string>();
  public convenios:Array<any> = new Array<any>();

  constructor(id_promocion: number = 0, id_negocio: number=0, promocion: string = '', tags: Array<string> = [], terminos: string = '', imagen: any = '', video: any = '', imagenBanner: any = '', imagenPoster: any = '', url_imagen: string = '', url_imagen_banner: string = '', url_imagen_poster: string = '', url_video: string = '', activo: boolean = null, fecha_inicio: Date = null, fecha_fin: Date = null, proveedor: string = '', nombre_comercial: string = '', select = 0, id_tipo_promocion: any = '', id_alcance_promocion: any ='', minimo: any = '',maximo_red: any='',porcentaje: any='', productos: Array<any> = [], categorias: Array<any> = [], organizaciones: Array<any> = [], plazas: Array<any> = []) {
    this.id_promocion = id_promocion;
    this.promocion = promocion;
    this.tags = tags;
    this.terminos = terminos;
    this.imagen = imagen;
    this.video = video;
    this.imagenBanner = imagenBanner;
    this.imagenPoster = imagenPoster;
    this.url_imagen = url_imagen;
    this.url_imagen_banner = url_imagen_banner;
    this.url_imagen_poster = url_imagen_poster;
    this.url_video = url_video;
    this.activo = activo;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.proveedor = proveedor;
    this.nombre_comercial = nombre_comercial;
    this.select = select;
    this.id_tipo_promocion = id_tipo_promocion;
    this.id_alcance_promocion= id_alcance_promocion;
    this.minimo = minimo;
    this.maximo_red = maximo_red;
    this.porcentaje = porcentaje;
    this.organizaciones = organizaciones;
    this.plazas = plazas;
    this.productos= productos;
    this.categorias = categorias;
    this.dias= new Array<HorarioPromocionModel>() ;
    this.id_negocio=id_negocio;
  }
}

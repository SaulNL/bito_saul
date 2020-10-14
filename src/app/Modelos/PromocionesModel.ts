import {NegocioModel} from "./NegocioModel";

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
  public activo: number;

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public activo_public:number;

  public fecha_inicio_public: Date;
  public fecha_fin_public: Date;

  public proveedor:string;
  public id_proveedor:number;

  public nombre_comercial: string;
  totalPublicaciones: number;

  public id_negocio:number;
  public jsonImagenCuadrada:string;
  public jsonImagenBanner:string;

  public id_publicacion:number;
}

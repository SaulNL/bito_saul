import {DetDomicilioModel} from './busqueda/DetDomicilioModel';

export class SolicitudesModel {
  public id_solicitud: number;
  public id_negocio: number;
  public solicitud: string;
  public datosnegocio:string
  public descripcion: string;
  public tags: Array<string> = new Array<string>();
  public fecha_inicio: Date;
  public fecha_fin: Date;s
  public imagen: any;
  public imagenBanner: any;
  public imagenPoster: any;
  public url_imagen: string;
  public url_imagen_banner: string;
  public url_imagen_poster: string;

  public fecha_inicio_public: Date;
  public fecha_fin_public: Date;

  public proveedor:string;
  public id_proveedor:number;
  public id_persona:number;

  public jsonImagenCuadrada:string;
  public jsonImagenBanner:string;
  public jsonImagenPoster:string;

  public activo:any;
  public activo_public:any;
  public totalPublicaciones:number;

  public id_tipo_negocio:number;
  public id_giro:number;
  public id_categoria:number;
  public nombre_categoria:string;

  public categoria:string;

  public telefono;
  public correo;

  public det_domicilio: DetDomicilioModel = new DetDomicilioModel();

  public id_solicitud_negocio;
  public id_persona_solicitud;

  public giro_negocio;
  public ubicacion: any;

  public numPostulados: number;
}

import {DetDomicilioModel} from './DetDomicilioModel';
import {ArchivoComunModel} from "./ArchivoComunModel";
import {DiaModel} from './DiaModel';
import {HorarioNegocioModel} from './HorarioNegocioModel';

export class NegocioModel {

  public id_negocio: number;
  public rfc: string;
  public descripcion: string;
  public nombre_comercial: string;
  public url_logo: string;
  public id_tipo_negocio: number;
  public id_domicilio: number;
  public id_facebook: string;
  public sitio_web: string;
  public telefono: string;
  public correo: string;
  public especifique_tipo_negocio: string;
  public activo: boolean;
  public giro: string;
  public entrega_domicilio: boolean;
  public consumo_sitio: boolean;
  public entrega_sitio: boolean;
  public alcance_entrega: string;
  public tiempo_entrega_kilometro: string;
  public costo_entrega: number;
  public dias:Array<HorarioNegocioModel>;
  public det_domicilio: DetDomicilioModel;
  public id_giro: any;
  public celular: any;
  public whatsapp: any;
  public instagram: any;
  public youtube: any;
  public twitter: any;
  public tiktok: any;
  public otro: any;
  public id_proveedor: number;
  logo: ArchivoComunModel;
  local: ArchivoComunModel;
  url_local: string;
  id_categoria_negocio: any;
  otra_categoria: string;
  otra_subcategoria: string;

  organizaciones: string;
  nombre_organizacion: string;
  tags: any;

  public horarios: Array<HorarioNegocioModel>;
  suspendido: boolean;
  public url_negocio;
  public tipo_pago_transferencia:number;
  public tipo_pago_tarjeta_credito:number;
  public tipo_pago_tarjeta_debito:number;
  public tipo_pago_efectivo:boolean;

  constructor(
    id_negocio = null,
    rfc = null,
    descripcion = null,
    nombre_comercial = null,
    url_logo = null,
    id_tipo_negocio = null,
    id_domicilio = null,
    id_facebook = null,
    sitio_web = null,
    telefono = null,
    correo = null,
    especifique_tipo_negocio = null,
    activo = null,
    giro = null,
    entrega_domicilio = null,
    alcance_entrega = null,
    tiempo_entrega_kilometro = null,
    costo_entrega = 30,
    otra_categoria = null,
    otra_subcategoria = null
  ) {
    this.id_negocio = id_negocio;
    this.rfc = rfc;
    this.descripcion = descripcion;
    this.nombre_comercial = nombre_comercial;
    this.url_logo = url_logo;
    this.url_logo = null;
    this.id_tipo_negocio = id_tipo_negocio;
    this.id_domicilio = id_domicilio;
    this.id_facebook = id_facebook;
    this.sitio_web = sitio_web;
    this.telefono = telefono;
    this.correo = correo;
    this.especifique_tipo_negocio = especifique_tipo_negocio;
    this.activo = activo;
    this.giro = giro;
    this.entrega_domicilio = entrega_domicilio;
    this.alcance_entrega = alcance_entrega;
    this.tiempo_entrega_kilometro = tiempo_entrega_kilometro;
    this.costo_entrega = costo_entrega;
    this.det_domicilio = new DetDomicilioModel();
    this.logo = new ArchivoComunModel();
    this.local = new ArchivoComunModel();
    this.dias= new Array<HorarioNegocioModel>() ;
    this.otra_categoria = otra_categoria;
    this.otra_subcategoria = otra_categoria;
  }
}

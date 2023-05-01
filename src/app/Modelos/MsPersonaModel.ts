import {DetDomicilioModel} from './DetDomicilioModel';
import {ArchivoComunModel} from "./ArchivoComunModel";
import {CatOrganizacionesModel} from "./busqueda/CatOrganizacionesModel";

export class MsPersonaModel{

  public id_persona:number;
  public nombre:string;
  public paterno:string;
  public materno:string;
  public rfc:string;
  public telefono_casa:string;
  public telefono_celular:string | null;
  public celular:string;
  public telefono_otro:string;
  public correo:string | null;
  public fecha_nacimiento:any;
  public genero:any;
  public id_facebook:string;
  public convertir_proveedor:boolean;
  public organizaciones: Array<CatOrganizacionesModel>;

  public det_domicilio:DetDomicilioModel;
  public selfie: ArchivoComunModel;
  public ine: ArchivoComunModel;
  public comprobante: ArchivoComunModel;
  public ine1: ArchivoComunModel;
  public ine2: ArchivoComunModel;
  public ineFrente: ArchivoComunModel;
  public ineAtras: ArchivoComunModel;
  public imagen: string;
  public telefono: any;
  public afiliaciones: any;
  constructor(
    id_persona:number = 0,
    nombre:string = '',
    paterno:string = '',
    materno:string = '',
    rfc:string = '',
    telefono_casa:string = '',
    telefono_celular = '',
    telefono_otro = null,
    correo:string = '',
    fecha_nacimiento:string = '',
    genero:any = '',
    id_facebook:string = '',
    organizaciones:Array<CatOrganizacionesModel> = null
  ){
    this.id_persona = id_persona;
    this.nombre = nombre;
    this.paterno = paterno;
    this.materno = materno;
    this.rfc = rfc;
    this.telefono_casa = telefono_casa;
    this.telefono_celular = telefono_celular;
    this.telefono_otro = telefono_otro;
    this.correo = correo;
    this.fecha_nacimiento = fecha_nacimiento;
    this.genero = genero;
    this.id_facebook = id_facebook;

    this.det_domicilio = new DetDomicilioModel();
    this.ineFrente = new ArchivoComunModel();
    this.ineAtras = new ArchivoComunModel();

    this.organizaciones = organizaciones;
  }

}

import {DetDomicilioModel} from './DetDomicilioModel';

export class MsPersonaModel {
  public id_persona: number;
  public nombre: string;
  public paterno: string;
  public materno: string;
  public rfc: string;
  public telefono_casa: string;
  public telefono_celular: string;
  public telefono_otro: string;
  public correo: string;
  public fecha_nacimiento: string;
  public genero: any;
  public id_facebook: string;

  public det_domicilio: DetDomicilioModel;

  constructor(
    id_persona: number = 0,
    nombre: string = '',
    paterno: string = '',
    materno: string = '',
    rfc: string = '',
    telefono_casa: string = '',
    telefono_celular = '',
    telefono_otro = null,
    correo: string = '',
    fecha_nacimiento: string = '',
    genero: any = '',
    id_facebook: string = ''
  ) {
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
  }
}

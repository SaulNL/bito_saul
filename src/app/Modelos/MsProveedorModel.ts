import {DetDomicilioModel} from './DetDomicilioModel';
import {ArchivoComunModel} from './ArchivoComunModel';


export class MsProveedorModel{

  public id_proveedor: number;
  public nombrer: string;
  public apellidos: string;
  public id_persona: string;
  public rfc: string;
  public telefono: string;
  public celular: string;
  public genero: number;
  public correo: string;
  public contrasenia: string;
  public contraseniaRep: string;
  public sexo: number;
  public nombre: string;
  public global: boolean;
  public local: boolean;
  public descripcion: string;
  public det_domicilio: DetDomicilioModel;
  public domicilio: DetDomicilioModel;
  public selfie: ArchivoComunModel;
  public ine: ArchivoComunModel;
  public comprobante: ArchivoComunModel;
  public valido: number;
  public imagen: string;

  public archivo: Array<ArchivoComunModel>;

  public nombre_proveedor: string;
  public nombre_comercial: string;
  public razon_social: string;
  public productos_servicios: string;
  public satisfaccionProveedor: number;

}

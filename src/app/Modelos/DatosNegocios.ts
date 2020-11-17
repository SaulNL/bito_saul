import {DetDomicilioModel} from './DetDomicilioModel';
import {DtosMogoModel} from './DtosMogoModel';
import {ArchivoComunModel} from "./ArchivoComunModel";

export class DatosNegocios {
  public _id: string;
  public idProveedor: number;
  public id_negocio: number;
  public domicilio: DetDomicilioModel;
  public productos: Array<DtosMogoModel>;
  public servicios: Array<DtosMogoModel>;
  public productoTags: Array<string>;
  public serviciosTags: Array<string>;
  public cartaProducto: any;
  public cartaServicio: any;


  constructor(id =  null, idProveedor = null) {
    this._id = id;
    this.idProveedor = idProveedor;
    this.domicilio = new DetDomicilioModel();
    this.cartaProducto = null;
    this.cartaServicio = null;
    this.productos = [];
    this.servicios = [];
    this.productoTags = [];
    this.serviciosTags = [];
  }
}

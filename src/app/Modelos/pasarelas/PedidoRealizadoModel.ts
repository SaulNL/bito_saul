import {DetallePedidoModel} from './DetallePedidoModel';

export class PedidoRealizadoModel {
  private idNegocio: string;
  private idPedidoNegocio: string;
  private logo: string;
  private negocio: string;
  private fecha: string;
  private nombre: string;
  private paterno: string;
  private materno: string;
  private pago: string;
  private detalle: Array<DetallePedidoModel>;

  constructor() {
  }

  inicio(): PedidoRealizadoModel{
    this.idNegocio = null;
    this.idPedidoNegocio = null;
    this.logo = null;
    this.negocio = null;
    this.fecha = null;
    this.nombre = null;
    this.paterno = null;
    this.materno = null;
    this.pago = null;
    this.detalle = [];
    return this;
  }

  get _idnegocio(): string {
    return this.idNegocio;
  }

  set _idnegocio(value: string) {
    this.idNegocio = value;
  }


  get _idPedidoNegocio(): string {
    return this.idPedidoNegocio;
  }

  set _idPedidoNegocio(value: string) {
    this.idPedidoNegocio = value;
  }

  get _logo(): string {
    return this.logo;
  }

  set _logo(value: string) {
    this.logo = value;
  }

  get _negocio(): string {
    return this.negocio;
  }

  set _negocio(value: string) {
    this.negocio = value;
  }

  get _fecha(): string {
    return this.fecha;
  }

  set _fecha(value: string) {
    this.fecha = value;
  }

  get _nombre(): string {
    return this.nombre;
  }

  set _nombre(value: string) {
    this.nombre = value;
  }

  get _paterno(): string {
    return this.paterno;
  }

  set _paterno(value: string) {
    this.paterno = value;
  }

  get _materno(): string {
    return this.materno;
  }

  set _materno(value: string) {
    this.materno = value;
  }

  get _pago(): string {
    return this.pago;
  }

  set _pago(value: string) {
    this.pago = value;
  }

  get _detalle(): Array<DetallePedidoModel> {
    return this.detalle;
  }

  set _detalle(value: Array<DetallePedidoModel>) {
    this.detalle = value;
  }

  contructor(data: any): PedidoRealizadoModel {

    if (data.idNegocio !== null) {
      this.idNegocio = data.idNegocio;
      this.idPedidoNegocio = data.idPedidoNegocio;
      this.logo = data.logo;
      this.negocio = data.negocio;
      this.fecha = data.fecha;
      this.nombre = data.nombre;
      this.paterno = data.paterno;
      this.materno = data.materno;
      this.pago = data.pago;
      this.detalle = data.detalle.map(it => new DetallePedidoModel().contructor(it));
    }
    return this;
  }
}

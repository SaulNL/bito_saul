export class TextVistaPagoModel{
  private _titulo: string;
  private _icono: string;
  private _claseIcono: string;
  private _clase: string;
  private _desscripcion: string;
  private _vistaDetalle: boolean;


  constructor(titulo: string, icono: string, claseIcono: string, clase: string, desscripcion: string, vistaDetalle: boolean) {
    this._titulo = titulo;
    this._icono = icono;
    this._claseIcono = claseIcono;
    this._clase = clase;
    this._desscripcion = desscripcion;
    this._vistaDetalle = vistaDetalle;
  }

  get titulo(): string {
    return this._titulo;
  }

  set titulo(value: string) {
    this._titulo = value;
  }

  get icono(): string {
    return this._icono;
  }

  set icono(value: string) {
    this._icono = value;
  }

  get claseIcono(): string {
    return this._claseIcono;
  }

  set claseIcono(value: string) {
    this._claseIcono = value;
  }

  get clase(): string {
    return this._clase;
  }

  set clase(value: string) {
    this._clase = value;
  }

  get desscripcion(): string {
    return this._desscripcion;
  }

  set desscripcion(value: string) {
    this._desscripcion = value;
  }

  get vistaDetalle(): boolean {
    return this._vistaDetalle;
  }

  set vistaDetalle(value: boolean) {
    this._vistaDetalle = value;
  }
}

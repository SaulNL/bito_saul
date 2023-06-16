export class DetallePedidoModel {
  private logo: string;
  private nombre: string;
  private cantidad: number;
  private costo: number;

  contructor(d): any{
    this.logo = d.logo;
    this.nombre = d.nombre;
    this.cantidad = d.cantidad;
    this.costo = d.costo;

    return this;
  }

  get _logo(): string {
    return this.logo;
  }

  set _logo(value: string) {
    this.logo = value;
  }

  get _nombre(): string {
    return this.nombre;
  }

  set _nombre(value: string) {
    this.nombre = value;
  }

  get _cantidad(): number {
    return this.cantidad;
  }

  set _cantidad(value: number) {
    this.cantidad = value;
  }

  get _costo(): number {
    return this.costo;
  }

  set _costo(value: number) {
    this.costo = value;
  }
}

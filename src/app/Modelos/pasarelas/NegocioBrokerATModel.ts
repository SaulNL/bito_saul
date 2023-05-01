export class NegocioBrokerATModel{
  private idNegocio: number;
  private idBroker: number;
  private accessToken: string;
  private idNegocioBrokers: number;


  contructor(idNegocio: number, idBroker: number, accessToken: string, idNegocioBrokers: number): NegocioBrokerATModel {
    this.idNegocio = idNegocio;
    this.idBroker = idBroker;
    this.accessToken = accessToken;
    this.idNegocioBrokers = idNegocioBrokers;
    return this;
  }

  inicio(): NegocioBrokerATModel {
    this.idNegocio = null;
    this.idBroker = null;
    this.accessToken = null;
    this.idNegocioBrokers = null;
    return this;
  }


  get _idNegocio(): number {
    return this.idNegocio;
  }

  set _idNegocio(value: number) {
    this.idNegocio = value;
  }

  get _idBroker(): number {
    return this.idBroker;
  }

  set _idBroker(value: number) {
    this.idBroker = value;
  }

  get _accessToken(): string {
    return this.accessToken;
  }

  set _accessToken(value: string) {
    this.accessToken = value;
  }

  get _idNegocioBrokers(): number {
    return this.idNegocioBrokers;
  }

  set _idNegocioBrokers(value: number) {
    this.idNegocioBrokers = value;
  }
}

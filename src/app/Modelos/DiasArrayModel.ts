export class DiasArrayModel {
  public id: number;
  public dia: string;
  public horarios: [];
  public hi: null;
  public hf: null;

  constructor(id: number, dia: string, horarios: [], hi: null, hf: null) {
    this.id = id;
    this.dia = dia;
    this.horarios = horarios;
    this.hi = hi;
    this.hf = hf;
  }
}

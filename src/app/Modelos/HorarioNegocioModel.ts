import {DiaModel} from './DiaModel';


export  class HorarioNegocioModel {

  public id_horario : number;
  public dia:string;
  public hora_inicio : string;
  public hora_fin : string;
  public activo : boolean;
  public dias: Array<string>;


  constructor() {
  }
}

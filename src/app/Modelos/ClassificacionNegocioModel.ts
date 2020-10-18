import {MsNegocioModel} from './MsNegocioModel';

export class ClassificacionNegocioModel {


  public nombre: string;
  public negocios: Array<MsNegocioModel>;


  constructor(nombre: string, negocios: Array<MsNegocioModel>) {
    this.nombre = nombre;
    this.negocios = negocios;
  }
}

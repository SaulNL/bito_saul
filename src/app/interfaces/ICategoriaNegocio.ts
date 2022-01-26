import { ICategoria } from './ICategoria';
import { IMsNegocio } from './IMsNegocioModel';
/**
 * @author Armando 20-01-22
 *
 */
export interface ICategoriaNegocio{
  id_categoria_negocio?: number,
  nombre?: string,
  id_giro?: number,
  negocios?: Array<IMsNegocio>
}

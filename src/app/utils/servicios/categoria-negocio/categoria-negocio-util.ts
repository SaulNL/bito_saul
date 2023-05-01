import { ICategoriaNegocio } from '../../../interfaces/ICategoriaNegocio';
import { IMsNegocio } from '../../../interfaces/IMsNegocioModel';
/**
 * @author Armando 20-01-22
 *
 */
export class CategoriaNegocioUtil{

  /**
   *
   * @param respuesta arreglo de los negocios propicionados de la respuesta del servidor
   * se puede crear una nueva interfaz, pero esas consultas se debe arreglar por parte del servidor.
   */
  public static filtrarNegociosPorCategorias(msNegocios: Array<IMsNegocio>): Array<ICategoriaNegocio>{

    let categoriasNegocio: Array<ICategoriaNegocio> = msNegocios.map( negocio =>{
      return {
        id_categoria_negocio: negocio.id_categoria_negocio,
        nombre: negocio.categoria_negocio,
        id_giro: negocio.id_giro,
        negocios: msNegocios.filter( filtroNegocio => filtroNegocio.id_categoria_negocio ==  negocio.id_categoria_negocio)
      };
    });

    return categoriasNegocio.filter((filtroMsNegocio, index, filtroMsNegocios) =>
    {
      return filtroMsNegocios.findIndex(
        busquedaMsNegocios => busquedaMsNegocios.id_categoria_negocio == filtroMsNegocio.id_categoria_negocio ) === index
    });

  }


}

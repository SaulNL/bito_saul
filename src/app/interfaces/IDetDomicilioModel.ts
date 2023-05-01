import { ICatEstado } from './ICatEstado';
import { ICatMunicipio } from './ICatMunicipio';
import { ICatLocalidad } from './ICatLocalidad';
/**
 * @author Armando 20-01-22
 *
 */
export interface IDetDocimicilo {
  id_domicilio?: number;
  calle?: string;
  numero_ext?: number;
  numero_int?: number;
  colonia?: string;
  codigo_postal?: number;
  latitud?: number;
  longitud?: number;
  id_estado?: number;
  id_municipio?: number;
  id_localidad?: number;
  cat_estado?: ICatEstado;
  cat_municipio?: ICatMunicipio;
  cat_localidad?: ICatLocalidad;

}

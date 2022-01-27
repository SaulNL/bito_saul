/**
 * @author Armando 20-01-22
 *
 */
export interface IPromociones {
  id_promocion?: number;
  promocion?: string;
  tags?: Array<string>;
  terminos?: string;
  imagen?: string;
  imagenBanner?: string;
  imagenPoster?: string;
  url_imagen?: string;
  url_imagen_banner?: string;
  url_imagen_poster?: string;
  activo?: number;

  fecha_inicio?: Date;
  fecha_fin?: Date;
  activo_public?: number;

  fecha_inicio_public?: Date;
  fecha_fin_public?: Date;

  proveedor?: string;
  id_proveedor?: number;

  nombre_comercial?: string;
  totalPublicaciones?: number;

  id_negocio?: number;
  jsonImagenCuadrada?: string;
  jsonImagenBanner?: string;

  id_publicacion?: number;

}

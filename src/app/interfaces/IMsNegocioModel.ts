import { IPromociones } from "./IPromociones";
import { IDetDocimicilo } from './IDetDomicilioModel';
import { IArchivoComun } from './IArchivoComun';
import { ICategoria } from './ICategoria';

/**
 * @author Armando 20-01-22
 * Los que estan en any, desconozco cual se el tipo, si se sabe cambiar.
 *
 */
export interface IMsNegocio {
  id_negocio?: number;
  abierto?: string;
  rfc?: string;
  descripcion?: string;
  nombre_comercial?: string;
  nombre_corto?: String;
  url_logo?: string;
  id_tipo_negocio?: number;
  id_domicilio?: number;
  id_facebook?: number;
  sitio_web?: string;
  telefono?: string;
  correo?: string;
  especifique_tipo_negocio?: string;
  activo?: number;
  giro?: string;
  entrega_sitio?: number;
  consumo_sitio?: number;
  entrega_domicilio?: number;
  alcance_entrega?: string;
  tiempo_entrega_kilometro?: string;
  id_giro?: number;
  lstProductos?: Array<any>;
  lstServicios?: Array<any>;
  costo_entrega?: number;
  categorias?: Array<ICategoria>;
  satisfaccionProveedor?: number;
  archivo?: Array<IArchivoComun>;
  det_domicilio?: IDetDocimicilo;
  domicilio?: IDetDocimicilo;
  tipo_pago?: string;
  distancia?: number;
  usuario_like?: any;
  likes?: number;
  lstDatos?: Array<any>;
  categoria_negocio?: any;
  id_categoria_negocio?: number;
  celular?: string;
  catServicos?: any;
  catProductos?: any;
  promociones?: Array<IPromociones>;
  cartaProducto?: string;
  cartaServicio?: string;
  tagsProductos?: Array<string>;
  tagsServicios?: Array<string>;
  calificacion?: number;
  promedio?: number;
  numCalificaciones?: number;
  comentario?: string;
  comentarios?: Array<string>;
  enterDetalleBusqueda?: boolean;
  url_negocio?: string;
}

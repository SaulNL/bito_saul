/**
 * @author Armando 20-01-22
 *
 */
export interface IArchivoComun {
  id_archivo?: number;
  id_salon?: number;
  titulo?: string;
  descripcion?: string;
  nombre_archivo?: string;
  ruta?: string;
  fecha?: string;
  extension?: string;
  active_banner?: string;
  active_galeria?: string
  archivo_64?: any;
}

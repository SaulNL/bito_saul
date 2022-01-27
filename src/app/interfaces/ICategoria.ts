import { IProducto } from './IProducto';
export interface ICategoria {
  nombre?: string;
  id_categoria?: number;
  productos?: Array<IProducto>;
  servicios?: Array<IProducto>;
}

export class CatTipoServicioProveedorModel {

  public id_cat_tipo_servicio_proveedor: number;
  public nombre: string;

  constructor(id_cat_tipo_servicio_proveedor: number = null, nombre: string = '') {
    this.id_cat_tipo_servicio_proveedor = id_cat_tipo_servicio_proveedor;
    this.nombre = nombre;
  }
}

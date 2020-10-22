import { ArchivoComunModel } from "../ArchivoComunModel";
export class FiltroCatTipoVentaModel {
    public id_tipo_venta: number;
    public nombre: string;
    public precio: number;
    public activo: number;
    public imagen: string;
    public icono: ArchivoComunModel;

    constructor(
        id_tipo_venta = null,
        nombre = null,
        precio = null,
        activo = null
    ) {
        this.id_tipo_venta = id_tipo_venta;
        this.nombre = nombre;
        this.precio = precio;
        this.activo = activo;
        this.icono = null;
    }
}
export class FiltroCatTipoNegoModel {
    public id_tipo_negocio: number;
    public nombre: string;
    public activo: number;

    constructor(
        id_tipo_negocio = null,
        nombre = null,
        activo = null
    ) {
        this.id_tipo_negocio = id_tipo_negocio;
        this.nombre = nombre;
        this.activo = activo;
    }
}

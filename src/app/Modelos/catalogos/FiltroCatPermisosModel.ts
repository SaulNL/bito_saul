export class FiltroCatPermisosModel {
    public id_permiso: number;
    public nombre: string;
    public estaSeleccionado: boolean;
    constructor(
        id_permiso = null,
        nombre = null,
        estaSeleccionado = null
    ) {
        this.id_permiso = id_permiso;
        this.nombre = nombre;
        this.estaSeleccionado = estaSeleccionado;
    }
}
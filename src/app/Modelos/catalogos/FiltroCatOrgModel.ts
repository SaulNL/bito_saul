export class FiltroCatOrgModel {
    public id_organizacion: number;
    public nombre: string;
    public acronimo: string;
    public descripcion: string;
    public num_productos: string;
    public num_publicaciones: string;

    constructor(
        id_organizacion = null,
        nombre = null,
        acronimo = null,
        descripcion = null,
        num_productos = null,
        num_publicaciones = null,
    ) {
        this.id_organizacion = id_organizacion;
        this.nombre = nombre;
        this.acronimo = acronimo;
        this.descripcion = descripcion;
        this.num_publicaciones = num_publicaciones;
        this.num_productos = num_productos;
    }
}
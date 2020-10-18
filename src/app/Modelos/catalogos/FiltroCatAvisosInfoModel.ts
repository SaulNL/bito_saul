import { ArchivoComunModel } from "../ArchivoComunModel";
export class FiltroCatAvisosInfoModel {
    public id_aviso: number;
    public nombre: string;
    public descripcion: string;
    public imagen: string;
    public imagen_previa: ArchivoComunModel;
    public activo: number;
    public tipo_aviso: number;
    constructor(
        id_aviso = null,
        nombre = null,
        descripcion = null,
        imagen = null,
        activo = null,
        tipo_aviso = null
    ) {
        this.id_aviso = id_aviso;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.imagen_previa = null;
        this.activo = activo;
        this.tipo_aviso = tipo_aviso;
    }
}
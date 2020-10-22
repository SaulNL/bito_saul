import{FiltroCatPermisosModel} from "./FiltroCatPermisosModel";
export class FiltroCatRolModel {
    public id_rol: number;
    public rol: string;
    public permisos: Array<FiltroCatPermisosModel>;
    public activo: number;
    constructor(
        id_rol = null,
        rol = null,
        permisos: Array<FiltroCatPermisosModel> = [],
        activo = null,
    ) {
        this.id_rol = id_rol;
        this.rol = rol;
        this.permisos = permisos;
        this.activo = activo;
    }
}

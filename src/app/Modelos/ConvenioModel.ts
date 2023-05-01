export class ConvenioModel {
    public id_usuario : number;
    public id_organizacion: number;
    public identificacion: string;
    public nombre_empresa: string;

    constructor(
        id_usuario = 0,
        id_organizacion =0,
        identificacion = '',
        nombre_empresa='',

    ){
        this.id_usuario = id_usuario;
        this.id_organizacion =id_organizacion;
        this.identificacion = identificacion;
        this.nombre_empresa= nombre_empresa;

    }
}


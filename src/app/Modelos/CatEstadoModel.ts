export class CatEstadoModel {
    public id_estado:number;
    public clave:string;
    public abreviatura:string;
    public nombre:string;

    constructor(
        id_estado:number = 0,
        clave:string = '',
        abreviatura:string = '',
        nombre:string = ''
    ){
        this.id_estado = id_estado;
        this.clave = clave;
        this.abreviatura = abreviatura;
        this.nombre = nombre;
    }
}

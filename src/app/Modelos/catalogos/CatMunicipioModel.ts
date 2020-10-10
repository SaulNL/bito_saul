export class CatMunicipioModel{

    public id_municipio:number;
    public clave:string;
    public nombre:string;
    public id_estado:number;


    constructor(
        id_municipio: number = 0,
        clave: string = '',
        nombre: string = '',
        id_estado: number = 0
    ) {
        this.id_municipio = id_municipio;
        this.clave = clave;
        this.nombre = nombre;
        this.id_estado = id_estado;
    }
}
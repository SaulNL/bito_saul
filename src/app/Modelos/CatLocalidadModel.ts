export class CatLocalidadModel {

    public id_localidad: number;
    public clave: string;
    public nombre: string;
    public id_municipio: number;
    public lat: number;
    public lng: number;
    public codigo_postal: number;


    constructor(
        id_localidad: number = 0,
        clave: string = '',
        nombre: string = '',
        id_municipio: number = 0,
        codigo_postal = 0
    ) {
        this.id_localidad = id_localidad;
        this.clave = clave;
        this.nombre = nombre;
        this.id_municipio = id_municipio;
        this.codigo_postal = codigo_postal;
    }
}

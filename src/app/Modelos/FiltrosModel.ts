export class FiltrosModel {
    public strBuscar: string;
    public intEstado: number;
    public strMunicipio: string;
    public kilometros: number;
    public latitud: number;
    public longitud: number;
    public idTipoNegocio: Array<any>;
    public blnEntrega: boolean;
    public idGiro: any;
    public idCategoriaNegocio: Array<any>;
    public idEstado: any;
    public idMunicipio: any;
    public idLocalidad: any;
    public tipoBusqueda: number;
    public idNegocio: number;
    public abierto: any;
    public organizacion: number | null;
    public id_persona: number;
    public user: any;
    public typeGetOption;
    constructor(strBuscar: string = '',
                intEstado: number = 0,
                strMunicipio: string = '',
                kilometros: number = 10,
                latitud: number = 0.0,
                longitud: number = 0.0,
                idTipoNegocio: Array<any> = null,
                idTipoProducto: Array<any> = null,
                blnEntrega: boolean = null,
                idCategoriaNegocio: Array<any> = null,
                idGiro: number = null,
                abierto: number = null,
                id_persona: number = null,
                organizacion: number | null = null
    ) {
        this.strBuscar = strBuscar;
        this.intEstado = intEstado;
        this.strMunicipio = strMunicipio;
        this.typeGetOption = false;
        this.kilometros = kilometros;
        this.latitud = latitud;
        this.longitud = longitud;
        this.idTipoNegocio = idTipoNegocio;
        this.blnEntrega = blnEntrega;
        this.idGiro = idGiro;
        this.idCategoriaNegocio = idCategoriaNegocio;
        this.idEstado = null;
        this.idMunicipio = null;
        this.idLocalidad = null;
        this.abierto = null;
        this.tipoBusqueda = 0;
        this.id_persona = id_persona;
        this.organizacion = organizacion;
    }
}

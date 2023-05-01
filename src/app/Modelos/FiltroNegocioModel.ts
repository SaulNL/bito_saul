export class FiltroNegocioModel {
    public strBuscar: string;
    public intEstado: number;
    public strMunicipio: string;
    public kilometros: number;
    public latitud: number;
    public longitud: number;
    public idTipoNegocio: number | null;
    public blnEntrega: null;
    public idGiro: null;
    public idCategoriaNegocio: null;
    public idEstado: null;
    public idMunicipio: null;
    public idLocalidad: null;
    public abierto: null;
    public tipoBusqueda: number;
    public id_persona: number | null;
    public organizacion: number | null;
    public limpiarF: boolean;
    public typeGetOption: boolean;
    public idNegocio: number;
    
    constructor(idNegocio: number, idPersona: null | number) {
        this.idNegocio = idNegocio;
        this.id_persona = idPersona;
        this.strBuscar = "";
        this.intEstado = 0;
        this.strMunicipio = "";
        this.kilometros = 0;
        this.latitud = 0;
        this.longitud = 0;
        this.idTipoNegocio = null;
        this.blnEntrega = null;
        this.idGiro = null;
        this.idCategoriaNegocio = null;
        this.idEstado = null;
        this.idMunicipio = null;
        this.idLocalidad = null;
        this.abierto = null;
        this.tipoBusqueda = 0;
        this.organizacion = null;
        this.limpiarF = false;
        this.typeGetOption = false;
    }
}

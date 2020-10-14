import {CatEstadoModel} from "./CatEstadoModel";
import {CatMunicipioModel} from "./CatMunicipioModel";
import {CatLocalidadModel} from "./CatLocalidadModel";

export class DetDomicilioModel {

    public id_domicilio: number;
    public calle: string;
    public numero_ext: number;
    public numero_int: number;
    public colonia: string;
    public codigo_postal: number;
    public latitud: number;
    public longitud: number;
    public id_estado: any;
    public id_municipio: any;
    public id_localidad: any;

    public cat_estado: CatEstadoModel;
    public cat_municipio: CatMunicipioModel;
    public cat_localidad: CatLocalidadModel;

    public lat;
    public lng;

    constructor(
        id_domicilio: number = null,
        calle: string = '',
        numero_ext: number = null,
        numero_int: number = null,
        colonia: string = '',
        codigo_postal: number = null,
        latitud: number = null,
        longitud: number = null,
        id_estado: any = '',
        id_municipio: any = '',
        id_localidad: any = '',
        lat: number = null,
        lng: number = null
    ) {
        this.id_domicilio = id_domicilio;
        this.calle = calle;
        this.numero_ext = numero_ext;
        this.numero_int = numero_int;
        this.colonia = colonia;
        this.codigo_postal = codigo_postal;
        this.latitud = latitud;
        this.longitud = longitud;
        this.id_estado = id_estado;
        this.id_municipio = id_municipio;
        this.id_localidad = id_localidad;
        this.cat_estado = new CatEstadoModel();
        this.cat_municipio = new CatMunicipioModel();
        this.cat_localidad = new CatLocalidadModel();
        this.lat = lat;
        this.lng = lng;
    }
}

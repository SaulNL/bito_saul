import {PreguntaModel} from './PreguntaModel';
export class DenunciaModel {
    public id_denuncia_detalle: number;
    public id_persona: number;
    public id_negocio: number;
    public nombre_negocio: string
    public preguntas: Array<PreguntaModel>;
    constructor(id_denuncia_detalle = null,
        id_persona = null,
        id_negocio = null,
        nombre_negocio = null  
    ) {
        this.id_denuncia_detalle = id_denuncia_detalle;
        this.id_persona = id_persona;
        this.id_negocio = id_negocio;
        this.nombre_negocio = nombre_negocio;
        this.preguntas = new Array<PreguntaModel>();


    }
}
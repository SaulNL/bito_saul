export class FiltroEstadisticaModel {
    public id_negocio: number;
    public fecha_inicio: string;
    public fecha_final: string;

    constructor(
        id_negocio = null,
        fecha_inicio = null,
        fecha_final = null
    ){
        this.id_negocio = id_negocio;
        this.fecha_inicio = fecha_inicio;
        this.fecha_final = fecha_final;
    }
}

export interface StatisticsFilterInterface {
    id_negocio: number;
    fecha_inicio: string | moment.Moment;
    fecha_final: string;
    tipo: string;
}
export class StatisticsFilterModel implements StatisticsFilterInterface {
    public id_negocio: number;
    public fecha_inicio: string;
    public fecha_final: string;
    public tipo: string;

    constructor(
        idBusiness: number, initDate: string = null, endDate: string = null, tipo: string = null
    ) {
        this.id_negocio = idBusiness;
        this.fecha_inicio = initDate;
        this.fecha_final = endDate;
        this.tipo = tipo;
    }
}

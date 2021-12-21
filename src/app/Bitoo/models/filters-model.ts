export interface StatisticsFilterInterface {
    id_negocio: number;
    fecha_inicio: string | moment.Moment;
    fecha_final: string;
}
export class StatisticsFilterModel implements StatisticsFilterInterface {
    public id_negocio: number;
    public fecha_inicio: string;
    public fecha_final: string;

    constructor(
        idBusiness: number, initDate: string = null, endDate: string = null
    ) {
        this.id_negocio = idBusiness;
        this.fecha_inicio = initDate;
        this.fecha_final = endDate;
    }
}

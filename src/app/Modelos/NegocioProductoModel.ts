export class NegocioProductoModel {
    public id_negocio: number;
    public nombre_comercial: string;
    public url_negocio: string;
    public entrega_domicilio: number;
    public entrega_sitio: number;
    public consumo_sitio: number;
    public abierto: string;

    constructor(id_negocio: number, nombre_comercial: string, url_negocio: string, entrega_domicilio: number, entrega_sitio: number, consumo_sitio: number, abierto: string) {
        this.id_negocio = id_negocio;
        this.nombre_comercial = nombre_comercial;
        this.url_negocio = url_negocio;
        this.entrega_domicilio = entrega_domicilio;
        this.entrega_sitio = entrega_sitio;
        this.consumo_sitio = consumo_sitio;
        this.abierto = abierto;
    }
}

import { ProductoPedidoModule } from "./ProductoPedidoModel";

export class PedidoNegocioModel {
    public idNegocio: number;
    public idPersona: number;
    public idTipoPedido: number;
    public latitud: number;
    public longitud: number;
    public detalle: string;
    public numeroMesa: number;
    public direccion: string;
    public idTipoPago: number;
    public pedido: Array<ProductoPedidoModule>;

    constructor(idNegocio: number, idPersona: number, idTipoPedido: number, pedido: Array<ProductoPedidoModule>, idTipoPago: number) {
        this.idNegocio = idNegocio;
        this.idPersona = idPersona;
        this.idTipoPedido = idTipoPedido;
        this.pedido = pedido;
        this.idTipoPago = idTipoPago;
    }

}

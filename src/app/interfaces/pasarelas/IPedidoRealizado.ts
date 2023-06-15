import {IDetallePedido} from './IDetallePedido';

export interface IPedidoRealizado{
    idNegocio: string|null;
    idPedidoNegocio: string|null;
    logo: string|null;
    negocio: string|null;
    fecha: string|null;
    nombre: string|null;
    paterno: string|null;
    materno: string|null;
    pago: string|null;
    detalle: Array<IDetallePedido>;
}

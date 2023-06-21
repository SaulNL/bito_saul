import { EventoImagen } from './EventoImagen'
import { EventoUrlImagen } from './EventoUrlImagen';

export class EventosModel {
    public activo: number;
    public requiere_confirmacion: number | null;
    public id_evento: number | null;
    public evento: string;
    public id_negocio: number;
    public fecha: string;
    public id_estado: string;
    public id_municipio: string;
    public id_localidad: string;
    public telefono: string;
    public tipo_pago_transferencia: number;
    public tipo_pago_tarjeta_credito: number;
    public tipo_pago_tarjeta_debito: number;
    public tipo_pago_efectivo: number;
    public id_tipo_recurrencia: number;
    public tipo_evento: string;
    public imagen = new EventoImagen() || new EventoUrlImagen();
    public tags: string;

    constructor(activo = 0, requiere_confirmacion = 0, id_evento = null, evento = "", id_negocio = 0, fecha = "", id_estado = "", id_municipio = "", id_localidad = "", telefono = "", tipo_pago_transferencia = 0, tipo_pago_tarjeta_credito = 0, tipo_pago_tarjeta_debito = 0, tipo_pago_efectivo = 0, id_tipo_recurrencia = 0, tipo_evento = "", tags = "") {
        this.activo = activo;
        this.requiere_confirmacion = requiere_confirmacion;
        this.id_evento = id_evento;
        this.evento = evento;
        this.id_negocio = id_negocio;
        this.fecha = fecha;
        this.id_estado = id_estado;
        this.id_municipio = id_municipio;
        this.id_localidad = id_localidad;
        this.telefono = telefono;
        this.tipo_pago_transferencia = tipo_pago_transferencia;
        this.tipo_pago_tarjeta_credito = tipo_pago_tarjeta_credito;
        this.tipo_pago_tarjeta_debito = tipo_pago_tarjeta_debito;
        this.tipo_pago_efectivo = tipo_pago_efectivo;
        this.id_tipo_recurrencia = id_tipo_recurrencia;
        this.tipo_evento = tipo_evento;
        this.tags = tags;
    }
}
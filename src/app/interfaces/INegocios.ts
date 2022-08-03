export interface INegocios{
    id_negocio?: number;
    rfc?: string;
    descripcion?: string;
    nombre_comercial?: string;
    url_logo?: string;
    url_local?: string;
    id_tipo_negocio?: number;
    id_domicilio?: number;
    id_facebook?: number;
    sitio_web?: string;
    telefono?: string;
    correo?: string;
    especifique_tipo_negocio?: string;
    activo?: number;
    entrega_domicilio?: number;
    alcance_entrega?: string;
    tiempo_entrega_kilometro?: string;
    costo_entrega?: number;
    id_giro?: number;
    productos?: string;
    servicios?:string;
    celular?: string;
    whatsapp?:string;
    instagram?:string;
    youtube?:string;
    twitter?:string;
    tiktok?:string;
    otro?:string;
    id_categoria_negocio?: number;
    otra_categoria?: string;
    otra_subcategoria?:string;
    otra_organizacion?:string;
    suspendido?:string;
    tags?:string;
    url_negocio?: string;
    entrega_sitio?: string;
    consumo_sitio?: string;
    tipo_pago_transferencia?: string;
    tipo_pago_tarjeta_credito?: string
    tipo_pago_tarjeta_debito?:string,
    tipo_pago_efectivo?:string,
    negocio_online?:string,
    verificado?:string,
    tipo_negocio?:number,
    lugares_entrega?:string,
    nombre_corto?:string,
    convenio_entrega?: string,
    fecha_alta?: string,
    fecha_ultima_modificacion?: string,
    calle?: string,
    numero_ext?: string,
    numero_int?: string,
    colonia?: string,
    codigo_postal?: string,
    latitud?: number,
    longitud?: number,
    id_estado?: number,
    id_municipio?: number,
    id_localidad?: number,
    comprobante_domicilio?: string,
    //tipo_negocio2 ?: string,
    giro?: string,
    categoria_negocio?: string,
    abierto?: string,
    tienepromociones?: string,
    lstDatos?: Array<any>,
    promociones?: Array<any>
}
  
export interface IContenidosNegocio {
    id_contenido: null,
    id_negocio: number,
    titulo_contenido: string,
    descripcion_contenido: string,
    fecha_contenido: Date,
    tags_contenido: Array<string>,
    activo: number,
    eliminado: number,
    precio: number,
    url_contenido_reducido: {
        nombre_archivo: string
        archivo_64: string
  	},

    url_contenido_completo: {
        nombre_archivo: string,
        archivo_64: string
    },
    fotografias: any,
    videos: any
}

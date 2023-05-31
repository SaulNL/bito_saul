export class EventoUrlImagen {

    public nombre_archivo: string | null;
    public archivo_64: string | null;
    public url_archivo: string

    constructor(nombre_archivo = "", archivo_64 = null, url_archivo = "") {
        this.nombre_archivo = nombre_archivo;
        this.archivo_64 = archivo_64;
        this.url_archivo = url_archivo
    }
}
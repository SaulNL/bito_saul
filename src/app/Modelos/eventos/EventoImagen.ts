export class EventoImagen {

    public nombre_archivo: string;
    public archivo_64: string | null;

    constructor(nombre_archivo = "", archivo_64 = null) {
        this.nombre_archivo = nombre_archivo;
        this.archivo_64 = archivo_64;
    }
}
export class DtosNegocioMogoModel {
    public idNegocio: number | null;
    public nombre: string | null;
    public direccion: number | null;
    public logo: string | null;

    constructor(idNegocio: number | null = null, nombre: string | null = null, direccion: number | null = null, logo: string | null = null) {
        this.idNegocio = idNegocio;
        this.nombre = nombre;
        this.direccion = direccion;
        this.logo = logo;
    }
}

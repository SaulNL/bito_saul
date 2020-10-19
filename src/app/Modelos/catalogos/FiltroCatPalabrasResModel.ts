export class FiltroCatPalabrasResModel {
    public id_palabra: number;
    public palabra: string;
    public activo: number;
    constructor(
        id_palabra = null,
        palabra = null,
        activo = null,
    ) {
        this.id_palabra = id_palabra;
        this.palabra = palabra;
        this.activo = activo;
    }
  }
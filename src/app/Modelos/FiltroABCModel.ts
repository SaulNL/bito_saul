export class FiltroABCModel {
    public id: number;
    public letra: string;
    public activo: number;


    constructor(Idletra: number = 0, letra: string = '', activo: number = 1) {
        this.id = Idletra;
        this.letra = letra;
        this.activo = activo;
    }
}

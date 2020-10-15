export class FiltroCatVariableModel {
    public id_variable: number;
    public nombre: string;
    public variable: string;
    public valor: number;
    public valor_cadena: string;
    public descripcion: string;
    constructor(
        id_variable = null,
        nombre = null,
        variable = null,
        valor = null,
        valor_cadena = null,
        descripcion = null
    ) {
        this.id_variable = id_variable;
        this.nombre = nombre;
        this.variable = variable;
        this.valor = valor;
        this.valor_cadena = valor_cadena;
        this.descripcion = descripcion;
    }
}
export class PreguntaModel {
    public idPregunta: number;
    public pregunta: string;
    public respuesta: boolean;

    constructor(
        idPregunta = 0,
        pregunta = '',
        respueta = false
    ) {
        this.idPregunta = idPregunta;
        this.pregunta = pregunta;
        this.respuesta = respueta;
    }
}
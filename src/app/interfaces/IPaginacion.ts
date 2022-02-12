
export interface IPaginacion{
    totalDePaginasPorConsulta?: number;
    mensaje?: String;
    totalDePaginas?: number;
    actualPagina?: number;
    siguientePagina?:number;
    evento?: any;
    callback?: any;
    tipoDeCarga?:number;
} 
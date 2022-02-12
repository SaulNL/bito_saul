import { IPaginacion } from '../interfaces/IPaginacion';
export class PaginacionUtils{
    public static readonly MENSAJE: String = "Cargar más";
    public static  establecerDatosDePaginacion(respuesta: any): IPaginacion{
        return {
            actualPagina:respuesta.current_page,
            siguientePagina: respuesta.current_page + 1,
            totalDePaginas: respuesta.total,
            totalDePaginasPorConsulta: respuesta.to,
            mensaje: PaginacionUtils.MENSAJE
        };


    }
    

}
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
    public static establecerEventoParaScroll(paginacion: IPaginacion){
        if (paginacion.totalDePaginasPorConsulta < paginacion.totalDePaginas) {
            paginacion.callback()
            setTimeout(() => {
                paginacion.evento.target.complete();
            }, 800) 
          } else {
            paginacion.evento.target.disabled = true;
          }
    }

}
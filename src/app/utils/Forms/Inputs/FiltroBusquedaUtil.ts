import { IFiltroBusqueda } from "src/app/interfaces/pedidos/IFiltroBusqueda";
import { NgbCalendar, NgbDate, NgbPeriod } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from '@angular/core';
/**
 * @author Armando 05-1-22
 */
 @Injectable()
export class FiltroBusquedaUtil {
  constructor(private  calendario: NgbCalendar){

  }

  /**
   *
   * @returns IFiltroBusqueda
   * retorna un limite de fecha entre los ultimos 7 días
   */
  public  obtenerUltimosSieteDias(): IFiltroBusqueda {
    return {
      fechaFinal: this.calendario.getToday(),
      fechaInicio: this.calendario.getNext(this.calendario.getToday(), 'd', -7),
    };
  }
  /**
   *
   * @returns IFiltroBusqueda
   * retorna un limite de fecha entre los ultimos 30 días
   */
  public  obtenerLosUltimosTreintaDias(): IFiltroBusqueda {
    return {
      fechaFinal: this.calendario.getToday(),
      fechaInicio: this.calendario.getNext(this.calendario.getToday(), 'd', -30),
    };
  }
  /**
   *
   * @returns IFiltroBusqueda
   * retorna un limite de fecha entre, hoy
   */
  public  obtenerLosDiasDeHoy(): IFiltroBusqueda {
    return {
      fechaFinal: this.calendario.getToday(),
      fechaInicio: this.calendario.getToday(),
    };
  }
   /**
   *
   * @returns IFiltroBusqueda
   * convierte dada una fecha en Objecto de tipo FiltroBusqueda
   */
  public  convertirAFiltroBusqueda(fechaInicial: NgbDate,
    fechaFinal: NgbDate):  IFiltroBusqueda{
      return {
        fechaFinal: fechaFinal,
        fechaInicio: fechaInicial,
      };

  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-calendario-reservacion',
  templateUrl: './calendario-reservacion.page.html',
  styleUrls: ['./calendario-reservacion.page.scss'],
})
export class CalendarioReservacionPage implements OnInit {
  @Input() diasRecibidos: number[];
  @Input() isAlert: boolean;
  @Output() banderaCalendario: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fechaReservacion: EventEmitter<string> = new EventEmitter<string>();
  @Output() cerrarModalEvent = new EventEmitter<void>();

  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  dias: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  arrayMeses: string[];
  diasDeshabilitar: number[];
  seleccionaMes: string;
  mesSeleccionado: string;
  diaSeleccionado: number;
  diasPorSemana: any;
  anioActual: any;
  banderaMes: boolean;
  fechaFormat: string;

  constructor() {
    //const fechaActual = new Date(this.infoEvento[0]?.fecha);
    const mesActual = new Date().getMonth();
    this.anioActual = new Date().getFullYear();
    this.arrayMeses = this.meses.slice(mesActual);
    this.seleccionaMes = this.meses[mesActual]; // Asigna el mes actual
    this.banderaMes = false;
    this.diasDeshabilitar = [];
  }

  ngOnInit() {
    this.seleccionarMes(this.seleccionaMes);
  }

  seleccionarMes(mes: string) {
    this.diasDeshabilitar = [];
    this.banderaMes = false;
    this.seleccionaMes = mes;
    this.mesSeleccionado = mes;
    this.diaSeleccionado = null;
    // Calcula el número de días del mes seleccionado.
    const indexMes = this.meses.indexOf(mes);
    const numeroDias = new Date(new Date().getFullYear(), indexMes + 1, 0).getDate();
    const primerDia = new Date(new Date().getFullYear(), indexMes, 1).getDay(); // 0 (Domingo) a 6 (Sábado)

    this.diasPorSemana = [];
    let semanaActual = [];
    for (let i = 0; i < primerDia; i++) {
      semanaActual.push(null); // Días vacíos antes del primer día del mes
    }

    for (let i = 1; i <= numeroDias; i++) {
      semanaActual.push(i);
      if (i === numeroDias) {
        // Completar la última semana con días vacíos si es necesario
        while (semanaActual.length < 7) {
          semanaActual.push(null);
        }
        this.diasPorSemana.push([...semanaActual]);
      } else if (semanaActual.length === 7) {
        this.diasPorSemana.push([...semanaActual]);
        semanaActual = [];
      }
    }
  }

  // Cambia el mes dependiendo cual elijas
  cambioMeses(direccion: number) {
    this.seleccionaMes = this.arrayMeses.find(
        (cat) => cat === this.seleccionaMes
    );
    let nuevoIndex = this.arrayMeses.indexOf(this.seleccionaMes) + direccion;
    // Verifica los límites del arreglo de meses
    if (nuevoIndex < 0) {
      nuevoIndex = this.arrayMeses.length - 1;
    } else if (nuevoIndex >= this.arrayMeses.length) {
      nuevoIndex = 0;
    }

    this.seleccionaMes = this.arrayMeses[nuevoIndex];
    this.seleccionarMes(this.seleccionaMes);
    this.diasDeshabilitar = [];
  }

  // Obtiene la fecha de reservacion del evento o fecha actual
  fechaReserva(dia: number): boolean {
    const diaReservacion = new Date().getDate();
    return dia === diaReservacion && this.meses.indexOf(this.seleccionaMes) === new Date().getMonth();
  }

  deshabilitarDias(dia: number): boolean {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const mesEscrito = this.meses[mesActual];

    if ( this.seleccionaMes === mesEscrito ) {
      let encontrado = false;
      const diaReservacion = new Date().getDate();  // Obtener día actual del mes

      this.diasPorSemana.forEach(item => {
        for (let i = 0; i < this.diasRecibidos.length; i++) {
          const dia = this.diasRecibidos[i];
          if (dia !== null) {
            if (item[dia] === diaReservacion || item[dia] > diaReservacion) {
              encontrado = true;
              this.diasDeshabilitar.push(item[dia]);
            }
          }
        }
      });

      // Si no se encontró coincidencia o ya pasó la fecha actual, agregar días deseados a partir de la fecha actual
      if (!encontrado) {
        const diaActual = new Date().getDay();  // Obtener día de la semana actual
        this.diasRecibidos.forEach(diaDeseado => {
          if (diaActual <= diaDeseado) {
            this.diasDeshabilitar.push(this.diasPorSemana[diaReservacion - 1][diaDeseado]);
          }
        });
      }
    } else {
      this.diasPorSemana.forEach(item => {
        for (let i = 0; i < this.diasRecibidos.length; i++) {
          const dia = this.diasRecibidos[i];
          if (dia !== null) {
            this.diasDeshabilitar.push(item[dia]);
          }
        }
      });
    }
    const deshabilitarDias = this.diasDeshabilitar;
    return !deshabilitarDias.includes(dia);
  }

  diaSeleccion(dia: number): boolean {
    return this.diaSeleccionado !== null && dia === this.diaSeleccionado;
  }

  seleccionarDia(dia: number) {
    this.obtenerFechaCompleta(dia);
    this.diaSeleccionado = dia;
  }

  obtenerFechaCompleta(dia: number) {
    const anio = new Date().getFullYear();
    const mes = this.arrayMeses.indexOf(this.mesSeleccionado);
    const fechaCompleta = new Date(anio, mes, dia);

    const fechaDiario = new Date(fechaCompleta);
    const mesReservacion =  fechaDiario.getMonth();
    const diaReservacion = fechaDiario.getDate();

    this.fechaFormat = `${diaReservacion}/${this.arrayMeses[mesReservacion]}/${anio}`;
  }

  mostrarMeses(){
    this.banderaMes = true;
  }

  ocultarMeses(){
    this.banderaMes = false;
  }

  cerrarCalendario(){
    const isAlert = false;
    this.banderaCalendario.emit(isAlert);
    this.cerrarModalEvent.emit();
    if (this.fechaFormat !== null){
      this.fechaReservacion.emit(this.fechaFormat);
    }else{
      this.fechaReservacion.emit(null);
    }
  }
}

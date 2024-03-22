import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { format, parseISO } from 'date-fns';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-calendario-agendas',
  templateUrl: './calendario-agendas.page.html',
  styleUrls: ['./calendario-agendas.page.scss'],
})
export class CalendarioAgendasPage implements OnChanges {
  @Input() lstAgenda: any;
  @Output() cancelarUnaCita = new EventEmitter<string>();
  @ViewChild(IonContent) content: IonContent;
  public lstAgendaFiltrada: any;
  public mesActual: any;
  public diasSemana: string[] = [];
  public diasMes: any[][] = [];
  public anios: any[];
  public mesesAnios: { mes: number; anio: number }[] = [];
  public fechaSeleccionada: { mes: number; anio: number };
  public mostrarSelect: boolean = false;
  public lstMeses = [
    { nombre: 'Enero', numero: 0 },
    { nombre: 'Febrero', numero: 1 },
    { nombre: 'Marzo', numero: 2 },
    { nombre: 'Abril', numero: 3 },
    { nombre: 'Mayo', numero: 4 },
    { nombre: 'Junio', numero: 5 },
    { nombre: 'Julio', numero: 6 },
    { nombre: 'Agosto', numero: 7 },
    { nombre: 'Septiembre', numero: 8 },
    { nombre: 'Octubre', numero: 9 },
    { nombre: 'Noviembre', numero: 10 },
    { nombre: 'Diciembre', numero: 11 },
  ];
  public mostrarConfirmacion = false;
  public datosCitaCancelar: any;
  public citasPorPagina: number;     // Número de citas que se mostrarán por página
  public paginaActual: number;
  constructor() {
    this.mesActual = [];
    this.datosCitaCancelar = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paginaActual = 1;
    this.citasPorPagina = 4;
    this.diasSemana = this.getDiasSemanaCompleta();

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;

    // Configurar fechaSeleccionada como el mes y año actuales
    this.fechaSeleccionada = { mes: mesActual, anio: fechaActual.getFullYear() };
    // Agregar rango de años + ó -
    const anioInicial = fechaActual.getFullYear();
    const anioFinal = fechaActual.getFullYear();

    for (let anio = anioInicial; anio <= anioFinal; anio++) {
      for (let mes = 1; mes <= 12; mes++) {
        this.mesesAnios.push({ mes, anio });
      }
    }
    this.obtenerInfoDelMes( mesActual, fechaActual.getFullYear());
  }
  seleccionarMes(event: CustomEvent) {
    this.mesActual = [];
    this.diasMes = [];
    const seleccionado = event.detail.value;
    this.obtenerInfoDelMes(seleccionado.mes, seleccionado.anio);
    this.mostrarSelect = false;
  }


  obtenerInfoDelMes(mes: number, anio: number): void {
    const mesMod = mes;

    const monthInfo = this.getMonthInfo(anio, mesMod);
    this.mesActual = monthInfo;
    this.calcularDiasMes();

  }

  getMonthInfo(year: number, month: number): any[] {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const monthInfo: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      monthInfo.push({
        day,
        dayOfWeek,
        date: currentDate.toISOString()
      });
    }

    return monthInfo;
  }

  arraySemana(array: any[], size: number): any[] {
    // Función para dividir el array en subarrays de un tamaño específico (en este caso, 7 días por semana)
    const resultArray = [];
    for (let i = 0; i < array.length; i += size) {
      resultArray.push(array.slice(i, i + size));
    }
    return resultArray;
  }

  esMesActual(date: string): boolean {
    // Implementa lógica para verificar si la fecha pertenece al mes actual
    // Puedes compararla con la fecha actual u otras lógicas según tus necesidades
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Nota: Los meses en JavaScript son 0-indexados
    const currentYear = currentDate.getFullYear();
    const selectedDate = new Date(date);
    return selectedDate.getMonth() + 1 === currentMonth && selectedDate.getFullYear() === currentYear;
  }



  calcularDiasMes(): void {
    // esta funcion mete los espacios necesarios dependiendo del
    // el 1ro de cada mes para alinearlo con el array de dias de semana
    const primerDia = this.mesActual[0].dayOfWeek; // Obtener el día de la semana del primer día del mes
    // si el dia de la semana es domingo (0) no se insertan espacios en blanco
    if (primerDia === 0) {
      const primerDiaAjustado = primerDia === 0 ? 7 : primerDia;

      for (let i = primerDiaAjustado, dia = 1; dia <= this.mesActual.length; i++, dia++) {
        // Si llegamos al final de la semana, iniciar una nueva fila
        if (i % 7 === 0) {
          this.diasMes.push([]);
        }
        // Agregar día actual al mes
        this.diasMes[this.diasMes.length - 1].push(this.mesActual[dia - 1]);
      }
      // añadir dias faltantes a la ultima semana del mes
      const diasUltimaSemana = this.diasMes[this.diasMes.length - 1].length ;
      if ( diasUltimaSemana < 7 ){
        // si la semana no es cerrada se añaden los elementos restantes para igualar a 7
        const diasfaltantes = 7 - diasUltimaSemana;
        for (let i = 1; i <= diasfaltantes; i++) {
          this.diasMes[this.diasMes.length - 1].push({
            day: '',
            dayOfWeek: i,
            date: ''
          });
        }
      }

    }else {

      // Ajusta primerDia para que sea 0 si es domingo (el primer día de la semana)
      const primerDiaAjustado = primerDia === 0 ? 7 : primerDia;

      // Agregar celdas en blanco en las primeras filas si el mes no comienza en domingo (día 0)
      let primerFila: any[] = [];
      for (let i = 0; i < primerDiaAjustado; i++) {
        primerFila.push({
          day: '',
          dayOfWeek: i,
          date: ''
        });
      }

      // Crear las filas del mes
      this.diasMes = [primerFila];

      // Continuar agregando días al mes hasta que se completen todas las semanas
      for (let i = primerDiaAjustado, dia = 1; dia <= this.mesActual.length; i++, dia++) {
        // Si llegamos al final de la semana, iniciar una nueva fila
        if (i % 7 === 0) {
          this.diasMes.push([]);
        }

        // Agregar día actual al mes
        this.diasMes[this.diasMes.length - 1].push(this.mesActual[dia - 1]);
      }

      // añadir dias faltantes a la ultima semana del mes
      const diasUltimaSemana = this.diasMes[this.diasMes.length - 1].length ;
      if ( diasUltimaSemana < 7 ){
        // si la semana no es cerrada se añaden los elementos restantes para igualar a 7
        const diasfaltantes = 7 - diasUltimaSemana;
        for (let i = 1; i <= diasfaltantes; i++) {
          this.diasMes[this.diasMes.length - 1].push({
            day: '',
            dayOfWeek: i,
            date: ''
          });
        }
      }
    }
    this.llenarAgendaMes();
    this.filtrarAgendaPorFecha(1);
  }



  getDiasSemanaCompleta(): string[] {
    return [ 'Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  }
  abrirSelect() {
    this.mostrarSelect = true;
  }


  llenarAgendaMes(): void {
    this.diasMes.forEach((semana: any) => {
      semana.forEach((dia: any) => {
        // Inicializar el campo reservado
        dia.citaAgendada = 0;
        this.lstAgenda.forEach((cita: any) => {
            if (cita.fecha_servicio !== '0000-00-00 00:00:00'){
              if (this.compararFechas(cita.fecha_servicio, dia.date)) {
                // Marcar como reservado si hay una cita
                dia.citaAgendada = cita.id_estatus_agenda;
                // También podrías almacenar información adicional si es necesario
              }
            }

          });
      });
    });
  }



  compararFechas(fechaAgenda: string, fechaDeMes: string): boolean {
    // Verificar si alguna de las fechas es una cadena vacía
    if (!fechaAgenda || !fechaDeMes) {
      return false;
    }


    // Convertir las cadenas de fecha a objetos Date
    const date1 = parseISO(fechaAgenda);
    const date2 = parseISO(fechaDeMes);
    // Formatear ambas fechas al mismo formato (puedes ajustar el formato según tus necesidades)
    const formattedDate1 = format(date1, 'yyyy-MM-dd');
    const formattedDate2 = format(date2, 'yyyy-MM-dd');

    // Verificar si ambas fechas representan el mismo día
    return formattedDate1 === formattedDate2;
  }


  abrirModalCancelarCita(cita: any) {
    this.datosCitaCancelar.id_negocio_agenda = cita.id_negocio_agenda;
    this.datosCitaCancelar.id_estatus_agenda = 3;
    this.mostrarConfirmacion = true;
  }

  confirmarAccion(accion: boolean) {
    // Realiza la acción correspondiente según la confirmación
    if (accion) {
      this.cancelarUnaCita.emit(this.datosCitaCancelar);
      this.content.scrollToTop(500);
    }
    this.mostrarConfirmacion = false;


  }


  filtrarAgendaPorFecha(opcion: number | CustomEvent): void {
    // Limpiar el array antes de realizar el filtrado
    this.lstAgendaFiltrada = [];
    // si llega un entero o un customEvent esto formatea el dato para que sea valido
    const opcionFormat = typeof opcion === 'number' ? opcion : parseInt(opcion.detail.value, 10);

    switch (opcionFormat){
      case 1:
        // esto filtra las citas para este mes
        this.lstAgenda.forEach((cita) => {
          const fechaCita = new Date(cita.fecha_servicio);
          if (fechaCita.getMonth() + 1 === this.fechaSeleccionada.mes && fechaCita.getFullYear() === this.fechaSeleccionada.anio) {
            this.lstAgendaFiltrada.push(cita);
          }
        });
        break;
      case 2:
        // esto filtra las citas para esta semana

        const hoy = new Date();
        const primerDiaSemana = new Date(hoy);
        primerDiaSemana.setDate(hoy.getDate() - hoy.getDay()); // Ajustar para incluir el domingo actual

        this.lstAgenda.forEach((cita) => {
          const fechaCita = new Date(cita.fecha_servicio);
          const fechaInicioSemana = new Date(primerDiaSemana);
          const fechaFinSemana = new Date(fechaInicioSemana);
          fechaFinSemana.setDate(fechaInicioSemana.getDate() + 6); // Agregar 6 días para obtener el último día de la semana

          // Crear nuevas fechas sin tener en cuenta la hora
          const fechaCitaSinHora = new Date(fechaCita.getFullYear(), fechaCita.getMonth(), fechaCita.getDate());
          const fechaInicioSemanaSinHora = new Date(fechaInicioSemana.getFullYear(), fechaInicioSemana.getMonth(), fechaInicioSemana.getDate());
          const fechaFinSemanaSinHora = new Date(fechaFinSemana.getFullYear(), fechaFinSemana.getMonth(), fechaFinSemana.getDate());

          if (fechaCitaSinHora >= fechaInicioSemanaSinHora && fechaCitaSinHora <= fechaFinSemanaSinHora) {
            this.lstAgendaFiltrada.push(cita);
          }
        });
        break;
      case 3:
        // esto filtra las citas para el dia de hoy

        const ahora = new Date(); // Obtener la fecha y hora actual
        const diaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); // Obtener solo la fecha actual sin la hora

        this.lstAgenda.forEach((cita) => {
          const fechaCita = new Date(cita.fecha_servicio);
          const fechaCitaSinHora = new Date(fechaCita.getFullYear(), fechaCita.getMonth(), fechaCita.getDate());

          if (fechaCitaSinHora.getTime() === diaHoy.getTime()) {
            this.lstAgendaFiltrada.push(cita);
          }
        });
        break;
      case 4:
        // Filtra las citas para la fecha de mañana

        const fechaHoy = new Date(); // Obtener la fecha y hora actual
        const fechaManana = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate() + 1); // Obtener la fecha de mañana

        this.lstAgenda.forEach((cita) => {
          const fechaCita = new Date(cita.fecha_servicio);
          const fechaCitaSinHora = new Date(fechaCita.getFullYear(), fechaCita.getMonth(), fechaCita.getDate());

          if (fechaCitaSinHora.getTime() === fechaManana.getTime()) {
            this.lstAgendaFiltrada.push(cita);
          }
        });
        break;



      default:
        break;
    }

  }
  get citasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.citasPorPagina;
    const fin = inicio + this.citasPorPagina;
    return this.lstAgendaFiltrada.slice(inicio, fin);
  }
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }
  formatearFechaServicio(fechaString: string): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    return `${dia} de ${mes} del ${anio}`;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AgendaContenidosService} from "../../../api/agenda-contenidos.service";
import {format, parseISO} from "date-fns";
import {UtilsCls} from "../../../utils/UtilsCls";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-agendar-servicios',
  templateUrl: './agendar-servicios.component.html',
  styleUrls: ['./agendar-servicios.component.scss'],
})
export class AgendarServiciosComponent implements OnInit {
  @Input() informacionNegocio: any;
  public lstServicios: any;
  public lstServiciosIndividuales: any;
  public lstAgenda: any;
  public lstModalidades: any;
  public lstHorarios: any;
  public lstHorasAtencion: any;
  public idNegocio: number;
  public lstHorasDiaSeleccionado: any;
  public diaSeleccionado: any;
  public horaGuardar: any;
  public servicioGuardar: any;
  public idModalidadGuardar: any;
  public telefonoGuardar: any;
  private user: any;

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
  // el array siguiente son fechas pasadas de los 7 días de la semana
  // para obtener las horas de atención de un negocio
  public lstFechasPasadas: any  = [
    { dia: 'Domingo', fecha: '2024-01-07' },
    { dia: 'Lunes', fecha: '2024-01-08' },
    { dia: 'Martes', fecha: '2024-01-09' },
    { dia: 'Miércoles', fecha: '2024-01-10' },
    { dia: 'Jueves', fecha: '2024-01-11' },
    { dia: 'Viernes', fecha: '2024-01-12' },
    { dia: 'Sábado', fecha: '2024-01-13' }
  ];


  public fechaSeleccionada: { mes: number; anio: number };
  public mostrarSelect: boolean = false;
  public mesesAnios: { mes: number; anio: number }[] = [];
  public diasMes: any[][] = [];
  public mesActual: any;
  public diasSemana: string[] = [];



  constructor(
      private modalController: ModalController,
      private agendaContenidosService: AgendaContenidosService,
      private util: UtilsCls,
      private notificacionService: ToadNotificacionService


      ) {
    this.user = this.util.getUserData();

  }

  ngOnInit() {
    this.lstHorasDiaSeleccionado = [];
    this.obtenerDatosIniciales();
    this.obtenerCantidadHorasPorDia();
  }

  async obtenerDatosIniciales(){
    this.diaSeleccionado = 'sin fecha';
    this.idNegocio = this.informacionNegocio.id_negocio;
    this.lstServicios = this.informacionNegocio.catServicos;
    this.lstServiciosIndividuales = this.lstServicios.flatMap(categoria => categoria.servicios);
    this.diasSemana = this.getDiasSemanaCompleta();

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;

    // Configurar fechaSeleccionada como el mes y año actuales
    this.fechaSeleccionada = { mes: mesActual, anio: fechaActual.getFullYear() };
    // Agregar rango de años + ó -
    const anioInicial = fechaActual.getFullYear();
    const anioFinal = fechaActual.getFullYear() + 1;

    for (let anio = anioInicial; anio <= anioFinal; anio++) {
      const mesInicio = (anio === anioInicial) ? mesActual : 1; // Si es el año actual, comienza desde el mes actual, de lo contrario comienza desde enero
      const mesFin = 12; // Siempre termina en diciembre

      for (let mes = mesInicio; mes <= mesFin; mes++) {
        this.mesesAnios.push({ mes, anio });
      }
    }
    this.lstHorarios = this.obtenerDiasConHorarios(this.informacionNegocio.horarios);

    this.obtenerModalidaDeAgenda(this.informacionNegocio.id_negocio);
    await this.obtenerAgendaDeNegocio(this.informacionNegocio.id_negocio);
    await this.obtenerInfoDelMes( mesActual, fechaActual.getFullYear());
  }
  async cerrarModal() {
    await this.modalController.dismiss();
  }

  abrirSelect() {
    this.mostrarSelect = true;
  }
  seleccionarMes(event: CustomEvent) {
    this.mesActual = [];
    this.diasMes = [];
    const seleccionado = event.detail.value;
    this.obtenerInfoDelMes(seleccionado.mes, seleccionado.anio);
    this.mostrarSelect = false;
  }
  async obtenerInfoDelMes(mes: number, anio: number) {
    const mesMod = mes;

    const monthInfo = this.getMonthInfo(anio, mesMod);
    this.mesActual = monthInfo;
    this.calcularDiasMes();

  }
  getMonthInfo(year: number, month: number): any[] {
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

  }
  getDiasSemanaCompleta(): string[] {
    return [ 'Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  }



  llenarAgendaMes(): void {
    this.diasMes.forEach((semana: any) => {
      semana.forEach((dia: any) => {
        // Inicializar el campo reservado
        dia.citaAgendada = 0;
        dia.cantidadAgendados = 0;



        const numeroDiaSemana = dia.dayOfWeek;

        // Verificar si el número del día está presente en lstHorarios
        dia.diaHabil = this.lstHorarios.includes(numeroDiaSemana) ? 1 : 0;
        dia.diaPasado = 0;

        if (this.esFechaAnterior(dia.date)){
           dia.diaPasado = 1;
         }
        this.lstAgenda.forEach((cita: any) => {
          if (cita.fecha_servicio !== '0000-00-00 00:00:00'){
            if (this.compararFechas(cita.fecha_servicio, dia.date)) {
              // Marcar como reservado si hay una cita
              dia.citaAgendada = cita.id_estatus_agenda;
              // Incrementar el contador de citas agendadas de ese dia
              dia.cantidadAgendados++;
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
  async obtenerAgendaDeNegocio(idNegocio) {
    try {
      const response = await this.agendaContenidosService.obtenerAgendasNegocio(idNegocio).toPromise();
      this.lstAgenda = response.data;

    } catch (error) {
      console.log(error);
    }
  }
  async obtenerModalidaDeAgenda(idNegocio) {
    try {
      const response = await this.agendaContenidosService.obtenerModalidadAgendaServiciosNegocio(idNegocio).toPromise();
      this.lstModalidades = response.data;

    } catch (error) {
      console.log(error);
    }
  }

  async obtenerCantidadHorasPorDia(): Promise<void> {
    for (const fechaPasada of this.lstFechasPasadas) {
      try {
        const respuesta = await this.obtenerHorasDeAtencion(fechaPasada.fecha);
        fechaPasada.horasAtencion = respuesta.length;
      } catch (error) {
        console.log(error);
      }
    }
  }
  async obtenerHorasDeAtencion(fecha: string): Promise<any> {
    try {
      const response = await this.agendaContenidosService.obtenerHorasDeAtencionNegocio(this.idNegocio, fecha).toPromise();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async obtenerHorasDelDia(event: any): Promise<void> {
    this.diaSeleccionado = event.date;

    const fechaFormateada = event.date.slice(0, 10);
    try {
        const respuesta = await this.obtenerHorasDeAtencion(fechaFormateada);
        this.lstHorasDiaSeleccionado = respuesta;

      } catch (error) {
        console.log(error);
      }
  }


  obtenerDiasConHorarios(lstHorarios: any): number[] {
    // Objeto de mapeo para convertir nombres de días en números
    const diaToNumero: { [key: string]: number } = {
      'Domingo': 0,
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6
    };

    // Array para almacenar los números de los días con horarios
    const diasConHorarios: number[] = [];

    // Iterar sobre cada objeto en lstHorarios
    lstHorarios.forEach((horario) => {
      // Dividir el campo "dias" en un array de días utilizando la coma como separador
      const dias = horario.dias.split(',');

      // Filtrar los días válidos presentes en el campo "dias"
      const diasValidos = dias.filter(dia => dia.trim() !== '');

      // Convertir los nombres de los días en números correspondientes
      const numerosDias = diasValidos.map(dia => diaToNumero[dia.trim()]);

      // Agregar los números de días al array diasConHorarios
      numerosDias.forEach(numeroDia => {
        if (!diasConHorarios.includes(numeroDia)) {
          diasConHorarios.push(numeroDia);
        }
      });
    });

    // Ordenar el array y devolverlo
    return diasConHorarios.sort((a, b) => a - b);
  }

  public esFechaAnterior(fecha) {
    // Convertir la fecha proporcionada a un objeto Date
    const fechaProporcionada = new Date(fecha);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Comparar las fechas por su representación en milisegundos
    if (fechaProporcionada.getTime() < fechaActual.getTime()) {
      return true; // La fecha proporcionada es anterior a la fecha actual
    } else {
      return false; // La fecha proporcionada es posterior o igual a la fecha actual
    }
  }
  validarTelefono(event: any) {
    const inputValue = event.target.value;
    // Filtrar solo caracteres numéricos
    const numericValue = inputValue.replace(/\D/g, '');
    // Limitar la longitud a 10 dígitos
    const trimmedValue = numericValue.slice(0, 10);
    // Actualizar el valor del input
    event.target.value = trimmedValue;
  }




  async guardarAgenda(){

    const fechaFormateada = this.formatearFecha(this.diaSeleccionado);
    const agenda = {
      id_negocio_agenda: null,
      id_negocio: this.idNegocio,
      fecha_servicio: fechaFormateada,
      hora_servicio: this.horaGuardar,
      id_producto: this.servicioGuardar.idProducto,
      nombre_producto: this.servicioGuardar.nombre,
      id_estatus_agenda: 1,
      id_modalidad_servicio: this.idModalidadGuardar,
      telefono: this.telefonoGuardar,
      id_persona: this.user.id_persona
    };
    try {
      const response = await this.agendaContenidosService.agendarServicioUsuario(agenda).toPromise();
      if (response.code === 200){
        this.exito('Cita agendada correctamente').then(() => {
          this.cerrarModal();
        });
      }
    } catch (error) {
      console.log(error);
    }


  }
  // @ts-ignore

  async exito(title: any): Promise<void> {
    return new Promise<void>((resolve) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        timer: 5000,
        timerProgressBar: true,
      });
      Toast.fire({
        title: title,
        icon: 'success',
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#009413',
      }).then(() => {
        resolve(); // Resuelve la promesa cuando se cierra la notificación
      });
    });
  }

  formatearFecha(fecha: string): string {
    // Dividir la cadena en partes usando 'T' como delimitador
    const partes = fecha.split('T');
    // La primera parte (índice 0) contiene la fecha en formato 'yyyy-mm-dd'
    const fechaFormateada = partes[0];
    return fechaFormateada;
  }
}

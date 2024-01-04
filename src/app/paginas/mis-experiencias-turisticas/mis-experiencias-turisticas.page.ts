import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import moment from 'moment';
import { ExperienciasTuristicasService } from 'src/app/api/experienciasTuristicas/experiencias-turisticas.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-mis-experiencias-turisticas',
  templateUrl: './mis-experiencias-turisticas.page.html',
  styleUrls: ['./mis-experiencias-turisticas.page.scss'],
})
export class MisExperienciasTuristicasPage implements OnInit {

  public loader: boolean = false;
  public msj = 'Cargando';
  public datosUsuario: any;
  public experienciasPublicadas: any;
  public clickEvento: boolean = false;
  public experienciaImg: string;
  public activoBTN: boolean = false;
  public idExperiencia: any;
  public evReservacion: boolean = false;
  public reservacion: any;
  public cantidadFaltante: number;
  public mostrarInfo: boolean = false;
  public solicitante:string;
  public noPersonas: number;
  public fechaDeReservacion: string;
  public estatus: string;
  public fechaConfirmacion: any;
  public datosReservacion = {
    fc_confirmacion: null,
    id_estatus_reservacion: null,
    id_experiencia_turistica_reservacion: null
  }

  constructor(
    private _router: Router,
    private experienciasService: ExperienciasTuristicasService,
    private notificacionService: ToadNotificacionService,
    private animationCtrl: AnimationController,
  ) {
    this.datosUsuario = JSON.parse(localStorage.getItem('u_data'))
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.obtenerExperienciasRegistradas()
  }

  agregarExperiencia() {
    this._router.navigate(["/tabs/mis-experiencias-turisticas/fermulario-experiencias"])
  }

  obtenerExperienciasRegistradas() {
    console.log('entre')
    this.experienciasService.obtenerExperienciasPersona({id_proveedor:this.datosUsuario.proveedor.id_proveedor}).subscribe(res => {
      if (res.code == 200) {
        this.experienciasPublicadas = res.data;
      }
    }),error => {
          console.log(error)
    }
  }

  obtenerLstReservacion(idReservacion, img, activo) { 
    this.clickEvento = true;
    let eniarIdReservacion = {
          "id_experiencia_turistica": idReservacion
    }
    this.experienciasService.reservacionesExperiencias(eniarIdReservacion).subscribe(Response => {
      console.log('resReservaciones',Response)
      this.experienciaImg = img;
      this.activoBTN = activo == 1 || activo ? true : false;
      this.idExperiencia = idReservacion;
      if (Response.code == 200) {
        this.evReservacion = false;
        this.reservacion = Response.data
        this.cantidadFaltante = this.contarFaltantes(this.reservacion);
      }
      if (Response.code == 302) {
        this.evReservacion = true;
        this.reservacion = null;
      }

    }),
      error => {
        this.notificacionService.error(error);
      }
  }

  onClickItem(event) {
    const icon = event.currentTarget.querySelector('ion-icon');

    // Creamos la animación y la configuramos para mover el ícono
    const moveLeftAnimation = this.animationCtrl.create()
      .addElement(icon)
      .duration(500)
      .fromTo('transform', 'translateX(0)', 'translateX(-10px)');

    // Ejecutamos la animación
    moveLeftAnimation.play();

    // Revertimos la animación después de 500ms
    setTimeout(() => {
      const moveBackAnimation = this.animationCtrl.create()
        .addElement(icon)
        .duration(500)
        .fromTo('transform', 'translateX(-10px)', 'translateX(0)');

      moveBackAnimation.play();
    }, 500);
  }

  editarEvento(idExperiencias) {
    localStorage.setItem("editExperiencias", idExperiencias);
    this._router.navigate(["/tabs/mis-experiencias-turisticas/fermulario-experiencias"])
  }

  eliminarEvento(idExperiencia, index) {
    this.loader = true;
    let body = {
      id_experiencia_turistica: idExperiencia
    }

    this.experienciasPublicadas.splice(index, 1)

    this.experienciasService.eliminarExperiencia(body).subscribe(Response => {
      if (Response.code == 200) {
        this.loader = false;
        this.notificacionService.exito("Se elimino correctamente")
      }
    }),
      error => {
        this.notificacionService.error(error);
      }

  }

  contarFaltantes(json) {
    let contador = 0;

    json.forEach(element => {
      contador = element.fc_confirmacion === null ? contador + 1 : contador;
    });

    return contador;
  }

  verificarActivo() {
    let activo = this.activoBTN ? 0 : 1; 
    // this.activoBTN = this.activoBTN ? false : true;
    let body = {
      "id_experiencia_turistica": this.idExperiencia,
      "activo": activo
    }

    this.experienciasService.activarDesactivarExperiencia(body).subscribe(response => {
      console.log(response)
    }),
      error => {
        this.notificacionService.error(error);
      }

  }

  mostrarInformacion(id) {
    moment.locale('es');
    this.mostrarInfo = true;
    this.solicitante = `${this.reservacion[id].nombresolicitante} ${this.reservacion[id].paternosolicitante} ${this.reservacion[id].maternosolicitante}`;
    this.noPersonas = this.reservacion[id].cantidad_persona;
    this.fechaDeReservacion = moment(this.reservacion[id].fc_realizacion_reservacion).format('dddd D [de] MMMM [de] YYYY')
    this.estatus = this.reservacion[id].estatus;
    let fechaSeteada2 = moment(this.reservacion[id].fc_confirmacion);
    this.fechaConfirmacion = moment(fechaSeteada2).format('dddd D [de] MMMM [de] YYYY');
  }

  cerrarInformacion(){
    this.mostrarInfo = false;
  }

  async quitarReservacion(data) {
    console.log(data)
    this.datosReservacion.fc_confirmacion = await null;
    this.datosReservacion.id_estatus_reservacion = await 1 ;
    this.datosReservacion.id_experiencia_turistica_reservacion = await data.id_experiencia_turistica_reservacion;
    this.enviarReservacion(data,false)
  }

  async guardarReservacion(data) {
    let dias =  new Date();
    const anio = dias.getFullYear();
    const mes = ('0' + (dias.getMonth() + 1)).slice(-2);
    const dia = ('0' + dias.getDate()).slice(-2);
    let fecha = `${anio}-${mes}-${dia}`
    this.datosReservacion.fc_confirmacion = await fecha;
    this.datosReservacion.id_estatus_reservacion = await 2 ;
    this.datosReservacion.id_experiencia_turistica_reservacion = await data.id_experiencia_turistica_reservacion;
    this.enviarReservacion(data,true);
  }

  enviarReservacion(id,tipo){
    let mensaje = tipo == true ? "Se guardó exitosamente": "Se elimino exitosamente"
    this.experienciasService.confirmarExperiencia(this.datosReservacion).subscribe(Response => {
      if(Response.code == 200){
        this.obtenerLstReservacion(id.id_experiencia_turistica,this.experienciaImg,this.activoBTN)
        this.notificacionService.exito(mensaje)
      }
    }),
      error => {
        this.notificacionService.error(error);
      }
  }

}

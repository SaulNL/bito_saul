import { ViewQrPromocionComponent } from './../../../components/viewqr-promocion/viewqr-promocion.component';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RegistrarPromotionService } from "../../../api/registrar-promotion.service";
import { HaversineService, GeoCoord } from "ng2-haversine"
import { PromocionesService } from '../../../api/promociones.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppSettings } from 'src/app/AppSettings';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { element } from 'protractor';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-promocion-info',
  templateUrl: './promocion-info.component.html',
  styleUrls: ['./promocion-info.component.scss'],
})
export class PromocionInfoComponent implements OnInit {

  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() listaDias: any[];

  public noImg = "https://ecoevents.blob.core.windows.net/comprandoando/tinBitoo/Web/PROVEEDOR/LA%20IMAGEN%20NO%20ESTA%20DISPONIBLE%20700%20X%20700.png";
  public diasRestantes: number;
  public diAplica: string;
  public pruebaif: boolean = false
  public blnPermisoUbicacion: any;
  public miLat: any;
  public miLng: any;
  public motrarContacto = true;
  public hoy: any;
  id_cupon_promocion: number;
  isAccordionExpanded: boolean = false;
  isOpen: boolean = false;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private _promociones: PromocionesService,
    private _haversineService: HaversineService,
    private vioPromotionL: RegistrarPromotionService,
    private notificaciones: ToadNotificacionService,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    this.calcularDistancia(this.promocion);
    console.log('promocion', this.promocion);
    this.asignarValores(this.promocion.fecha_fin);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
  }

  asignarValores(fechaFija) {
    const fechaActual = new Date();
    const partesFecha = fechaFija.split('/');
    const fechaFijaObj = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    const diferenciaTiempo = fechaFijaObj.getTime() - fechaActual.getTime();
    this.diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

    if (this.listaDias.length != 0) this.diAplica = this.listaDias[0].dias.join(', ');
    this.crearDiasArray()
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  verMas() {
    this.router.navigate(['/tabs/negocio/' + this.promocion.url_negocio], {
      queryParams: { route: true }
    });
    this.modalController.dismiss();
  }

  verImagen(){
    this.isOpen = true;
  }

  cerrarModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.isOpen = false;
    }
  }

  private calcularDistancia(promocion: any) {
    navigator.geolocation.getCurrentPosition(posicion => {
      this.miLat = posicion.coords.latitude;
      this.miLng = posicion.coords.longitude;
      this.blnPermisoUbicacion = true;
      let start = {
        latitude: this.miLat,
        longitude: this.miLng
      }
      let end = {
        latitude: promocion.latitud,
        longitude: promocion.longitud
      };
      let dis = this._haversineService.getDistanceInKilometers(start, end);
      promocion.distanciaNegocio = dis.toFixed(2);
    },
      error => {
        this.blnPermisoUbicacion = false;
      });
  }

  compartir(promocion) {
    let url = AppSettings.URL_FRONT + 'promocion/' + promocion.id_promocion;
    this.socialSharing.share('😃¡Te recomiendo esta promoción!😉', 'Promoción', promocion.url_imagen, url);
  }

  async crearModal() {
    await this.guardarCupon();
    const modal = await this.modalController.create({
      component: ViewQrPromocionComponent,
      componentProps: {
        'promocion': this.promocion,
        'idPersona': this.idPersona,
        'id_cupon_promocion': this.id_cupon_promocion
      }
    });

    return await modal.present();

  }

  async guardarCupon() {

    var respuesta = await this._promociones.solicitarCupon(this.promocion.id_promocion, this.idPersona).toPromise();
    if (respuesta.code === 200) {

      this.id_cupon_promocion = respuesta.data.id_cupon_promocion
    }
    if (respuesta.code === 402) {

      this.notificaciones.alerta(respuesta.message);
    }

  }

  async crearDiasArray() {
    let diasArray = [];
    let dias = [];
    let diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    this.promocion.horarios.forEach(element => {
      dias.push(element.dias.split(',').filter(item => item.trim() !== ''));
    });

    dias.forEach(element => {
      element.forEach((elements) => {
        diasArray.push({ dia: elements })
      });
    })
    diasSemana.forEach(element => {
      let esta = diasArray.find(day => day.dia == element)
      if (esta == undefined) diasArray.push({ dia: element, horarios: [] })
    })

    const tempArray = [];
    for (const element of diasArray) {
      await Promise.all(this.promocion.horarios.map(async (data) => {
        if (data.dias.includes(element.dia)) {
          const horarios = {
            dia: element.dia,
            horarios: [{
              hf: data.hora_fin,
              hi: data.hora_inicio,
              texto: `${data.hora_inicio} a ${data.hora_fin}`
            }]
          };
          tempArray.push(horarios);
        }
      }));

      const pasa = tempArray.some((item) => item.dia === element.dia);
      if (!pasa) {
        const horarios = {
          dia: element.dia,
          horarios: []
        };
        tempArray.push(horarios);
      }
    }
    diasArray = tempArray;

    this.promocion.diasArray = diasArray
    this.crearStatus()
  }

  crearStatus() {
    let status = {
      mensaje: '',
      tipo: 0,
    }
    const fechaActual = new Date();
    const diaSemana = fechaActual.getDay();
    const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDiaSemana = nombresDias[diaSemana];
    const hora = fechaActual.toLocaleTimeString();

    let dia = this.promocion.diasArray.find(element => element.dia == nombreDiaSemana)

    if (dia.horarios.length > 0) {
      const partesInicio = dia.horarios[0].hi.split(":");
      const horaInicio = parseInt(partesInicio[0], 10) * 100 + parseInt(partesInicio[1], 10);
      const partesFin = dia.horarios[0].hf.split(":");
      const horaFin = parseInt(partesFin[0], 10) * 100 + parseInt(partesFin[1], 10);
      const horaCompleta = "10:49:54";
      const partes = horaCompleta.split(":");
      const horaActual = parseInt(partes[0], 10) * 100 + parseInt(partes[1], 10);

      status.mensaje = `Cierra a las ${dia.horarios[0].hf}`
      status.tipo = horaActual >= horaInicio && horaActual <= horaFin ? 1 : 0;
    } else {
      status.mensaje = "No abre hoy";
      status.tipo = 0;
    }

    this.promocion.estatus = status;
  }

  masInformacion(promocion: any) {
    this.router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
      queryParams: { route: true }
    });
    this.modalController.dismiss();
  }


}

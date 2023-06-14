import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { ViewQrPromocionComponent } from '../viewqr-promocion/viewqr-promocion.component';
import { PromocionesService } from 'src/app/api/promociones.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppSettings } from 'src/app/AppSettings';

/*
declare var require: any;
const haversineCalculator = require('haversine-calculator');*/


@Component({
  selector: 'app-info-promo',
  templateUrl: './info-promo.component.html',
  styleUrls: ['./info-promo.component.scss'],
})
export class InfoPromoComponent implements OnInit {

  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() listaDias: any[];
  public motrarContacto = true;
  public blnPermisoUbicacion: any;
  public miLat: any;
  public miLng: any;
  public hoy: any;
  id_cupon_promocion: number;
  isOpen: boolean = false;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private _haversineService: HaversineService,
    private _promociones: PromocionesService,
    private notificaciones: ToadNotificacionService,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    console.log(this.promocion)
    this.calcularDistancia(this.promocion);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
  }

  verImagen(){
    this.isOpen = true;
  }

  cerrarModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.isOpen = false;
    }
  }


  masInformacion(promocion: any) {
    this.router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
      queryParams: { route: true }
    });
    this.modalController.dismiss();
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

  compartir(promocion) {
    let url = AppSettings.URL_FRONT + 'promocion/' + promocion.id_promocion;
    this.socialSharing.share('😃¡Te recomiendo esta promoción!😉', 'Promoción', promocion.url_imagen, url);
  }
}

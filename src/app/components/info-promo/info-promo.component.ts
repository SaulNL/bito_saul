import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HaversineService, GeoCoord } from "ng2-haversine";

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
  public motrarContacto = true;
  public blnPermisoUbicacion: any;
  public miLat: any;
  public miLng: any;
  public hoy: any;

  constructor( public modalController: ModalController, private router: Router, private _haversineService: HaversineService) { 
  }

  ngOnInit() {
    this.calcularDistancia(this.promocion);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
  }

  masInformacion(promocion: any) {
      this.router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
            queryParams: { route: true }});
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


}

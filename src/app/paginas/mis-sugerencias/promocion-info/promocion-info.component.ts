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
    console.log("promocionInfo", this.promocion, this.idPersona, this.listaDias)
    console.log("esta es la img", this.promocion.url_imagen)
    this.calcularDistancia(this.promocion);
    this.asignarValores(this.promocion.fecha_fin);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
  }

  asignarValores(fechaFija) {
    console.log(fechaFija)
    const fechaActual = new Date();
    const partesFecha = fechaFija.split('/');
    const fechaFijaObj = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    const diferenciaTiempo = fechaFijaObj.getTime() - fechaActual.getTime();
    this.diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    console.log(this.diasRestantes);

    this.diAplica = this.listaDias[0].dias.join(', ');
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

}

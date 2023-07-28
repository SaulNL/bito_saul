import {Component, OnInit, Input, ViewChild, ElementRef, OnChanges, ChangeDetectorRef} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import { Router } from '@angular/router';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { ViewQrPromocionComponent } from '../viewqr-promocion/viewqr-promocion.component';
import { PromocionesService } from 'src/app/api/promociones.service';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppSettings } from 'src/app/AppSettings';
import {UtilsCls} from "../../utils/UtilsCls";
import {ICupoon} from "../../interfaces/ICupon";
import QRCode from "easyqrcodejs";
import html2canvas from "html2canvas";
import {FilesystemDirectory, Plugins} from "@capacitor/core";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {Auth0Service} from "../../api/auth0.service";

const { Filesystem } = Plugins;

/*
declare var require: any;
const haversineCalculator = require('haversine-calculator');*/


@Component({
  selector: 'app-info-promo',
  templateUrl: './info-promo.component.html',
  styleUrls: ['./info-promo.component.scss'],
  providers: [Auth0Service]
})
export class InfoPromoComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() listaDias: any[];
  public motrarContacto = true;
  public blnPermisoUbicacion: any;
  public miLat: any;
  public miLng: any;
  public hoy: any;
  public urlData: string;
  public qr: any;
  registro1 = false;
  registro2 = false;
  registro3 = false;
  public anyFiltros: FiltrosModel;
  arreglo: any;
  id: any;
  public holi: any[] = [];
  organizaciones_cupon: any;
  public lstOrganizaciones: [] = [];
  org_usu: any;
  cupon = true;
  usuario: any;
  loader = false;
  public msj = "Cargando";
  id_cupon_promocion: number;
  isOpen: boolean = false;
  public existeSesion: boolean;

  constructor(
      public modalController: ModalController,
      private router: Router,
      private _haversineService: HaversineService,
      private _promociones: PromocionesService,
      private notificaciones: ToadNotificacionService,
      private socialSharing: SocialSharing,
      private _utils_cls: UtilsCls,
      public alertController: AlertController,
      private auth0: Auth0Service,
      private cdRef: ChangeDetectorRef
  ) {
    this.existeSesion = _utils_cls.existe_sesion();
    this.usuario = this.auth0.getUserData();
  }


  ngOnInit() {
    this.calcularDistancia(this.promocion);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
    this.nombreOrgUsuario();
  }

  ngOnChanges(): void {
    this.cdRef.detectChanges();
  }

  generateQRCode() {

    const cupon: ICupoon = {
      "idPromo": this.promocion.id_promocion,
      "idPer": this.idPersona,
      "idCupon": this.id_cupon_promocion
    };
    this.urlData = btoa(JSON.stringify(cupon));

    const options = {

      text: this.urlData,
      colorLight: '#ffffff',
      colorDark: '#000000',
      dotScale: 0.8,
      width: 300,
      height: 300,
      correctLevel: QRCode.CorrectLevel.H,
      logoBackgroundTransparent: true,
      format: 'PNG',
      compressionLevel: 7,
      quality: 0.75,
    };
    this.qr = new QRCode(this.qrcode.nativeElement, options);

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
    if (!this.existeSesion){
      this.mensajeRegistro();
    }else{
      this.loader = true;
      this.cupon = false;
      await this.guardarCupon();
      this.nombreOrgUsuario();
      this.generateQRCode();
      setTimeout(() => {
        if (this.registro1 || this.registro2) {
          this.crearImagen(this.promocion);
        }
        if (this.registro3) {
          this.notificaciones.error('Este cupón no es valido para usted');
        }
      }, 200);
    }
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

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bituyu!',
      message: "¿Ya tienes una cuenta?",
      buttons: [
        {
          text: "Iniciar sesión",
          cssClass: 'text-grey',
          handler: () => {
            this.router.navigate(['/tabs/login']);
          }
        },
        {
          text: "Registrate",
          cssClass: 'text-rosa',
          handler: () => {
            this.router.navigate(["/tabs/login/sign-up"]);
          },
        },
      ],
    });
    await alert.present();
  }

  nombreOrgUsuario() {

    if (this.promocion.organizaciones === null || this.promocion.organizaciones === undefined || this.promocion.organizaciones.length === 0) {
      this.registro1 = true;
    } else {
      this.anyFiltros = new FiltrosModel();
      this.arreglo = JSON.parse(localStorage.getItem('u_sistema'));
      this.id = this.arreglo.id_persona;
      this.anyFiltros.id_persona = this.id;
      this._promociones.buscarPromocinesPublicadasModulo(this.anyFiltros).subscribe(
          response => {
            this.holi = response.data;
            this.holi.forEach(l => {
              l.promociones.forEach(organizacion => {
                this.organizaciones_cupon = organizacion.organizaciones;
                if (organizacion.organizaciones_usuario.length > 0) {
                  this.lstOrganizaciones = organizacion.organizaciones_usuario;
                }
              })
              this.lstOrganizaciones.forEach(orgu => {
                this.org_usu = orgu
              });

            });
            if (this.org_usu !== null && this.org_usu !== undefined) {
              this.registro2 = true;
            } else {
              this.registro3 = true;
            }
          }
      );
    }
  }


  async crearImagen(promocion) {
    this.loader = false;
    this.cupon = true;
    html2canvas(document.querySelector("#contenidoCupon")).then(canvas => {
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + promocion.nombre_comercial + '.png';
      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: FilesystemDirectory.Documents
      }).then(() => {
        this.notificaciones.exito('Se descargo correctamente cupón de ' + promocion.nombre_comercial);
      }, error => {
        this.notificaciones.error(error);
      });
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }
}

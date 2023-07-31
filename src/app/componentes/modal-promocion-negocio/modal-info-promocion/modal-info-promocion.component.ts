import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PromocionesService} from "../../../api/promociones.service";
import moment from "moment/moment";
import {RegistrarPromotionService} from "../../../api/registrar-promotion.service";
import {UtilsCls} from "../../../utils/UtilsCls";
import {PersonaService} from "../../../api/persona.service";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import {HaversineService} from "ng2-haversine";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {Router} from "@angular/router";
import {ViewQrPromocionComponent} from "../../../components/viewqr-promocion/viewqr-promocion.component";
import {AppSettings} from "../../../AppSettings";
import {AlertController, ModalController} from "@ionic/angular";
import {FiltrosModel} from "../../../Modelos/FiltrosModel";
import {Auth0Service} from "../../../api/auth0.service";
import {FilesystemDirectory, Plugins} from "@capacitor/core";
import {ICupoon} from "../../../interfaces/ICupon";
import QRCode from "easyqrcodejs";
import html2canvas from "html2canvas";

const { Filesystem } = Plugins;

@Component({
  selector: 'app-modal-info-promocion',
  templateUrl: './modal-info-promocion.component.html',
  styleUrls: ['./modal-info-promocion.component.scss'],
  providers: [Auth0Service]
})
export class ModalInfoPromocionComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  public promocionTO: any;
  public idPersona: number;
  public latitud: any;
  public longitud: any;
  public celular: any;
  public descripcion: any;

  public existeSesion: boolean;
  lstAflUsuario: unknown[];
  lstOrgUsuario: unknown[];
  listAfiliacines: any;
  existeAfl: boolean = true;
  private id_cupon_promocion: number;
  public fechaHoy = moment();
  public miLat: any;
  public miLng: any;
  public blnPermisoUbicacion: boolean;
  public anuncio_promo: string = "Promoción";
  public motrarContacto = true;
  public distanciaNegocio: string = "";
  public promoPublico = false;
  public promoAfil = false;
  isOpen: boolean = false;

  hoy: any;
  public diasArray = [
    { id: 1, dia: "Lunes", horarios: [], hi: null, hf: null },
    { id: 2, dia: "Martes", horarios: [], hi: null, hf: null },
    { id: 3, dia: "Miércoles", horarios: [], hi: null, hf: null },
    { id: 4, dia: "Jueves", horarios: [], hi: null, hf: null },
    { id: 5, dia: "Viernes", horarios: [], hi: null, hf: null },
    { id: 6, dia: "Sábado", horarios: [], hi: null, hf: null },
    { id: 7, dia: "Domingo", horarios: [], hi: null, hf: null },
  ];
  public estatus: { tipo: number; mensaje: string };

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

  constructor(
      private router: Router,
      public modalController: ModalController,
      private vioPromo: RegistrarPromotionService,
      private util: UtilsCls,
      private servicioPersona: PersonaService,
      private _promociones: PromocionesService,
      private notificaciones: ToadNotificacionService,
      private _haversineService: HaversineService,
      private socialSharing: SocialSharing,
      private auth0: Auth0Service,
      private cdRef: ChangeDetectorRef,
      public alertController: AlertController,
  ) {
    this.existeSesion = this.util.existe_sesion();
    this.usuario = this.auth0.getUserData();
  }

  ngAfterViewInit(): void {
    this.calcularDistancia(this.promocionTO);
    this.anuncio_promo = this.promocionTO.id_tipo_promocion == 1 ? "Anuncio" : "Promoción"
  }

  ngOnInit() {
    this.promocionTO = this._promociones.getPromocionObj();
    this.idPersona = this._promociones.getIdPersonaObj();
    this.descripcion = this._promociones.getListaDiasObj();
    this.latitud = this._promociones.getLatitudObj();
    this.longitud = this._promociones.getLongituddObj();
    this.celular = this._promociones.getCelularObj();

    this.promocionTO.dias.dias = []
    this.horarios(this.promocionTO.horarios);
    this.promocionTO.estatus = this.estatus
    this.promocionTO.diasArray = this.diasArray
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;

    if (this.existeSesion) {
      this.obtenerOrgAfilUsuario();
    } else {
      this.loader = false;
    }
    if (this.promocionTO.id_tipo_promocion === 1) {
      this.loader = false;
    }
    //this.calcularDistancia(this.promocionTO);
    this.calcularDias(this.promocionTO);
    this.registrarVisitaAPromotion();
    this.nombreOrgUsuario();
  }


  private registrarVisitaAPromotion() {
    this.vioPromo.registrarQuienVio(this.promocionTO.id_promocion, this.idPersona, this.latitud, this.longitud);
  }

  public calcularDias(promocion: any) {
    promocion.restanDias = Math.abs(this.fechaHoy.diff(promocion.fecha_fin_public, 'days'));
  }

  private horarios(horarios: any) {
    this.estatus = { tipo: 0, mensaje: "No abre hoy" };
    const hros = horarios;
    let hoy: any;
    hoy = new Date();
    this.hoy = hoy.getDay() !== 0 ? hoy.getDay() : 7;
    const diasArray = JSON.parse(JSON.stringify(this.diasArray));
    if (hros !== undefined) {
      hros.forEach((horarioTmp) => {
        diasArray.map((dia) => {
          if (
              horarioTmp.dias.includes(dia.dia) &&
              horarioTmp.hora_inicio !== undefined &&
              horarioTmp.hora_fin !== undefined
          ) {
            let dato = {}
            dato = {
              texto: horarioTmp.hora_inicio + " a " + horarioTmp.hora_fin,
              hi: horarioTmp.hora_inicio,
              hf: horarioTmp.hora_fin,
            };
            dia.horarios.push(dato);
          }
        });
      });
      diasArray.map((dia) => {
        if (dia.id === this.hoy) {
          const now = new Date(
              1995,
              11,
              18,
              hoy.getHours(),
              hoy.getMinutes(),
              0,
              0
          );
          let abieto = null;
          let index = null;
          const listaAux = [];
          if (dia.horarios.length !== 0) {
            dia.horarios.map((item, i) => {
              const inicio = item.hi.split(":");
              // tslint:disable-next-line:radix
              const fi = new Date(
                  1995,
                  11,
                  18,
                  parseInt(inicio[0]),
                  parseInt(inicio[1]),
                  0,
                  0
              );
              const fin = item.hf.split(":");
              let aux = 18;
              // tslint:disable-next-line:radix
              if (parseInt(inicio[0]) > parseInt(fin[0])) {
                aux = 19;
              }
              // tslint:disable-next-line:radix
              const ff = new Date(
                  1995,
                  11,
                  aux,
                  parseInt(fin[0]),
                  parseInt(fin[1]),
                  0,
                  0
              );
              listaAux.push({
                valor: (fi.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                index: i,
              });
              if (now >= fi && now <= ff) {
                abieto = true;
                index = i;
              }
            });
            if (abieto) {
              this.estatus = {
                tipo: 1,
                mensaje: "Cierra a las " + dia.horarios[index].hf,
              };
            } else {
              let listaValores: Array<number> = [];
              let siHay = false;
              listaAux.map((item) => {
                listaValores.push(item.valor);
                if (item.valor > 0) {
                  siHay = true;
                }
              });
              if (siHay) {
                listaValores = listaValores.filter((item) => {
                  return item >= 0;
                });
              }
              const valor = Math.min.apply(null, listaValores);
              const valorMax = Math.max.apply(null, listaValores);
              if (valor > 0) {
                listaAux.map((item) => {
                  if (item.valor === valor) {
                    index = item.index;
                  }
                });
                this.estatus = {
                  tipo: 0,
                  mensaje: "Abre a las " + dia.horarios[index].hi,
                };
              } else {
                listaAux.map((item) => {
                  if (item.valor === valorMax) {
                    index = item.index;
                  }
                });
                this.estatus = {
                  tipo: 0,
                  mensaje: "Cerró a las " + dia.horarios[index].hf,
                };
              }
            }
          } else {
            this.estatus = { tipo: 0, mensaje: "No abre hoy" };
          }
        }
      });
      this.diasArray = diasArray;
    }
    this.promocionTO.dias.forEach(dia => {
      let str = dia.dias
      let arr = str.split("");
      let cadenaHoario = ""
      let aux = ""
      arr.forEach((caracter, index) => {
        aux = caracter
        if (aux == ",") {
          if (aux != arr[index + 1]) {
            cadenaHoario += aux
          }
        } else {
          cadenaHoario += aux
        }
      });
      dia.dias = cadenaHoario
    });
  }

  formatoDias(diasCadena: string) {
    let atributosArray = diasCadena.split(",");
    let diasFormateados = atributosArray.map(dia => dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase());
    return diasFormateados.join(",\n");
  }

  public calcularDistancia(promocion: any) {
    navigator.geolocation.getCurrentPosition(async posicion => {
          this.miLat = await posicion.coords.latitude;
          this.miLng = await posicion.coords.longitude;
          this.registrarVisitaAPromotion();
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
          this.distanciaNegocio = dis.toFixed(2);
        },
        error => {
          this.blnPermisoUbicacion = false;
          this.registrarVisitaAPromotion();
        });
  }

  async obtenerOrgAfilUsuario() {
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    var respuesta = await this.servicioPersona.obtenerOrgAfilUsuario(usuario_sistema.id_usuario_sistema).toPromise();

    if (respuesta.code === 200) {

      this.listAfiliacines = Object.values(respuesta.data.list_afiliaciones_usuario);
      this.lstOrgUsuario = Object.values(respuesta.data.list_organizaciones_usuario);

      this.listAfiliacines = this.listAfiliacines.concat(this.lstOrgUsuario);
      if (this.promocionTO.organizaciones.length > 0) {

        this.promoAfil = true;
        this.promoPublico = false;
      } else {
        this.promoPublico = true;
        this.promoAfil = false;
      }

      if (this.listAfiliacines.length > 0) {
        this.existeAfl = false;
        this.loader = false;

      } else {
        this.existeAfl = true;
        this.loader = false;
      }
    }
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
          this.crearImagen(this.promocionTO);
        }
        if (this.registro3) {
          this.notificaciones.error('Este cupón no es valido para usted');
        }
      }, 200);
    }
  }

  masInformacion(promocion: any) {
    /*this.router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
          queryParams: { route: true }});*/
    this.modalController.dismiss();
  }
  compartir(promocion) {
    let url = AppSettings.URL_FRONT + 'promocion/' + promocion.id_promocion;
    this.socialSharing.share('😃¡Te recomiendo esta promoción!😉', 'Promoción', promocion.url_imagen, url);
  }
  async guardarCupon() {

    var respuesta = await this._promociones.solicitarCupon(this.promocionTO.id_promocion, this.idPersona).toPromise();
    if (respuesta.code === 200) {

      this.id_cupon_promocion = respuesta.data.id_cupon_promocion
    }
    if (respuesta.code === 402) {

      this.notificaciones.alerta(respuesta.message);
    }
  }

  verImagen() {
    this.isOpen = true;
  }

  cerrarModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.isOpen = false;
    }
  }

  ngOnChanges(): void {
    this.cdRef.detectChanges();
  }

  generateQRCode() {
    setTimeout(() => {
      const cupon: ICupoon = {
        "idPromo": this.promocionTO.id_promocion,
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
    }, 300);
  }

  nombreOrgUsuario() {

    if (this.promocionTO.organizaciones === null || this.promocionTO.organizaciones === undefined || this.promocionTO.organizaciones.length === 0) {
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
    setTimeout(() => {
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
      this.loader = false;
      this.cupon = true;
    }, 1000);
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bituyú!',
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


}

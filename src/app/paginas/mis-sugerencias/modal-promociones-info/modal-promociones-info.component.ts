import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FiltrosModel} from "../../../Modelos/FiltrosModel";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {PromocionesService} from "../../../api/promociones.service";
import {HaversineService} from "ng2-haversine";
import {RegistrarPromotionService} from "../../../api/registrar-promotion.service";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {Auth0Service} from "../../../api/auth0.service";
import {AppSettings} from "../../../AppSettings";
import {ICupoon} from "../../../interfaces/ICupon";
import QRCode from "easyqrcodejs";
import html2canvas from "html2canvas";
import {FilesystemDirectory, Plugins} from "@capacitor/core";

const { Filesystem } = Plugins;

@Component({
  selector: 'app-modal-promociones-info',
  templateUrl: './modal-promociones-info.component.html',
  styleUrls: ['./modal-promociones-info.component.scss'],
})
export class ModalPromocionesInfoComponent implements OnInit {

  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  public promocion: any;
  public idPersona: number;
  public listaDias: any;

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
      public modalController: ModalController,
      private router: Router,
      private _promociones: PromocionesService,
      private _haversineService: HaversineService,
      private vioPromotionL: RegistrarPromotionService,
      private notificaciones: ToadNotificacionService,
      private socialSharing: SocialSharing,
      private auth0: Auth0Service,
      private cdRef: ChangeDetectorRef
  ) {
    this.usuario = this.auth0.getUserData();
  }

  ngOnInit() {
    this.promocion = this._promociones.getPromocionObj();
    this.idPersona = this._promociones.getIdPersonaObj();
    this.listaDias = this._promociones.getListaDiasObj();

    this.calcularDistancia(this.promocion);
    this.asignarValores(this.promocion.fecha_fin);
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
    this.nombreOrgUsuario();
  }

  ngOnChanges(): void {
    this.cdRef.detectChanges();
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
    this.loader = true;
    this.cupon = false;
    await this.guardarCupon();
    this.nombreOrgUsuario();
    this.generateQRCode();
    if (this.registro1 || this.registro2) {
      setTimeout(() => {
        this.crearImagen(this.promocion);
      }, 1000);
    }
    if (this.registro3) {
      this.notificaciones.error('Este cupón no es valido para usted');
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

  generateQRCode() {
    setTimeout(() => {
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

    }, 300)
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

}

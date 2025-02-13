
import { LoadingController, ModalController } from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ICupoon } from 'src/app/interfaces/ICupon';
import { File } from '@ionic-native/file/ngx';
import QRCode from 'easyqrcodejs';
import html2canvas from 'html2canvas';
import { Auth0Service } from 'src/app/api/auth0.service';
import { PromocionesService } from '../../api/promociones.service';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-viewqr-promocion',
  templateUrl: './viewqr-promocion.component.html',
  styleUrls: ['./viewqr-promocion.component.scss'],
  providers: [Auth0Service]
})
export class ViewQrPromocionComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() id_cupon_promocion: number | null;
  public qr: any;
  public qrdata: string;
  public urlData: string;
  public capturedImage;
  usuario: any;

  public lstOrganizaciones: [] = [];
  informacionCuponGeneral: any;
  arreglo: any;
  id: any;
  public anyFiltros: FiltrosModel;
  public holi: any[] = [];
  public arreglo2: any;
  public arreglo3: any[] = [];
  org_usu: any;
  loader = false;
  loaderCupon = false;
  public msj = "Cargando";
  registro1 = false;
  registro2 = false;
  registro3 = false;
  organizaciones_cupon: any;
  public imgCupon: any;

  constructor(
    public loadingController: LoadingController,
    public modalController: ModalController,
    public platform: Platform,
    private notifi: ToadNotificacionService,
    private auth0: Auth0Service,
    public file: File,
    private servicioPromociones: PromocionesService
  ) {
    this.usuario = this.auth0.getUserData();
  }

  ngAfterViewInit(): void {

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
      width: screen.width,
      height: screen.height - 500,
      correctLevel: QRCode.CorrectLevel.H,
      logoBackgroundTransparent: true,
      format: 'PNG',
      compressionLevel: 7,
      quality: 0.75,
    };
    this.qr = new QRCode(this.qrcode.nativeElement, options);

  }

  ngOnInit() {
    this.loader = true;
    this.nombreOrgUsuario();

  }

  nombreOrgUsuario() {
    // this.getAfiliacionesUsuario();
    if (this.promocion.organizaciones === null || this.promocion.organizaciones === undefined || this.promocion.organizaciones.length === 0) {
      this.registro1 = true;
      this.loader = false;
    } else {
      this.anyFiltros = new FiltrosModel();
      this.arreglo = JSON.parse(localStorage.getItem('u_sistema'));
      this.id = this.arreglo.id_persona;
      this.anyFiltros.id_persona = this.id;
      // this.arreglo.push(this.id);
      this.servicioPromociones.buscarPromocinesPublicadasModulo(this.anyFiltros).subscribe(
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
            this.loader = false;
          } else {
            this.registro3 = true;
            this.loader = false;
          }
          this.loader = false;
        }
      );
    }
  }

  dismissModal() {
    this.modalController.dismiss();
    this.qrdata = '';
  }

  async descargar() {
    this.loaderCupon = true;
    setTimeout(() => {
      if (this.registro1 || this.registro2) {
        this.crearImagen(this.promocion);
      }
      if (this.registro3) {
        this.loaderCupon = false;
        this.notifi.error('Este cupón no es valido para usted');
      }
    }, 200);
  }

  async crearImagen(promocion) {

    html2canvas(document.querySelector("#contenido")).then(canvas => {
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + promocion.nombre_comercial + '.png';
      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: Directory.Documents
      }).then(() => {
        this.notifi.exito('Se descargo correctamente cupón de ' + promocion.nombre_comercial);
      }, error => {
        this.notifi.error(error);
      });
      this.loaderCupon = false;
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

}


import {LoadingController, ModalController} from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ICupoon } from 'src/app/interfaces/ICupon';

import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import  QRCode from 'easyqrcodejs';
import html2canvas from 'html2canvas';
import { Auth0Service } from 'src/app/api/auth0.service';
import { PromocionesService } from '../../api/promociones.service';
import {FiltrosModel} from '../../Modelos/FiltrosModel';
import { CatOrganizacionesModel } from '../../Modelos/busqueda/CatOrganizacionesModel';


const { Filesystem } = Plugins;
const { Share } = Plugins;

@Component({
  selector: 'app-viewqr-promocion',
  templateUrl: './viewqr-promocion.component.html',
  styleUrls: ['./viewqr-promocion.component.scss'],
  providers: [ Auth0Service]
})
export class ViewqrPromocionComponent implements OnInit {
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
  arreglo:any;
  id:any;
  public anyFiltros: FiltrosModel;
  public holi: any[] = [];
  org_usu:any;
  loader: any;
  public msj = "Cargando";
  registro: any;
  organizaciones_cupon: any;
 
  constructor(
    public loadingController: LoadingController,
    public modalController: ModalController,
    public platform: Platform,
    private notifi: ToadNotificacionService,
    private auth0: Auth0Service,
    public file: File,
    private servicioPromociones: PromocionesService
  ) 
  { 
    this.usuario = this.auth0.getUserData();
  }

  ngAfterViewInit(): void {

    const cupon: ICupoon = {
      "idPromo": this.promocion.id_promocion,
      "idPer": this.idPersona,
      "idCupon": this.id_cupon_promocion
    };
    this.urlData =btoa(JSON.stringify(cupon)) ;
    
    const options = {

      text: this.urlData,
      colorLight: '#ffffff',
      colorDark: '#000000',
      dotScale: 0.8,
      width: screen.width,
      height: screen.height-500,
      correctLevel: QRCode.CorrectLevel.H,
      logoBackgroundTransparent: true,
      format: 'PNG',
      compressionLevel: 7,
      quality: 0.75,
    };
    this.qr=new QRCode(this.qrcode.nativeElement, options);

  }

  ngOnInit() {
    this.loader = true; 
    this.nombreOrgUsuario();
  }

  nombreOrgUsuario(){
   // this.getAfiliacionesUsuario();
    this.anyFiltros = new FiltrosModel();
    this.arreglo = JSON.parse(localStorage.getItem('u_sistema'));
    //console.log("ARREGLO ", JSON.stringify(this.arreglo));
    this.id = this.arreglo.id_persona;
    this.anyFiltros.id_persona=this.id;
   // this.arreglo.push(this.id);
    //console.log("ANY FILTROS ", JSON.stringify(this.anyFiltros));

    this.servicioPromociones.buscarPromocinesPublicadasModulo(this.anyFiltros).subscribe(
      response => {
       // console.log("respuesta2 " + JSON.stringify(response))
      //  console.log("respuesta " + JSON.stringify(response.data))
        this.holi=response.data;

        this.holi.forEach(l=>{
          l.promociones.forEach(organizacion => {
          this.organizaciones_cupon=organizacion.organizaciones;
        //  console.log("ORG USU" + JSON.stringify(this.organizaciones_cupon))

            if (organizacion.organizaciones_usuario.length > 0) {
              this.lstOrganizaciones = organizacion.organizaciones_usuario;
            //  console.log("organiziiiiiiiiiiiiiiiiiii" + JSON.stringify(this.lstOrganizaciones))
            }
          })
         
        this.lstOrganizaciones.forEach(orgu => {
         
          this.org_usu=orgu
        //  console.log("ORGANIZACION2" + JSON.stringify(this.org_usu));

        });
        
        });
      //  console.log("ORGANIZACIONWAN" + JSON.stringify(this.org_usu));
       // console.log("ORGANIZACIONWAN2" + JSON.stringify(this.nom_org));
        if(this.org_usu !== null && this.org_usu !== undefined){
          this.registro = true;
          this.loader = false;
          
        }else{
          this.registro = false;
          this.loader = false;
        }
        this.loader = false;
      }
    );  
  }

  dismissModal() {
    this.modalController.dismiss();
    this.qrdata = '';
  }

  descargar() {
    //if (this.platform.is('ios')) {
      //this.descargarIOS();
    //} else {
      this.crearImagen(this.promocion);
    //}
  }
  crearImagen(promocion) {
    html2canvas(document.querySelector("#contenido")).then(canvas => {

      this.capturedImage = canvas.toDataURL();
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + promocion.nombre_comercial + '.png';
      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: FilesystemDirectory.Documents
      }).then(() => {
        this.notifi.exito('Se descargo correctamente cupón de ' + promocion.nombre_comercial);
      }, error => {
        this.notifi.error(error);
      });

    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

}

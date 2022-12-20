import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesModel } from 'src/app/Modelos/PromocionesModel';
import {RegistrarPromotionService} from "../../api/registrar-promotion.service";
import { UtilsCls } from '../../utils/UtilsCls';
import { PersonaService } from '../../api/persona.service';
import { PromocionesService } from '../../api/promociones.service';
import { ViewqrPromocionComponent } from '../../components/viewqr-promocion/viewqr-promocion.component';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import  moment from 'moment';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { AppSettings } from 'src/app/AppSettings';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-promocion-negocio',
  templateUrl: './modal-promocion-negocio.component.html',
  styleUrls: ['./modal-promocion-negocio.component.scss'],
  providers: [UtilsCls],
})
export class ModalPromocionNegocioComponent implements OnInit, AfterViewInit {
  @Input() promocionTO: any;
  @Input() idPersona: number | null;
  @Input() latitud: any;
  @Input() longitud: any;

  @Input() celular:any;
  @Input() descripcion:any;
  public existeSesion: boolean;
  lstAflUsuario: unknown[];
  lstOrgUsuario: unknown[];
  listAfiliacines: any;
  existeAfl: boolean =true;
  private id_cupon_promocion: number;
  loader: boolean;
  public fechaHoy = moment();
  public miLat: any;
  public miLng: any;
  public blnPermisoUbicacion: boolean;
  public anuncio_promo:string="Promoción";
  public motrarContacto = true;
  public distanciaNegocio: string="";
  public promoPublico = false;
  public promoAfil = false;
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
  constructor(private router: Router,
    public modalController: ModalController,
    private vioPromo: RegistrarPromotionService,
    private util: UtilsCls,
    private servicioPersona: PersonaService,
    private _promociones: PromocionesService,
    private notificaciones: ToadNotificacionService,
    private _haversineService: HaversineService,
    private socialSharing: SocialSharing
  ) { 
    this.existeSesion = this.util.existe_sesion();
  }
  ngAfterViewInit(): void {
    this.calcularDistancia(this.promocionTO);
    this.anuncio_promo= this.promocionTO.id_tipo_promocion ==1 ? "Anuncio": "Promoción"    
  }

  ngOnInit() {
    this.horarios(this.promocionTO.horarios);
    this.promocionTO.estatus=this.estatus
    this.promocionTO.diasArray= this.diasArray
     this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;

    if(this.existeSesion){
      this.obtenerOrgAfilUsuario();
    }else{
      this.loader=true;
    }
    if(this.promocionTO.id_tipo_promocion===1){
      this.loader=true;
    }
    //this.calcularDistancia(this.promocionTO);
    this.calcularDias(this.promocionTO);
    this.registrarVisitaAPromotion()
  }
  
  cerrar() {
    this.modalController.dismiss();
    this.promocionTO = new PromocionesModel();
    this.router.navigateByUrl("/tabs/promociones");
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
            console.log(JSON.stringify(dato))
            console.log("dia.horarios={}"+JSON.stringify(dia.horarios))
            dia.horarios.push(dato);
          }
        });
      });
      console.log("se duplica?? arraydias"+JSON.stringify(diasArray))
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
  
  async obtenerOrgAfilUsuario(){
    const usuario_sistema = JSON.parse(localStorage.getItem("u_sistema"));
    var respuesta = await this.servicioPersona.obtenerOrgAfilUsuario(usuario_sistema.id_usuario_sistema).toPromise();

          if (respuesta.code === 200) {

            this.listAfiliacines = Object.values(respuesta.data.list_afiliaciones_usuario);
            this.lstOrgUsuario = Object.values(respuesta.data.list_organizaciones_usuario);

            this.listAfiliacines=this.listAfiliacines.concat(this.lstOrgUsuario);
            if(this.promocionTO.organizaciones.length>0){

              this.promoAfil = true;
              this.promoPublico = false;
              //console.log("ORGANIZACIONES SI AFILIACION PROMO: " + JSON.stringify(this.promocionTO.organizaciones));
            }else{
              this.promoPublico =true;
              this.promoAfil = false;
              //console.log("ORGANIZACIONES NO AFILIACION PROMO: " + JSON.stringify(this.promocionTO.organizaciones));
            }
            
            if(this.listAfiliacines.length>0){
              this.existeAfl =false;
              this.loader=true;
              
            }else{
              this.existeAfl =true;
              this.loader=true;
            }
           
              
          } 
  }

  async crearModal() {
      this.guardarCupon();
      const modal = await this.modalController.create({
        component: ViewqrPromocionComponent,
        componentProps: {
          'promocion': this.promocionTO,
          'idPersona': this.idPersona,
          'id_cupon_promocion': this.id_cupon_promocion
        }
      });
  
      return await modal.present();
  }

  masInformacion(promocion: any) {
    /*this.router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
          queryParams: { route: true }});*/
  this.modalController.dismiss();
}
  compartir(promocion){
    let url = AppSettings.URL_FRONT + 'promocion/' + promocion.id_promocion;
    this.socialSharing.share('😃¡Te recomiendo esta promoción!😉', 'Promoción', promocion.url_imagen, url );
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
}

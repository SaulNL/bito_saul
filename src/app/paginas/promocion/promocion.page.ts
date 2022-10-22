import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';
import { PromocionesService } from 'src/app/api/promociones.service';
import moment from 'moment';
import { HaversineService } from 'ng2-haversine';
import { RegistrarPromotionService } from 'src/app/api/registrar-promotion.service';
import { PromocionesModel } from 'src/app/Modelos/PromocionesModel';
import { ViewqrPromocionComponent } from 'src/app/components/viewqr-promocion/viewqr-promocion.component';
import { UtilsCls } from 'src/app/utils/UtilsCls';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.page.html',
  styleUrls: ['./promocion.page.scss'],
})
export class PromocionPage implements OnInit {

  hoy: any;
  miLat: any;
  miLng: any;
  loader = false;
  idPromo: number;
  motrarContacto = true;
  idPersona: number | null;
  distanciaNegocio: string;
  blnPermisoUbicacion = false;
  id_cupon_promocion: number;
  promociones: Array<PromocionesModel>;
  
  fechaHoy = moment();
  diasArray = [
        {id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null},
        {id: 2, dia: 'Martes', horarios: [], hi: null, hf: null},
        {id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null},
        {id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null},
        {id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null},
        {id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null},
        {id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null},
    ];

  constructor(private router: Router, private location: Location, 
    private notificacionService: ToadNotificacionService, private route: ActivatedRoute,
    private _promociones: PromocionesService, private _haversineService: HaversineService,
    private vioPromotionL: RegistrarPromotionService, private utils: UtilsCls,
    public modalController: ModalController) { 
      this.miLat = null; this.miLng = null; 
    }

  ngOnInit() {
    this.hoy = new Date();
    this.hoy = this.hoy.getDay() !== 0 ? this.hoy.getDay() : 7;
    this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;

    this.route.params.subscribe((params) => {
      this.idPromo = params.id;
      if (
        this.idPromo !== undefined &&
        this.idPromo !== null
      ) {
        this.obtenerInfoPromo();
      } else {
        this.notificacionService.error("Ocurrio un error con esta promocion");
        this.location.back();
      }
    });
  }

  obtenerInfoPromo() {
    this._promociones.obtenerPromocion(this.idPromo).subscribe(response => {
      console.log("prpmocionnnnnnnnnnnnn " +  JSON.stringify(response))
      this.promociones = response.data;

      this.promociones.forEach(promo => {
        this.calcularDistancia(promo);
        this.calcularDias(promo);
        this.horarios(null, promo);
      })
    })
  }

  private horarios(negocio: any, promocion: any) {
    promocion.estatus = {tipo: 0, mensaje: 'No abre hoy'};

    const hros = promocion.horarios;
    let hoy: any;
    hoy = new Date();
    this.hoy = hoy.getDay() !== 0 ? hoy.getDay() : 7;
    const diasArray = JSON.parse(JSON.stringify(this.diasArray));
    if (hros !== undefined) {
        hros.forEach(horarioTmp => {

            diasArray.map(dia => {
                if (horarioTmp.dias.includes(dia.dia) && horarioTmp.hora_inicio !== undefined && horarioTmp.hora_fin !== undefined) {
                    const dato = {
                        texto: horarioTmp.hora_inicio + ' a ' + horarioTmp.hora_fin,
                        hi: horarioTmp.hora_inicio,
                        hf: horarioTmp.hora_fin
                    };
                    dia.horarios.push(dato);
                }
            });

        });

        diasArray.map((dia) => {

            if (dia.id === this.hoy) {
                const now = new Date(1995, 11, 18, hoy.getHours(), hoy.getMinutes(), 0, 0);
                let abieto = null;
                let index = null;
                const listaAux = [];
                if (dia.horarios.length !== 0) {
                    dia.horarios.map((item, i) => {
                        const inicio = item.hi.split(':');
                        // tslint:disable-next-line:radix
                        const fi = new Date(1995, 11, 18, parseInt(inicio[0]), parseInt(inicio[1]), 0, 0);
                        const fin = item.hf.split(':');
                        let aux = 18;
                        // tslint:disable-next-line:radix
                        if (parseInt(inicio[0]) > parseInt(fin[0])) {
                            aux = 19;
                        }
                        // tslint:disable-next-line:radix
                        const ff = new Date(1995, 11, aux, parseInt(fin[0]), parseInt(fin[1]), 0, 0);
                        listaAux.push({valor: ((fi.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), index: i});
                        if (now >= fi && now <= ff) {
                            abieto = true;
                            index = i;
                        }
                    });
                    if (abieto) {
                        promocion.estatus = {tipo: 1, mensaje: 'Cierra a las ' + dia.horarios[index].hf};
                    } else {
                        let listaValores: Array<number> = [];
                        let siHay = false;
                        listaAux.map(item => {
                            listaValores.push(item.valor);
                            if (item.valor > 0) {
                                siHay = true;
                            }
                        });
                        if (siHay) {
                            listaValores = listaValores.filter(item => {
                                return item >= 0;
                            });
                        }
                        const valor = Math.min.apply(null, listaValores);
                        const valorMax = Math.max.apply(null, listaValores);
                        if (valor > 0) {
                            listaAux.map(item => {
                                if (item.valor === valor) {
                                    index = item.index;
                                }
                            });
                            promocion.estatus = {tipo: 0, mensaje: 'Abre a las ' + dia.horarios[index].hi};
                        } else {
                            listaAux.map(item => {
                                if (item.valor === valorMax) {
                                    index = item.index;
                                }
                            });
                            promocion.estatus = {tipo: 0, mensaje: 'Cerró a las ' + dia.horarios[index].hf};
                        }
                    }
                } else {
                    promocion.estatus = {tipo: 0, mensaje: 'No abre hoy'};
                }
            }
        });
        promocion.diasArray = diasArray;
    }
  }

  public calcularDias(promocion: any) {
      promocion.restanDias = Math.abs(this.fechaHoy.diff(promocion.fecha_fin_public, 'days'));
  }

  private calcularDistancia(promocion: any) {
      navigator.geolocation.getCurrentPosition(posicion => {
              this.miLat = posicion.coords.latitude;
              this.miLng = posicion.coords.longitude;
              this.registrarVisitaAPromotion(promocion);
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
              this.registrarVisitaAPromotion(promocion);
          });
  }

  private registrarVisitaAPromotion(promo) {
    this.vioPromotionL.registrarQuienVio(promo.id_promocion, this.idPersona, this.miLat, this.miLng);
  }

  masInformacion() {

  }

  compartir() {

  }

  async modalCupon(promo) {
    await  this.guardarCupon(promo);
      const modal = await this.modalController.create({
        component: ViewqrPromocionComponent,
        componentProps: {
          'promocion': promo,
          'idPersona': this.idPersona,
          'id_cupon_promocion': this.id_cupon_promocion
        }
      });
  
      return await modal.present();
  
    }
  
  async guardarCupon(promo) {

    var respuesta = await this._promociones.solicitarCupon(promo.id_promocion, this.idPersona).toPromise();
    if (respuesta.code === 200) {
        
      this.id_cupon_promocion = respuesta.data.id_cupon_promocion
    }
    if (respuesta.code === 402) {
        
      this.notificacionService.alerta(respuesta.message);
    }
  
  }

  salir() {
    this.router.navigateByUrl("/tabs/promociones");
  }

}

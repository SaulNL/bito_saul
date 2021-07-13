import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PromocionesService } from '../../api/promociones.service';
import { PromocionesModel } from '../../Modelos/PromocionesModel';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { HaversineService, GeoCoord } from "ng2-haversine";


/*
declare var require: any;
const haversineCalculator = require('haversine-calculator');
*/
@Component({
  selector: 'app-modal-promocion',
  templateUrl: './modal-promocion.component.html',
  styleUrls: ['./modal-promocion.component.scss'],
})
export class ModalPromocionComponent implements OnInit {

  @Input() promocion: any;
  public motrarContacto = true;
  public distanciaNegocio: string;
  public blnPermisoUbicacion: any;
  public miLat: any;
  public miLng: any;
  public fechaHoy = moment();
  public diasArray = [
    {id: 1, dia: 'Lunes', horarios: [], hi: null, hf: null},
    {id: 2, dia: 'Martes', horarios: [], hi: null, hf: null},
    {id: 3, dia: 'Miércoles', horarios: [], hi: null, hf: null},
    {id: 4, dia: 'Jueves', horarios: [], hi: null, hf: null},
    {id: 5, dia: 'Viernes', horarios: [], hi: null, hf: null},
    {id: 6, dia: 'Sábado', horarios: [], hi: null, hf: null},
    {id: 7, dia: 'Domingo', horarios: [], hi: null, hf: null},
  ];
  public hoy: number;
  public lstPromociones: Array<PromocionesModel>;
  public promociones: Array<any>;
  public anyFiltros    : FiltrosModel;
  public loader        : boolean = false;

  constructor(public modalController: ModalController, private router: Router, private _promociones: PromocionesService, private _haversineService: HaversineService, private toadNotificacionService: ToadNotificacionService) {
  }

  ngOnInit() {
    this.loader = true;
    this.anyFiltros = new FiltrosModel();
    this.lstPromociones = new Array<PromocionesModel>();
    this.promociones = new Array<PromocionesModel>();
    this.anyFiltros.kilometros = 1;
    this.anyFiltros.idEstado = 29;
    this.obtenerPromociones();
    this.calcularDistancia(this.promocion);
    this.calcularDias(this.promocion);
    this.horarios(null, this.promocion);
  }


  public obtenerPromociones() {
    if (navigator.geolocation && this.anyFiltros.tipoBusqueda === 1) {
      navigator.geolocation.getCurrentPosition(posicion => {
        this.anyFiltros.latitud = posicion.coords.latitude;
        this.anyFiltros.longitud = posicion.coords.longitude;
        this.obtenerPromocionesServicio();
      });
    } else {
      this.anyFiltros.tipoBusqueda = 0;
      this.obtenerPromocionesServicio();
    }
  }

  public obtenerPromocionesServicio() {
    this._promociones.buscarPromocinesPublicadasModulo(this.anyFiltros).subscribe(
      response => {
        if(response.code === 402){

        }
        if (response.data !== null) {
          this.lstPromociones = response.data;
          this.loader = false;
          response.data.forEach( res => {
            res.promociones.forEach( promo => {
              if( promo.id_promocion != this.promocion.id_promocion) {
                this.calcularDistancia(promo);
                this.calcularDias(promo);
                this.horarios(null, promo);
                this.promociones.push(promo);
              }
            });
          });
          this.loader = false;
         // if(this.anyFiltros.strBuscar !== ""){this.modalMapBuscador()}
        } else {
          this.lstPromociones = [];
        }
      },
      error => {
        this.toadNotificacionService.error('No se pudo obtener promociones');
        this.lstPromociones = [];
      },
      () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  }


  masInformacion(promocion: any) {
    this.router.navigateByUrl(`/tabs/negocio/${ promocion.url_negocio }`);
    this.dismissModal();
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

  public calcularDias(promocion: any){
    promocion.restanDias = Math.abs(this.fechaHoy.diff(promocion.fecha_fin_public, 'days'));
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


  dismissModal() {
    this.modalController.dismiss();
  }

}
